/**
 * Post-process rendered HTML: wrap bare <pre><code> blocks with the
 * .code-block-wrapper structure that matches ProsePre.vue styling.
 *
 * markdown-it + highlight.js produces:
 *   <pre><code class="hljs language-python">...</code></pre>
 *
 * We transform it into:
 *   <div class="code-block-wrapper">
 *     <div class="code-block-header">
 *       <span class="code-dots">...</span>
 *       <span class="code-lang">python</span>
 *       <button class="copy-btn" onclick="...">复制</button>
 *     </div>
 *     <pre><code class="hljs language-python">...</code></pre>
 *   </div>
 */

function extractLang(codeEl: string): string {
  const m = codeEl.match(/class="[^"]*language-(\S+)[^"]*"/)
  return m ? m[1] : ''
}

export function wrapCodeBlocks(html: string): string {
  return html.replace(
    /<pre><code(?:\s[^>]*)?>[\s\S]*?<\/code><\/pre>/g,
    (match) => {
      const codeOpenMatch = match.match(/<code([^>]*)>/)
      const codeAttrs = codeOpenMatch ? codeOpenMatch[1] : ''
      const lang = extractLang(match)

      const codeContent = match
        .replace(/^<pre><code[^>]*>/, '')
        .replace(/<\/code><\/pre>$/, '')

      return [
        '<div class="code-block-wrapper">',
        '<div class="code-block-header">',
        '<span class="code-dots">',
        '<i class="dot dot-red"></i>',
        '<i class="dot dot-yellow"></i>',
        '<i class="dot dot-green"></i>',
        '</span>',
        `<span class="code-lang">${lang || 'code'}</span>`,
        `<button class="copy-btn" onclick="(function(b){var c=b.parentElement.nextElementSibling.querySelector('code').textContent;navigator.clipboard.writeText(c).then(function(){b.textContent='已复制!';b.classList.add('copied');setTimeout(function(){b.textContent='复制';b.classList.remove('copied')},2000)}).catch(function(){b.textContent='复制失败';setTimeout(function(){b.textContent='复制'},1500)})})(this)">复制</button>`,
        '</div>',
        `<pre><code${codeAttrs}>${codeContent}</code></pre>`,
        '</div>',
      ].join('')
    }
  )
}
