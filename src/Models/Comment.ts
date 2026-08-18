export type CommentPost = {
  title: string
  content: string
}

export type CommentGet = {
  id: number
  title: string
  content: string
  createdBy: string
  /**
   * Which stock the comment hangs off. The discussion board is no longer
   * scoped to one company page, so this is what the ticker filter and the
   * row's ticker chip both read.
   */
  stockId?: number | null
  createdOn?: string
}
