import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"

type Props = {
  handleComment: (e: CommentFormInputs) => void
}

type CommentFormInputs = {
  title: string
  content: string
}

const validation = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
})

const StockCommentForm = ({ handleComment }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommentFormInputs>({ resolver: yupResolver(validation) })

  return (
    <form
      className="mt-4 flex flex-col space-y-3"
      onSubmit={handleSubmit(handleComment)}
    >
      <div className="w-full text-left">
        <input
          type="text"
          id="title"
          className="bg-[#0b0f19] border border-gray-800/80 text-white text-xs font-bold rounded-xl block w-full p-3 focus:outline-none focus:border-emerald-500 placeholder-gray-500"
          placeholder="Title"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-red-400 text-[11px] font-semibold mt-1 pl-2">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="w-full text-left">
        <div className="p-3 bg-[#0b0f19] rounded-xl border border-gray-800/80 focus-within:border-emerald-500 transition-colors">
          <label htmlFor="comment" className="sr-only">
            Your comment
          </label>
          <textarea
            id="comment"
            rows={4}
            className="w-full text-xs font-medium bg-transparent text-white border-0 focus:ring-0 focus:outline-none placeholder-gray-500 resize-none"
            placeholder="Write a comment..."
            {...register("content")}
          ></textarea>
        </div>
        {errors.content && (
          <p className="text-red-400 text-[11px] font-semibold mt-1 pl-2">
            {errors.content.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="py-2.5 px-6 text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-md shadow-emerald-500/10 self-start transition-all duration-150"
      >
        Post comment
      </button>
    </form>
  )
}

export default StockCommentForm
