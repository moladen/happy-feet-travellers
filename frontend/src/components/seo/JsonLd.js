/**
 * Renders one or more schema.org JSON-LD blocks.
 * @param {{ data: object | object[] | null | undefined }} props
 */
export default function JsonLd({ data }) {
  if (!data) return null;

  const entries = (Array.isArray(data) ? data : [data]).filter(Boolean);
  if (!entries.length) return null;

  return entries.map((entry, index) => (
    <script
      // eslint-disable-next-line react/no-danger
      key={`jsonld-${index}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
    />
  ));
}
