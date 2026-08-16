interface Props {
  /** Mono uppercase kicker. Names the section's role, not its content. */
  eyebrow: string
  title: string
  /** Optional lead paragraph. Kept short — one line at desktop measure. */
  lead?: string
  className?: string
}

/**
 * The page's one section-opening device.
 *
 * DESIGN.md gives section headings 45–56px at weight 400 with a generous
 * bottom margin. The eyebrow above it is what turns a heading into a section:
 * without it every band opened at the same visual weight and the page read as
 * one long undifferentiated column.
 *
 * The measure is capped at 680px so headings break into two lines at display
 * size rather than running the full 1152px column.
 */
const SectionHeader = ({ eyebrow, title, lead, className = "" }: Props) => (
  <div className={`max-w-[680px] ${className}`}>
    <span className="block font-mono text-caption font-normal uppercase tracking-label-lg text-ash-gray">
      {eyebrow}
    </span>
    <h2 className="mt-5 text-heading md:text-heading-lg lg:text-display-sm font-normal text-carbon-black">
      {title}
    </h2>
    {lead && (
      <p className="mt-6 max-w-[520px] text-body-lg font-normal text-zinc-gray">
        {lead}
      </p>
    )}
  </div>
)

export default SectionHeader
