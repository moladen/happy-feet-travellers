/**
 * Above-the-fold pricing ribbon for campaign landing heroes.
 * @param {{ pricing: { main: string; tag?: string } | null }} props
 */
export default function LandingHeroPricingBadge({ pricing }) {
  if (!pricing?.main) return null;

  return (
    <div className="landing-hero-pricing" role="status" aria-label={pricing.main}>
      <span className="landing-hero-pricing__ribbon" aria-hidden>
        Season packages
      </span>
      <p className="landing-hero-pricing__amount">{pricing.main}</p>
      {pricing.tag ? <p className="landing-hero-pricing__tag">{pricing.tag}</p> : null}
    </div>
  );
}
