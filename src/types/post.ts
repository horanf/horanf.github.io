export interface PostFrontmatter {
  title: string
  date: string
  tags: string[]
  description: string
  cover?: string
}

export interface Post extends PostFrontmatter {
  slug: string
  content: string
}

export interface PostMeta extends PostFrontmatter {
  slug: string
}
