import type { ReactNode } from "react"
import { motion } from "framer-motion"
import emptySearch from "../../assets/extra/empty-search.webp"
import { usePrefersReducedMotion } from "../../Helpers/usePrefersReducedMotion"
import { reveal, revealGroup, revealImage, revealProps } from "../../Helpers/motion"

/**
 * Per-variant art. `null` means the state carries no illustration and is
 * carried by its copy alone — which is the wallet's case now that its render
 * has been dropped.
 */
const art: Record<"wallet" | "search", string | null> = {
  wallet: null,
  search: emptySearch,
}

interface Props {
  variant: keyof typeof art
  title: string
  description: string
  /** Optional action. A single primary route out of the empty state. */
  children?: ReactNode
}

/**
 * The dashboard's empty state.
 *
 * The illustration is deliberately small — 192px, well under the copy's own
 * measure — and sits in a fixed square so the halo behind it can be sized off
 * the frame rather than off the artwork. At the 256px it used to run, the
 * render dominated the section and read as the subject of the page instead of
 * as the mark above a sentence.
 *
 * Three things make it sit *in* the canvas rather than on top of it:
 *
 *   1. The backdrop is keyed out of the asset itself. The original render
 *      carried an opaque #3a3a42 studio plate, and no amount of CSS can
 *      integrate a rectangle that is genuinely there.
 *   2. A Cobalt radial, blurred and offset low, grounds the object the way a
 *      floor bounce would. It is a gradient rather than a flat disc so it has
 *      no edge of its own to give away.
 *   3. A radial mask trims what the key could not: the render's contact
 *      shadow is a shade lighter than Onyx, so its far edge would otherwise
 *      show as a faint rectangular smudge to the lower right.
 *
 * Deliberately NOT a blend mode. `screen` and `lighten` were both measured
 * against this asset and both make it worse — every blend in that family
 * resolves to at least the lighter of the two inputs, so the one artefact
 * that needed removing (a shadow already lighter than the canvas) gets
 * lifted into a pale violet blob and the plinth washes out with it. They are
 * the right tool for a render on pure black, which this no longer is.
 * `opacity-90` does the softening the blend was wanted for.
 */
const EmptyState = ({ variant, title, description, children }: Props) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const src = art[variant]

  /* Held just outside the object's silhouette. Pulled in tighter and the
     magnifier's rim starts to dissolve; pushed out further and the contact
     shadow comes back. */
  const mask =
    "radial-gradient(circle at 50% 48%, #000 54%, transparent 80%)"

  return (
    <motion.div
      variants={revealGroup}
      {...revealProps(prefersReducedMotion)}
      className="mx-auto flex w-full max-w-lg flex-col items-center justify-center px-6 py-20 text-center md:py-24"
    >
      {src && (
        <motion.div
          variants={prefersReducedMotion ? reveal : revealImage}
          className="relative flex h-48 w-48 items-center justify-center"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[56%] h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
            style={{
              background:
                "radial-gradient(circle, rgba(82,102,235,0.16), rgba(82,102,235,0) 70%)",
            }}
          />
          <img
            src={src}
            alt=""
            aria-hidden="true"
            width={384}
            height={384}
            loading="lazy"
            decoding="async"
            className="relative h-full w-full object-contain opacity-90"
            style={{ maskImage: mask, WebkitMaskImage: mask }}
          />
        </motion.div>
      )}

      <motion.h3
        variants={reveal}
        className={`text-subheading font-medium text-ash-text ${src ? "mt-10" : ""}`}
      >
        {title}
      </motion.h3>
      <motion.p
        variants={reveal}
        className="mt-3 text-body font-normal leading-relaxed text-ash-text/75"
      >
        {description}
      </motion.p>

      {children && (
        <motion.div variants={reveal} className="mt-9">
          {children}
        </motion.div>
      )}
    </motion.div>
  )
}

export default EmptyState
