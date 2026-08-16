import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { fieldClass } from "../../../Helpers/formStyles"

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
          className={fieldClass}
          placeholder="Title"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-loss text-caption font-normal mt-1 pl-2">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="w-full text-left">
        <div className="rounded-card border border-mist-gray bg-paper-white p-3.5 transition-colors focus-within:border-sunrise-coral focus-within:ring-2 focus-within:ring-sunrise-coral/25">
          <label htmlFor="comment" className="sr-only">
            Your comment
          </label>
          <textarea
            id="comment"
            rows={4}
            className="w-full text-xs font-normal bg-transparent text-carbon-black border-0 focus:ring-0 focus:outline-none placeholder:text-ash-gray resize-none"
            placeholder="Write a comment..."
            {...register("content")}
          ></textarea>
        </div>
        {errors.content && (
          <p className="text-loss text-caption font-normal mt-1 pl-2">
            {errors.content.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="cursor-pointer self-start rounded-pill bg-sunrise-coral px-6 py-3 text-body font-bold tracking-[-0.009em] text-paper-white transition-opacity duration-150 hover:opacity-90"
      >
        Post comment
      </button>
    </form>
  )
}

export default StockCommentForm
