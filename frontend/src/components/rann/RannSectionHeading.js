export default function RannSectionHeading({ eyebrow, title, subtitle, lede, id, align = 'center' }) {
  const alignClass =
    align === 'left'
      ? 'rann-section-heading--left text-left mx-0'
      : 'mx-auto text-center rann-section-heading--center';
  const description = lede || subtitle;
  return (
    <header id={id} className={`rann-section-heading rann-section-heading--premium mb-8 max-w-3xl md:mb-10 ${alignClass}`}>
      {eyebrow ? (
        <p className="rann-section-heading__eyebrow">
          <span className="rann-section-heading__rule" aria-hidden />
          <span>{eyebrow}</span>
          {align !== 'left' ? <span className="rann-section-heading__rule rann-section-heading__rule--mirror" aria-hidden /> : null}
        </p>
      ) : null}
      <h2 className="rann-section-heading__title">{title}</h2>
      {description ? <p className="rann-section-heading__lede">{description}</p> : null}
    </header>
  );
}
