import { readFileSync, writeFileSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { join, basename } from 'node:path'

const BLOG_DIR = join(import.meta.dirname, '..', 'content', 'blog')
const OUTPUT = join(import.meta.dirname, '..', 'public', 'search-index.json')

function stripMarkdown(md) {
  // Normalize line endings
  let text = md.replace(/\r\n/g, '\n')
  // Remove frontmatter
  text = text.replace(/^---[\s\S]*?---\n/, '')
  // Remove fenced code blocks
  text = text.replace(/```[\s\S]*?```/g, ' ')
  // Remove inline code
  text = text.replace(/`{1,2}[^`\n]+`{1,2}/g, ' ')
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ')
  // Remove images
  text = text.replace(/!\[.*?\]\(.*?\)/g, ' ')
  // Remove links (keep text)
  text = text.replace(/\[([^\]]*)\]\([^)]+\)/g, '$1')
  // Remove bold/italic
  text = text.replace(/(\*{1,3}|_{1,3})(.*?)\1/g, '$2')
  // Remove headings
  text = text.replace(/^#{1,6}\s+/gm, ' ')
  // Remove blockquote markers
  text = text.replace(/^>\s+/gm, ' ')
  // Remove list markers
  text = text.replace(/^[\s]*[-*+]\s+/gm, ' ')
  text = text.replace(/^[\s]*\d+\.\s+/gm, ' ')
  // Remove horizontal rules
  text = text.replace(/^[-*_]{3,}\s*$/gm, ' ')
  // Remove table formatting
  text = text.replace(/\|/g, ' ')
  text = text.replace(/^[\s]*[-:]+[-:\s|]*$/gm, ' ')
  // Collapse all whitespace
  text = text.replace(/\s+/g, ' ').trim()
  return text
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}
  const fm = {}
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.+)$/)
    if (!kv) continue
    let val = kv[2].trim()
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''))
    }
    fm[kv[1]] = val
  }
  return fm
}

async function main() {
  const files = (await readdir(BLOG_DIR)).filter(f => f.endsWith('.md'))
  const index = []

  for (const file of files) {
    const raw = readFileSync(join(BLOG_DIR, file), 'utf-8').replace(/\r\n/g, '\n')
    const fm = parseFrontmatter(raw)
    const body = stripMarkdown(raw)

    if (!fm.title || !fm.date) continue

    const slug = basename(file, '.md').toLowerCase()

    index.push({
      title: fm.title,
      slug,
      date: fm.date,
      description: fm.description || '',
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      body,
    })
  }

  writeFileSync(OUTPUT, JSON.stringify(index, null, 2), 'utf-8')
  console.log(`[search-index] Generated index with ${index.length} posts (${(JSON.stringify(index).length / 1024).toFixed(0)} KB)`)
}

main().catch((e) => {
  console.error('[search-index] Failed:', e)
  process.exit(1)
})
