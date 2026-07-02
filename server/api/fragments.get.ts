import { readdir } from 'node:fs/promises'
import { resolve } from 'node:path'

export default defineEventHandler(async () => {
  const dir = resolve(process.cwd(), 'public/fragments')
  let files: string[] = []
  try {
    files = await readdir(dir)
  } catch {
    return []
  }

  const htmlFiles = files
    .filter((f) => f.endsWith('.html'))
    .map((f) => {
      const name = f.replace(/\.html$/, '')
      // Filename format: YYYY-MM-DD-title
      const dateMatch = name.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/)
      const date = dateMatch ? dateMatch[1] : ''
      const title = dateMatch ? dateMatch[2].replace(/-/g, ' ') : name
      return { title, date, filename: f, slug: name }
    })
    .sort((a, b) => b.date.localeCompare(a.date))

  return htmlFiles
})
