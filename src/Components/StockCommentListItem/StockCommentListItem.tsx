import type { CommentGet } from "../../Models/Comment"

type Props = {
  comment: CommentGet
}

const StockCommentListItem = ({ comment }: Props) => {
  return (
    <div className="flex flex-col p-4 bg-black/35 border border-white/6 rounded-xl text-left transition-all duration-200 hover:border-white/12 hover:bg-black/50">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 flex items-center justify-center rounded-md bg-pulse/10 border border-pulse/20 text-pulse text-[10px] font-bold uppercase">
            {comment.createdBy ? comment.createdBy[0] : "U"}
          </div>
          <span className="font-bold text-xs text-foam/85">
            @{comment.createdBy || "anonymous"}
          </span>
        </div>
      </div>

      <h4 className="text-sm font-bold text-foam mb-1">{comment.title}</h4>

      <p className="text-xs text-mist leading-relaxed font-medium">
        {comment.content}
      </p>
    </div>
  )
}

export default StockCommentListItem
