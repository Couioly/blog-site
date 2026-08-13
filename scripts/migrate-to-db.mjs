import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import mysql from 'mysql2/promise'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// Load .env
function loadEnv() {
  const envPath = join(ROOT, '.env')
  if (!existsSync(envPath)) return
  const content = readFileSync(envPath, 'utf-8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim()
    if (!process.env[key]) {
      process.env[key] = val
    }
  }
}
loadEnv()

const DB_CONFIG = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'blog',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'blog',
  charset: 'utf8mb4',
}

// Frontmatter parser
function parseFrontmatter(content) {
  // Normalize line endings: \r\n → \n
  const text = content.replace(/\r\n/g, '\n')
  const match = text.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return { body: text, meta: {} }
  const fm = {}
  const lines = match[1].split('\n')
  let currentKey = ''
  let currentList = []

  function flushList() {
    if (currentKey && currentList.length > 0) {
      fm[currentKey] = currentList
    }
    currentKey = ''
    currentList = []
  }

  for (const line of lines) {
    // Check for list item continuation
    const listMatch = line.match(/^\s{2}-\s+(.+)$/)
    if (listMatch && currentKey) {
      const item = listMatch[1].trim().replace(/^['"]|['"]$/g, '')
      currentList.push(item)
      continue
    }

    // Not a list item → flush previous list
    flushList()

    // Check for key: value
    const kv = line.match(/^(\w+):\s*(.*)$/)
    if (!kv) continue

    const keyName = kv[1]
    let val = kv[2].trim()

    // Empty value → might start a multi-line list
    if (!val) {
      currentKey = keyName
      continue
    }

    // Strip surrounding quotes from string values
    if ((val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }

    // Handle inline arrays: [a, b, c]
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean)
    }

    fm[keyName] = val
  }

  // Flush remaining list
  flushList()

  const body = text.slice(match[0].length).trim()
  return { meta: fm, body }
}

async function main() {
  const conn = await mysql.createConnection(DB_CONFIG)
  console.log('[migrate] Connected to MySQL')

  // Create tables
  await conn.execute(`CREATE TABLE IF NOT EXISTS blog (
    slug        VARCHAR(255) PRIMARY KEY,
    title       VARCHAR(500) NOT NULL,
    date        DATE NOT NULL,
    description TEXT,
    tags        JSON DEFAULT ('[]'),
    content     LONGTEXT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FULLTEXT INDEX ft_blog (title, description, content)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)
  console.log('[migrate] Table "blog" ready')

  await conn.execute(`CREATE TABLE IF NOT EXISTS fragments (
    slug        VARCHAR(255) PRIMARY KEY,
    title       VARCHAR(500) NOT NULL,
    date        DATE NOT NULL,
    content     LONGTEXT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)
  console.log('[migrate] Table "fragments" ready')

  // Migrate blog posts
  const blogDir = join(ROOT, 'content', 'blog')
  let blogCount = 0

  if (existsSync(blogDir)) {
    const files = readdirSync(blogDir).filter(f => f.endsWith('.md'))
    console.log(`[migrate] Found ${files.length} markdown files`)

    for (const file of files) {
      const raw = await readFile(join(blogDir, file), 'utf-8')
      const { meta, body } = parseFrontmatter(raw)

      if (!meta.title || !meta.date) {
        console.warn(`[migrate] Skipping ${file}: missing title or date`)
        continue
      }

      const slug = file.replace(/\.md$/, '').toLowerCase()
      const tags = JSON.stringify(Array.isArray(meta.tags) ? meta.tags : [])

      await conn.execute(
        `INSERT INTO blog (slug, title, date, description, tags, content)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           title = VALUES(title), date = VALUES(date),
           description = VALUES(description), tags = VALUES(tags),
           content = VALUES(content), updated_at = CURRENT_TIMESTAMP`,
        [slug, meta.title, meta.date, meta.description || '', tags, body]
      )
      blogCount++
    }
    console.log(`[migrate] Migrated ${blogCount} blog posts`)
  } else {
    console.log('[migrate] No content/blog directory found, skipping blog migration')
  }

  // Migrate fragments
  const fragDir = join(ROOT, 'public', 'fragments')
  let fragCount = 0

  if (existsSync(fragDir)) {
    const files = readdirSync(fragDir).filter(f => f.endsWith('.html'))
    console.log(`[migrate] Found ${files.length} fragment files`)

    for (const file of files) {
      const name = file.replace(/\.html$/, '')
      const dateMatch = name.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/)
      const date = dateMatch ? dateMatch[1] : ''
      const title = dateMatch ? dateMatch[2].replace(/-/g, ' ') : name

      const content = await readFile(join(fragDir, file), 'utf-8')

      await conn.execute(
        `INSERT INTO fragments (slug, title, date, content)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           title = VALUES(title), date = VALUES(date),
           content = VALUES(content), updated_at = CURRENT_TIMESTAMP`,
        [name, title, date, content.trim()]
      )
      fragCount++
    }
    console.log(`[migrate] Migrated ${fragCount} fragments`)
  } else {
    console.log('[migrate] No public/fragments directory found, skipping fragment migration')
  }

  await conn.end()
  console.log(`[migrate] Done — ${blogCount} blog posts + ${fragCount} fragments`)
}

main().catch((e) => {
  console.error('[migrate] Failed:', e)
  process.exit(1)
})
