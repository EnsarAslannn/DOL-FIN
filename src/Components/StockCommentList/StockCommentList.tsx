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
        <div className="text-center py-8 bg-[#0b0f19]/40 border border-dashed border-gray-800 rounded-xl">
          <p className="text-sm text-gray-500">No comments yet.</p>
        </div>
      )}
    </div>
  )
}

export default StockCommentList
