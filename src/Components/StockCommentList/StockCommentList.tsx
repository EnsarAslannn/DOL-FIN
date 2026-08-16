import type { CommentGet } from "../../Models/Comment"
import StockCommentListItem from "../StockCommentListItem/StockCommentListItem"

type Props = {
  comments: CommentGet[]
}

const StockCommentList = ({ comments }: Props) => {
  return (
    <div className="flex flex-col space-y-4 w-full">
      {comments && comments.length > 0 ? (
        comments.map((comment, index) => {
          return (
            <StockCommentListItem key={comment.id || index} comment={comment} />
          )
        })
      ) : (
        <div className="text-center py-8 bg-fog-gray border border-dashed border-mist-gray rounded-card">
          <p className="text-body text-zinc-gray">No comments yet.</p>
        </div>
      )}
    </div>
  )
}

export default StockCommentList
