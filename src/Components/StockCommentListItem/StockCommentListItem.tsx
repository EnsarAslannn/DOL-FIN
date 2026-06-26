import type { CommentGet } from "../../Models/Comment"

type Props = {
  comment: CommentGet
}

const StockCommentListItem = ({ comment }: Props) => {
  return (
    <div className="flex flex-col p-4 bg-[#0b0f19]/60 border border-gray-800/40 rounded-xl text-left shadow-sm transition-all duration-200 hover:border-gray-700">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 flex items-center justify-center rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">
            {comment.createdBy ? comment.createdBy[0] : "U"}
          </div>
          <span className="font-bold text-xs text-gray-300">
            @{comment.createdBy || "anonymous"}
          </span>
        </div>
      </div>

      <h4 className="text-sm font-bold text-white mb-1">{comment.title}</h4>

      <p className="text-xs text-gray-400 leading-relaxed font-medium">
        {comment.content}
      </p>
    </div>
  )
}

export default StockCommentListItem
