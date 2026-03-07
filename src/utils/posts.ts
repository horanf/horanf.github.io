import type { Post, PostMeta, PostFrontmatter } from '@/types/post'

const postModules = import.meta.glob('@/content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function parseSlug(path: string): string {
  const filename = path.split('/').pop() || ''
  return filename.replace(/\.md$/, '')
}

function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }

  const yamlBlock = match[1] ?? ''
  const content = match[2] ?? ''
  const data: Record<string, unknown> = {}

  for (const line of yamlBlock.split('\n')) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue
    const key = line.slice(0, colonIndex).trim()
    let value: unknown = line.slice(colonIndex + 1).trim()

    // Parse arrays: ["a", "b"]
    if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
    }
    // Strip quotes from strings
    else if (typeof value === 'string' && /^["'].*["']$/.test(value)) {
      value = value.slice(1, -1)
    }

    data[key] = value
  }

  return { data, content }
}

function parsePost(path: string, raw: string): Post {
  const { data, content } = parseFrontmatter(raw)
  const frontmatter = data as unknown as PostFrontmatter
  return {
    ...frontmatter,
    slug: parseSlug(path),
    content,
  }
}

function getAllPosts(): Post[] {
  return Object.entries(postModules)
    .map(([path, raw]) => parsePost(path, raw))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

const cachedPosts = getAllPosts()

export function getPosts(): PostMeta[] {
  return cachedPosts.map(({ content: _, ...meta }) => meta)
}

export function getPostBySlug(slug: string): Post | undefined {
  return cachedPosts.find((post) => post.slug === slug)
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>()
  for (const post of cachedPosts) {
    for (const tag of post.tags) {
      tagSet.add(tag)
    }
  }
  return Array.from(tagSet).sort()
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getPosts().filter((post) => post.tags.includes(tag))
}
