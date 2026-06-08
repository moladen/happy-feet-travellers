export default function RannSectionHeading({ eyebrow, title, subtitle, lede, id, align = 'center' }) {
  const alignClass = align === 'left' ? 'text-left mx-0' : 'mx-auto text-center';
  const description = lede || subtitle;
  return (
    <header id={id} className={`rann-section-heading mb-8 max-w-3xl md:mb-10 ${alignClass}`}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 font-display text-3xl font-bold text-primary md:text-4xl">{title}</h2>
      {description ? <p className="mt-3 text-sm leading-relaxed text-foreground/75 md:text-base">{description}</p> : null}
    </header>
  );
}
