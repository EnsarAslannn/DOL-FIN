import { motion } from "framer-motion"
import { reveal } from "../../Helpers/motion"

interface Props {
  eyebrow: string
  title: string
  lead?: string
  align?: "left" | "center"
  tone?: "dark" | "light"
  className?: string
}

const SectionHeader = ({
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "dark",
  className = "",
}: Props) => {
  const centered = align === "center"
  const isLight = tone === "light"

  return (
    <div
      className={`max-w-[680px] ${centered ? "mx-auto text-center" : ""} ${className}`}
    >
      <motion.span
        variants={reveal}
        className={`block font-mono text-caption font-normal uppercase tracking-label-lg ${
          isLight ? "text-ink-muted" : "text-ash-text/70"
        }`}
      >
        {eyebrow}
      </motion.span>
      <motion.h2
        variants={reveal}
        className={`mt-5 text-heading md:text-heading-lg lg:text-display-sm font-medium ${
          isLight ? "text-onyx-canvas" : "text-ivory-text"
        }`}
      >
        {title}
      </motion.h2>
      {lead && (
        <motion.p
          variants={reveal}
          className={`mt-6 max-w-[520px] text-body-lg font-normal ${
            centered ? "mx-auto" : ""
          } ${isLight ? "text-ink-muted" : "text-ash-text"}`}
        >
          {lead}
        </motion.p>
      )}
    </div>
  )
}

export default SectionHeader
