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
          className="bg-abyss border border-ridge/60 text-foam text-xs font-bold rounded-xl block w-full p-3 focus:outline-none focus:border-pulse placeholder-mist/60"
          placeholder="Title"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-loss text-[11px] font-semibold mt-1 pl-2">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="w-full text-left">
        <div className="p-3 bg-abyss rounded-xl border border-ridge/60 focus-within:border-pulse transition-colors">
          <label htmlFor="comment" className="sr-only">
            Your comment
          </label>
          <textarea
            id="comment"
            rows={4}
            className="w-full text-xs font-medium bg-transparent text-foam border-0 focus:ring-0 focus:outline-none placeholder-mist/60 resize-none"
            placeholder="Write a comment..."
            {...register("content")}
          ></textarea>
        </div>
        {errors.content && (
          <p className="text-loss text-[11px] font-semibold mt-1 pl-2">
            {errors.content.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="py-2.5 px-6 text-xs font-bold text-abyss bg-pulse hover:bg-pulse-dim rounded-xl shadow-md shadow-pulse/10 self-start transition-all duration-150"
      >
        Post comment
      </button>
    </form>
  )
}

export default StockCommentForm
