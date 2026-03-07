---
title: "Building a Blog with Vue 3 and Markdown"
date: "2026-03-07"
tags: ["vue", "markdown", "tutorial"]
description: "A walkthrough of how this blog was built using Vue 3, Tailwind CSS, and Markdown files."
---

## Why Markdown?

Markdown is the simplest way to write content. No CMS, no database — just plain text files that live in your repository.

### The Stack

This blog is built with a minimal but powerful stack:

- **Vue 3** — Composition API with `<script setup>`
- **Tailwind CSS 4** — Utility-first CSS with the new CSS-based config
- **Shiki** — Syntax highlighting with dual theme support
- **Marked** — Fast markdown parser

### Code Example

Here's how we render markdown with syntax highlighting:

```typescript
import { Marked } from 'marked'
import { createHighlighter } from 'shiki'

const highlighter = await createHighlighter({
  themes: ['github-light', 'github-dark'],
  langs: ['typescript', 'vue'],
})

const marked = new Marked({
  renderer: {
    code({ text, lang }) {
      return highlighter.codeToHtml(text, {
        lang: lang || 'text',
        themes: { light: 'github-light', dark: 'github-dark' },
      })
    },
  },
})
```

### Frontmatter

Each post includes YAML frontmatter for metadata:

```yaml
---
title: "My Post Title"
date: "2026-03-07"
tags: ["vue", "markdown"]
description: "A brief description."
---
```

This keeps everything **simple and maintainable**.
