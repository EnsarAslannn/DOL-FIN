import type { CommentGet } from "../../Models/Comment"

type Props = {
  comment: CommentGet
}

const StockCommentListItem = ({ comment }: Props) => {
  return (
    <div className="flex flex-col p-4 bg-obsidian-button border border-slate-border/45 rounded-card text-left transition-all duration-200 hover:border-slate-border/45 hover:bg-obsidian-button">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 flex items-center justify-center rounded-md bg-obsidian-button border border-slate-border/45 text-ivory-text text-caption font-bold uppercase">
            {comment.createdBy ? comment.createdBy[0] : "U"}
          </div>
          <span className="font-bold text-body text-ivory-text">
            @{comment.createdBy || "anonymous"}
          </span>
        </div>
      </div>

      <h4 className="text-body font-bold text-ivory-text mb-1">{comment.title}</h4>

      <p className="text-body text-ash-text leading-relaxed font-normal">
        {comment.content}
      </p>
    </div>
  )
}

export default StockCommentListItem
