import mysql from 'mysql2/promise'
import type { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise'

let pool: Pool | null = null

function getPool(): Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'blog',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'blog',
      charset: 'utf8mb4',
      waitForConnections: true,
      connectionLimit: 5,
      enableKeepAlive: true,
    })
  }
  return pool
}

export async function query<T extends RowDataPacket[]>(
  sql: string,
  params?: unknown[]
): Promise<T> {
  const p = getPool()
  const [rows] = await p.query<T>(sql, params)
  return rows
}

export async function execute(
  sql: string,
  params?: unknown[]
): Promise<ResultSetHeader> {
  const p = getPool()
  const [result] = await p.execute<ResultSetHeader>(sql, params)
  return result
}

export async function ensureTables(): Promise<void> {
  const p = getPool()

  await p.execute(`CREATE TABLE IF NOT EXISTS blog (
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

  await p.execute(`CREATE TABLE IF NOT EXISTS fragments (
    slug        VARCHAR(255) PRIMARY KEY,
    title       VARCHAR(500) NOT NULL,
    date        DATE NOT NULL,
    content     LONGTEXT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)

  await p.execute(`CREATE TABLE IF NOT EXISTS bangumi (
    id          INT PRIMARY KEY,
    name        VARCHAR(500) NOT NULL,
    name_cn     VARCHAR(500) NOT NULL,
    name_jp     VARCHAR(500) DEFAULT '',
    summary     TEXT,
    image_large VARCHAR(500) DEFAULT '',
    image_common VARCHAR(500) DEFAULT '',
    cover_data  MEDIUMBLOB,
    rating_score DECIMAL(3,1) DEFAULT 0,
    rating_total INT DEFAULT 0,
    type        TINYINT DEFAULT 2,
    type_name   VARCHAR(20) DEFAULT '动画',
    url         VARCHAR(300) DEFAULT '',
    sort_order   INT DEFAULT 0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)

  // 兼容旧表：如果 bangumi 表已存在但没有 cover_data 列，则添加
  try {
    await p.execute(`ALTER TABLE bangumi ADD COLUMN cover_data MEDIUMBLOB AFTER image_common`)
    console.log('[db] Added cover_data column to bangumi')
  } catch (_) {
    // 列已存在则忽略
  }

  await p.execute(`CREATE TABLE IF NOT EXISTS books (
    id          BIGINT PRIMARY KEY,
    book_name   VARCHAR(500) NOT NULL,
    author      VARCHAR(200) DEFAULT '',
    cover_url   VARCHAR(500) DEFAULT '',
    cover_data  MEDIUMBLOB,
    rating_score DECIMAL(3,1) DEFAULT 0,
    rating_total INT DEFAULT 0,
    summary     TEXT,
    publisher   VARCHAR(200) DEFAULT '',
    pub_year    VARCHAR(20) DEFAULT '',
    pages       VARCHAR(20) DEFAULT '',
    price       VARCHAR(50) DEFAULT '',
    isbn        VARCHAR(30) DEFAULT '',
    binding     VARCHAR(50) DEFAULT '',
    tags        VARCHAR(500) DEFAULT '',
    url         VARCHAR(500) DEFAULT '',
    sort_order  INT DEFAULT 0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)

  // 兼容旧表：如果 books 是旧版番茄小说字段，删掉重建
  try {
    await p.execute(`ALTER TABLE books ADD COLUMN rating_score DECIMAL(3,1) DEFAULT 0 AFTER cover_data`)
    console.log('[db] Added 豆瓣 columns to books (1/6)')
  } catch (_) {}
  try {
    await p.execute(`ALTER TABLE books ADD COLUMN rating_total INT DEFAULT 0 AFTER rating_score`)
  } catch (_) {}
  try {
    await p.execute(`ALTER TABLE books ADD COLUMN publisher VARCHAR(200) DEFAULT \'\' AFTER summary`)
  } catch (_) {}
  try {
    await p.execute(`ALTER TABLE books ADD COLUMN pub_year VARCHAR(20) DEFAULT \'\' AFTER publisher`)
  } catch (_) {}
  try {
    await p.execute(`ALTER TABLE books ADD COLUMN pages VARCHAR(20) DEFAULT \'\' AFTER pub_year`)
  } catch (_) {}
  try {
    await p.execute(`ALTER TABLE books ADD COLUMN price VARCHAR(50) DEFAULT \'\' AFTER pages`)
  } catch (_) {}
  try {
    await p.execute(`ALTER TABLE books ADD COLUMN isbn VARCHAR(30) DEFAULT \'\' AFTER price`)
  } catch (_) {}
  try {
    await p.execute(`ALTER TABLE books ADD COLUMN binding VARCHAR(50) DEFAULT \'\' AFTER isbn`)
  } catch (_) {}
  try {
    await p.execute(`ALTER TABLE books DROP COLUMN author_desc`)
  } catch (_) {}
  try {
    await p.execute(`ALTER TABLE books DROP COLUMN status`)
  } catch (_) {}
  try {
    await p.execute(`ALTER TABLE books DROP COLUMN word_count`)
  } catch (_) {}
  try {
    await p.execute(`ALTER TABLE books DROP COLUMN abstract`)
  } catch (_) {}

  console.log('[db] Tables ensured (blog, fragments, bangumi, books)')
}

// Ensure tables on first import (non-blocking)
ensureTables().catch((e) => {
  console.warn('[db] Table creation skipped (DB may not be ready):', e.message)
})

export default getPool
