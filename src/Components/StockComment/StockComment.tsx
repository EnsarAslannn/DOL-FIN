import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import { commentGetAPI, commentPostAPI } from "../../Services/CommentService"
import { getAllStocksAPI } from "../../Services/StockService"
import StockCommentForm, {
  type CommentFormInputs,
} from "./StockCommentForm/StockCommentForm"
import StockCommentList from "../StockCommentList/StockCommentList"
import DataLoader from "../Dashboard/DataLoader"
import { PanelHeader } from "../Dashboard/Panel"
import { toStockOption, postableStocks, type StockOption } from "./stockOptions"
import type { CommentGet } from "../../Models/Comment"
import type { StockSearchResult } from "../../Models/StockSearchResult"

const ALL = "all" as const

/**
 * The discussion board.
 *
 * Previously this hung off the company profile and was scoped to whichever
 * ticker you happened to be reading, which meant a comment could only be
 * written from inside that one page and could only ever be read there. Here
 * it spans every stock and the ticker becomes a property of the comment
 * rather than of the page around it.
 *
 * The whole feed is fetched once and filtered in the browser. The API can
 * filter by symbol server-side, but a round trip per chip would cost a
 * spinner on every click and — more to the point — could not tell you how
 * many comments each ticker has before you clicked it. One fetch gives both
 * the filter and its counts.
 *
 * Filter chips are built from stocks that actually have comments. A chip for
 * a ticker nobody has posted about only offers the user a guaranteed empty
 * result.
 */
const StockComment = () => {
  const [stocks, setStocks] = useState<StockOption[]>([])
  const [comments, setComments] = useState<CommentGet[]>([])
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [filter, setFilter] = useState<number | typeof ALL>(ALL)

  const getComments = useCallback(async () => {
    const res = await commentGetAPI()
    setComments(res?.data ?? [])
  }, [])

  useEffect(() => {
    let active = true

    const load = async () => {
      setLoading(true)
      try {
        const [stockRes, commentRes] = await Promise.all([
          getAllStocksAPI(),
          commentGetAPI(),
        ])
        if (!active) return

        const options = Array.isArray(stockRes?.data)
          ? (stockRes.data as StockSearchResult[])
              .map(toStockOption)
              .filter((s): s is StockOption => s !== null)
          : []

        setStocks(options)
        setComments(commentRes?.data ?? [])
      } catch (e) {
        console.error("Discussion load failed:", e)
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    /* The board outlives its own fetch when the user navigates away
       mid-request; without this the response lands on an unmounted tree. */
    return () => {
      active = false
    }
  }, [])

  /* Reading stays open to every ticker in the feed — an existing comment on
     a name outside the demo set is still worth showing — but posting is
     limited to the five that have company pages behind them. */
  const postable = useMemo(() => postableStocks(stocks), [stocks])

  const symbolById = useMemo(() => {
    const map = new Map<number, StockOption>()
    for (const s of stocks) map.set(s.id, s)
    return map
  }, [stocks])

  /** Ticker → comment count, for the chips and their badges. */
  const counts = useMemo(() => {
    const map = new Map<number, number>()
    for (const c of comments) {
      if (c.stockId === undefined || c.stockId === null) continue
      map.set(c.stockId, (map.get(c.stockId) ?? 0) + 1)
    }
    return map
  }, [comments])

  const chips = useMemo(
    () =>
      [...counts.entries()]
        .map(([id, count]) => ({ stock: symbolById.get(id), id, count }))
        .filter((c): c is { stock: StockOption; id: number; count: number } =>
          Boolean(c.stock),
        )
        .sort((a, b) => b.count - a.count || a.stock.symbol.localeCompare(b.stock.symbol)),
    [counts, symbolById],
  )

  const visible = useMemo(
    () => (filter === ALL ? comments : comments.filter((c) => c.stockId === filter)),
    [comments, filter],
  )

  const handleComment = async (form: CommentFormInputs) => {
    /* Looked up in `postable`, not `stocks`: the select only offers the five,
       and resolving against the same list is what stops a hand-edited option
       value posting against a ticker the UI never offered. */
    const stock = postable.find((s) => s.id === Number(form.stockId))
    if (!stock) {
      toast.warning("Select the stock you are commenting on.")
      return
    }

    setPosting(true)
    try {
      const res = await commentPostAPI(form.title, form.content, stock.id)
      if (!res) return
      toast.success(`Posted to ${stock.symbol}.`)
      await getComments()
      /* Move the board to what was just written, so the new comment is on
         screen rather than buried under whatever filter was active. */
      setFilter(stock.id)
    } finally {
      setPosting(false)
    }
  }

  const activeSymbol =
    filter === ALL ? null : (symbolById.get(filter)?.symbol ?? null)

  const chipClass = (isActive: boolean) =>
    `cursor-pointer whitespace-nowrap rounded-pill px-4 py-2 font-mono text-caption font-normal uppercase tracking-label transition-colors duration-200 ${
      isActive
        ? "bg-cobalt text-pure-white"
        : "bg-obsidian-button text-ash-text hover:text-ivory-text"
    }`

  return (
    <section className="flex w-full flex-col gap-8">
      <PanelHeader
        eyebrow="Discussion"
        title="What traders are saying"
        lead={
          activeSymbol
            ? `Showing ${visible.length} comment${visible.length === 1 ? "" : "s"} on ${activeSymbol}.`
            : "Notes posted against any ticker on the platform. Filter by company, or add your own below."
        }
      />

      {chips.length > 0 && (
        <div
          role="group"
          aria-label="Filter comments by stock"
          className="-mx-1 flex flex-nowrap gap-2 overflow-x-auto px-1 pb-1"
        >
          <button
            type="button"
            onClick={() => setFilter(ALL)}
            aria-pressed={filter === ALL}
            className={chipClass(filter === ALL)}
          >
            All · {comments.length}
          </button>
          {chips.map(({ stock, id, count }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              aria-pressed={filter === id}
              className={chipClass(filter === id)}
            >
              {stock.symbol} · {count}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5 lg:gap-8">
        <div className="lg:col-span-3">
          {loading ? (
            <DataLoader label="Loading discussion" />
          ) : (
            <StockCommentList comments={visible} symbolById={symbolById} />
          )}
        </div>

        <div className="rounded-card bg-graphite-card p-6 ring-1 ring-inset ring-mist-border/6 lg:col-span-2">
          <h3 className="text-subheading font-medium text-ivory-text">
            Add a comment
          </h3>
          <p className="mt-2 text-body font-normal text-ash-text">
            Pick the company you are writing about, then say your piece.
          </p>
          <StockCommentForm
            stocks={postable}
            /* Pre-selects whatever the board is filtered to, so the two
               controls agree instead of quietly disagreeing. */
            defaultStockId={filter === ALL ? undefined : filter}
            submitting={posting}
            handleComment={handleComment}
          />
        </div>
      </div>
    </section>
  )
}

export default StockComment
