import { CommentInterface } from "./CommentInterface"

export interface PostInterface {
  userId?: number
  id?: number
  title: string
  body: string
  comments?: CommentInterface[]
}
