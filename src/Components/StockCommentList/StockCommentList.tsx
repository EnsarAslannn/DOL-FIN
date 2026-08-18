import { motion } from "framer-motion"
import type { CommentGet } from "../../Models/Comment"
import type { StockOption } from "../StockComment/stockOptions"
import StockCommentListItem from "../StockCommentListItem/StockCommentListItem"
import { usePrefersReducedMotion } from "../../Helpers/usePrefersReducedMotion"
import { revealGroup } from "../../Helpers/motion"

type Props = {
  comments: CommentGet[]
  /** Resolves a comment's `stockId` into the ticker its row displays. */
  symbolById: Map<number, StockOption>
}

const StockCommentList = ({ comments, symbolById }: Props) => {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (!comments || comments.length === 0) {
    return (
      <div className="rounded-card px-6 py-14 text-center ring-1 ring-inset ring-mist-border/6">
        <p className="text-body font-normal text-ash-text">
          Nothing posted here yet. Be the first to write one.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      /* Re-keyed on the filtered length so switching tickers replays the
         cascade rather than swapping the rows in place. */
      key={comments.length}
      variants={revealGroup}
      {...(prefersReducedMotion
        ? {}
        : { initial: "hidden" as const, animate: "visible" as const })}
      className="flex w-full flex-col gap-3"
    >
      {comments.map((comment, index) => (
        <StockCommentListItem
          key={comment.id || index}
          comment={comment}
          stock={
            comment.stockId !== undefined && comment.stockId !== null
              ? symbolById.get(comment.stockId)
              : undefined
          }
        />
      ))}
    </motion.div>
  )
}

export default StockCommentList
