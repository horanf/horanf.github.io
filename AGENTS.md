# Agent Instructions

This is a **Vue 3 + TypeScript** personal blog built with Vite, using Composition API with `<script setup>` syntax.

## Build Commands

```bash
# Development server
npm run dev

# Build for production (includes type-checking)
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Lint and fix issues
npm run lint:fix
```

**Note**: There are no tests configured in this project. The `build` script runs `vue-tsc -b` for type-checking before Vite build.

## Project Architecture

```
src/
├── components/     # Reusable Vue components (PascalCase)
├── views/          # Page-level components (PascalCase, *Page.vue)
├── layouts/        # Layout components (PascalCase, *Layout.vue)
├── router/         # Vue Router configuration
├── stores/         # Pinia stores (use*Store.ts)
├── types/          # TypeScript interfaces/types
├── utils/          # Utility functions
├── content/posts/  # Markdown blog posts
├── style.css       # Global styles with Tailwind v4
└── main.ts         # Application entry point
```

## Code Style Guidelines

### Vue Components
- Use **`<script setup lang="ts">`** exclusively
- PascalCase for component names (`NavBar.vue`, `PostCard.vue`)
- Template uses 2-space indentation
- Multi-attribute elements: each attribute on new line after first

```vue
<script setup lang="ts">
import { computed } from 'vue'
import PostCard from '@/components/PostCard.vue'

const posts = computed(() => getPosts())
</script>

<template>
  <PostCard
    v-for="post in posts"
    :key="post.slug"
    :post="post"
  />
</template>
```

### TypeScript
- **Strict mode enabled** - all strict flags on
- Use `type` imports: `import type { Post } from '@/types/post'`
- Interfaces use PascalCase: `PostFrontmatter`, `PostMeta`
- Function parameters and returns should be typed
- Prefer `const` and arrow functions for utilities

### Imports
- Group imports: 1) external libs, 2) @/ aliases, 3) relative
- Use `@/` alias for all internal imports (configured in vite.config.ts)
- Vue core: `import { ref, computed } from 'vue'`
- VueUse: `import { usePreferredDark } from '@vueuse/core'`

### Naming Conventions
- Components: PascalCase (`NavBar.vue`)
- Composables: camelCase starting with `use` (`useThemeStore`)
- Utilities: camelCase (`getPosts`, `renderMarkdown`)
- Types/Interfaces: PascalCase (`PostFrontmatter`)
- Constants: UPPER_SNAKE_CASE for regex patterns

### Error Handling
- Use `try/catch` for async operations (e.g., Shiki highlighter)
- Provide fallback behavior in catch blocks
- Optional chaining for potentially undefined values

### Styling (Tailwind CSS v4)
- Tailwind v4 uses `@import "tailwindcss"` in CSS
- Use arbitrary values sparingly: `bg-white/80`
- Dark mode: use `dark:` prefix with `dark` class on html
- Colors: prefer `neutral` palette for UI, semantic colors for accents
- Spacing: use standard scale (4 = 1rem)

### Pinia Stores
- Use Composition API style stores
- Define with `defineStore('name', () => { ... })`
- Return reactive refs and functions explicitly
- Use `storeToRefs()` when destructuring in components

### Vue Router
- Routes use lazy loading: `component: () => import('@/views/HomePage.vue')`
- Named routes in camelCase
- Props enabled for dynamic route segments

## Key Dependencies

- **Vue 3.5+** with Composition API
- **Vue Router 4** - hash history mode
- **Pinia 3** - state management
- **Tailwind CSS 4** - utility-first styling
- **@vueuse/core** - composables (dark mode detection)
- **marked** - markdown parsing
- **shiki** - syntax highlighting

## Markdown Content

Blog posts are in `src/content/posts/*.md` with YAML frontmatter:

```yaml
---
title: Post Title
date: 2024-01-15
tags: [vue, typescript]
description: Brief description
cover: optional-image.jpg
---
```

## ESLint Configuration

Uses `@antfu/eslint-config` with Vue support. Key rules:
- Vue-specific linting enabled
- Automatic import sorting
- Consistent formatting enforced

Run `npm run lint:fix` before committing.
