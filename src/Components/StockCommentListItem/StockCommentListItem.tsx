import { motion } from "framer-motion"
import type { CommentGet } from "../../Models/Comment"
import type { StockOption } from "../StockComment/stockOptions"
import { reveal } from "../../Helpers/motion"

type Props = {
  comment: CommentGet
  /** Resolved from `comment.stockId`; absent for an orphaned comment. */
  stock?: StockOption
}

/**
 * One comment.
 *
 * Two facts before the body: who wrote it and which company it is about, on
 * one line, then the title as the row's heading. On a board that mixes every
 * stock together the ticker has to be readable without opening the text, so
 * it sits in the byline rather than under the title.
 *
 * Sits on the canvas with a hairline rather than on its own fill: a list of
 * fifteen filled cards on Graphite reads as fifteen boxes, which is the
 * nesting the dashboard rebuild set out to remove.
 */
const StockCommentListItem = ({ comment, stock }: Props) => {
  const author = comment.createdBy || "anonymous"

  return (
    <motion.article
      variants={reveal}
      className="flex flex-col gap-3 rounded-card p-5 text-left ring-1 ring-inset ring-mist-border/6 transition-colors duration-200 hover:bg-graphite-card"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-icon bg-obsidian-button font-mono text-caption font-bold uppercase text-ivory-text">
          {author[0]}
        </span>
        <span className="text-body font-medium text-ivory-text">@{author}</span>
        {stock && (
          <span className="rounded-pill bg-cobalt/15 px-3 py-1 font-mono text-caption font-normal uppercase tracking-label text-ivory-text">
            {stock.symbol}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {comment.title && (
          <h4 className="text-body font-medium text-ivory-text">
            {comment.title}
          </h4>
        )}
        <p className="text-body font-normal leading-relaxed text-ash-text">
          {comment.content}
        </p>
      </div>
    </motion.article>
  )
}

export default StockCommentListItem
