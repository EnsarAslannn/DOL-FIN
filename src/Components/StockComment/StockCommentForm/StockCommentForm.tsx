import { useEffect } from "react"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm, useWatch } from "react-hook-form"
import {
  fieldClass,
  labelClass,
  errorClass,
  ctaBaseClass,
  ctaFillClass,
  ctaDisabledClass,
} from "../../../Helpers/formStyles"
import type { StockOption } from "../stockOptions"

export type CommentFormInputs = {
  stockId: string
  title: string
  content: string
}

type Props = {
  stocks: StockOption[]
  defaultStockId?: number
  submitting?: boolean
  handleComment: (e: CommentFormInputs) => void
}

/**
 * The comment form.
 *
 * Three fields in reading order: which company, what you are calling it, then
 * what you have to say. The ticker leads because it is the one thing a reader
 * scanning the board needs before anything else, and it is required rather
 * than inferred from the surrounding page — the board spans every stock now,
 * so there is no page to infer it from.
 *
 * A native `<select>`, not a custom listbox: five options is well inside what
 * a native control handles gracefully, and it brings keyboard support,
 * type-ahead and the platform picker on mobile at no cost.
 *
 * Both text limits mirror `CreateCommentDtoValidator` exactly — 5 to 280
 * characters — so a value the API would reject is caught inline instead of
 * coming back as a 400 with no field attached to it.
 */
const validation = Yup.object().shape({
  stockId: Yup.string().required("Choose the stock you are commenting on"),
  title: Yup.string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(280, "Title must be 280 characters or fewer"),
  content: Yup.string()
    .required("Content is required")
    .min(5, "Comment must be at least 5 characters")
    .max(280, "Comment must be 280 characters or fewer"),
})

const StockCommentForm = ({
  stocks,
  defaultStockId,
  submitting = false,
  handleComment,
}: Props) => {
  const {
    register,
    handleSubmit,
    resetField,
    setValue,
    control,
    formState: { errors, isSubmitSuccessful },
  } = useForm<CommentFormInputs>({
    resolver: yupResolver(validation),
    defaultValues: {
      stockId: defaultStockId ? String(defaultStockId) : "",
      title: "",
      content: "",
    },
  })

  /* Keeps the picker in step with the board's filter without clobbering a
     choice the user has already made on this form. */
  useEffect(() => {
    if (defaultStockId) setValue("stockId", String(defaultStockId))
  }, [defaultStockId, setValue])

  /* Clears the written fields but leaves the ticker selected — posting two
     notes on the same name in a row is the common case, and a full `reset()`
     would make the user re-pick it every time.

     `useWatch` rather than the `watch()` returned by `useForm`: watch() hands
     back a fresh function each render, which makes the whole component opt
     out of React Compiler memoization. */
  useEffect(() => {
    if (isSubmitSuccessful) {
      resetField("title")
      resetField("content")
    }
  }, [isSubmitSuccessful, resetField])

  const content = useWatch({ control, name: "content" })
  const remaining = 280 - (content?.length ?? 0)

  const noStocks = stocks.length === 0

  return (
    <form
      className="mt-6 flex flex-col gap-5"
      onSubmit={handleSubmit(handleComment)}
    >
      <div className="w-full text-left">
        <label htmlFor="comment-stock" className={labelClass}>
          Stock / ticker
        </label>
        <select
          id="comment-stock"
          className={`${fieldClass} cursor-pointer`}
          aria-invalid={errors.stockId ? "true" : undefined}
          {...register("stockId")}
        >
          <option value="">Select a company…</option>
          {stocks.map((stock) => (
            <option key={stock.id} value={stock.id}>
              {stock.symbol}
              {stock.companyName ? ` — ${stock.companyName}` : ""}
            </option>
          ))}
        </select>
        {errors.stockId && <p className={errorClass}>{errors.stockId.message}</p>}
      </div>

      <div className="w-full text-left">
        <label htmlFor="comment-title" className={labelClass}>
          Title
        </label>
        <input
          type="text"
          id="comment-title"
          maxLength={280}
          className={fieldClass}
          placeholder="Sum it up in a line"
          aria-invalid={errors.title ? "true" : undefined}
          {...register("title")}
        />
        {errors.title && <p className={errorClass}>{errors.title.message}</p>}
      </div>

      <div className="w-full text-left">
        <label htmlFor="comment-content" className={labelClass}>
          Your comment
        </label>
        <textarea
          id="comment-content"
          rows={5}
          maxLength={280}
          className={`${fieldClass} resize-none`}
          placeholder="What are you seeing in this name?"
          aria-invalid={errors.content ? "true" : undefined}
          {...register("content")}
        />
        <div className="mt-2 flex items-start justify-between gap-4">
          {errors.content ? (
            <p className={`${errorClass} mt-0`}>{errors.content.message}</p>
          ) : (
            <span />
          )}
          <span
            aria-hidden="true"
            className="shrink-0 font-mono text-caption font-normal text-band-subtle"
          >
            {remaining}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting || noStocks}
        className={`self-start px-6 py-3 text-body ${ctaBaseClass} ${
          submitting || noStocks ? ctaDisabledClass : ctaFillClass
        }`}
      >
        {submitting ? "Posting…" : "Post comment"}
      </button>
    </form>
  )
}

export default StockCommentForm
