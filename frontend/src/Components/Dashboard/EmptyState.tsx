import type { ReactNode } from "react"
import { motion } from "framer-motion"
import emptySearch from "../../assets/extra/empty-search.webp"
import { usePrefersReducedMotion } from "../../Helpers/usePrefersReducedMotion"
import { reveal, revealGroup, revealImage, revealProps } from "../../Helpers/motion"

const art: Record<"wallet" | "search", string | null> = {
  wallet: null,
  search: emptySearch,
}

interface Props {
  variant: keyof typeof art
  title: string
  description: string
  children?: ReactNode
}

const EmptyState = ({ variant, title, description, children }: Props) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const src = art[variant]

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
        className={`text-subheading font-medium text-band-muted ${src ? "mt-10" : ""}`}
      >
        {title}
      </motion.h3>
      <motion.p
        variants={reveal}
        className="mt-3 text-body font-normal leading-relaxed text-band-subtle"
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
