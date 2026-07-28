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
          className="bg-black/50 border border-white/10 text-foam text-xs font-bold rounded-xl block w-full p-3.5 focus:outline-none focus:border-pulse/70 focus:shadow-[0_0_0_4px_rgba(255,87,26,0.12)] placeholder-mist/50 transition-all"
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
        <div className="p-3.5 bg-black/50 rounded-xl border border-white/10 focus-within:border-pulse/70 focus-within:shadow-[0_0_0_4px_rgba(255,87,26,0.12)] transition-all">
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
        className="glow-action py-3 px-6 text-[11px] font-bold uppercase tracking-[0.12em] text-white bg-gradient-to-r from-pulse to-[#ff8a3d] rounded-xl self-start transition-all duration-150 active:scale-95 cursor-pointer"
      >
        Post comment
      </button>
    </form>
  )
}

export default StockCommentForm
