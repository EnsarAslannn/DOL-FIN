import { toast } from "react-toastify"
import { commentGetAPI, commentPostAPI } from "../../Services/CommentService"
import StockCommentForm from "./StockCommentForm/StockCommentForm"
import { useCallback, useEffect, useState } from "react"
import type { CommentGet } from "../../Models/Comment"
import Spinners from "../Spinners/Spinners"
import StockCommentList from "../StockCommentList/StockCommentList"

type Props = {
  stockSymbol: string
  stockId: number
}

type CommentFormInputs = {
  title: string
  content: string
}

const StockComment = ({ stockSymbol, stockId }: Props) => {
  const [comments, setComments] = useState<CommentGet[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const getComments = useCallback(() => {
    setLoading(true)
    commentGetAPI(stockSymbol)
      .then((res) => {
        setLoading(false)
        if (res && res.data) {
          setComments(res.data)
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }, [stockSymbol])

  useEffect(() => {
    const loadComments = () => {
      getComments()
    }
    loadComments()
  }, [getComments])

  const handleComment = (e: CommentFormInputs) => {
    commentPostAPI(e.title, e.content, stockId)
      .then((res) => {
        if (res) {
          toast.success("Comment created successfully!")
          getComments()
        }
      })
      .catch((e) => {
        toast.warning(e)
      })
  }

  return (
    <div className="glass-panel flex flex-col space-y-6 p-6 rounded-2xl w-full">
      <div className="flex flex-col space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {loading ? (
          <Spinners />
        ) : (
          <StockCommentList comments={comments || []} />
        )}
      </div>

      <div className="border-t border-white/8 pt-2">
        <StockCommentForm handleComment={handleComment} />
      </div>
    </div>
  )
}

export default StockComment
