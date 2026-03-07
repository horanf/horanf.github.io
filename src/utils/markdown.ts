import { Marked } from 'marked'
import { createHighlighter, type Highlighter } from 'shiki'

let highlighter: Highlighter | null = null

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: [
        'javascript',
        'typescript',
        'vue',
        'html',
        'css',
        'json',
        'bash',
        'markdown',
        'python',
        'java',
        'go',
        'rust',
        'sql',
        'yaml',
      ],
    })
  }
  return highlighter
}

export async function renderMarkdown(content: string): Promise<string> {
  const hl = await getHighlighter()

  const marked = new Marked({
    renderer: {
      code({ text, lang }) {
        const language = lang || 'text'
        try {
          return hl.codeToHtml(text, {
            lang: language,
            themes: {
              light: 'github-light',
              dark: 'github-dark',
            },
          })
        } catch {
          return `<pre><code class="language-${language}">${text}</code></pre>`
        }
      },
    },
  })

  return marked.parse(content) as Promise<string>
}
