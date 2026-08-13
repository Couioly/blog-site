import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: false,
  highlight(str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(str, {
          language: lang,
          ignoreIllegals: true,
        }).value
        return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`
      } catch {
        // fall through to auto-detection
      }
    }

    // Auto-detect or plain
    if (lang) {
      try {
        const highlighted = hljs.highlightAuto(str).value
        return `<pre><code class="hljs">${highlighted}</code></pre>`
      } catch {
        // fall through to escape
      }
    }

    return `<pre><code>${md.utils.escapeHtml(str)}</code></pre>`
  },
})

/**
 * Render raw markdown string to HTML.
 */
export function renderMarkdown(src: string): string {
  return md.render(src)
}

export default renderMarkdown
