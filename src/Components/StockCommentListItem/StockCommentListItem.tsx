import type { CommentGet } from "../../Models/Comment"

type Props = {
  comment: CommentGet
}

const StockCommentListItem = ({ comment }: Props) => {
  return (
    <div className="flex flex-col p-4 bg-fog-gray border border-mist-gray rounded-card text-left transition-all duration-200 hover:border-mist-gray hover:bg-fog-gray">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 flex items-center justify-center rounded-md bg-fog-gray border border-mist-gray text-carbon-black text-caption font-bold uppercase">
            {comment.createdBy ? comment.createdBy[0] : "U"}
          </div>
          <span className="font-bold text-body text-carbon-black">
            @{comment.createdBy || "anonymous"}
          </span>
        </div>
      </div>

      <h4 className="text-body font-bold text-carbon-black mb-1">{comment.title}</h4>

      <p className="text-body text-zinc-gray leading-relaxed font-normal">
        {comment.content}
      </p>
    </div>
  )
}

export default StockCommentListItem
