export interface PostMeta {
  title: string
  date: string
  slug: string
  description?: string
  tags?: string[]
  year: number
}

export interface PostGroup {
  year: number
  posts: PostMeta[]
}
