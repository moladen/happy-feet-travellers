import { parseItineraryDetails } from '@/lib/itineraryText';

const DEFAULT_CLASS = 'mt-2';

function ItineraryPointList({ items, className = DEFAULT_CLASS }) {
  if (!items?.length) return null;

  return (
    <ul className={`space-y-2 ${className}`}>
      {items.map((item, idx) => (
        <li key={idx} className="flex gap-2 text-sm leading-relaxed text-foreground/85">
          <span className="mt-0.5 shrink-0 font-bold text-green-600" aria-hidden>
            ✓
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ItineraryDetailsText({ details, className = DEFAULT_CLASS }) {
  const parsed = parseItineraryDetails(details);

  if (parsed.kind === 'empty') return null;

  if (parsed.kind === 'paragraph') {
    return <p className={`${className} text-sm leading-relaxed text-foreground/85`}>{parsed.text}</p>;
  }

  if (parsed.kind === 'preline') {
    const lines = parsed.text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length >= 2) {
      return <ItineraryPointList items={lines} className={className} />;
    }
    return (
      <p className={`${className} whitespace-pre-line text-sm leading-relaxed text-foreground/85`}>
        {parsed.text}
      </p>
    );
  }

  if (parsed.kind === 'bullets' || parsed.kind === 'emojiList') {
    return <ItineraryPointList items={parsed.items} className={className} />;
  }

  return (
    <div className={className}>
      {parsed.segments.map((segment, idx) => {
        if (segment.kind === 'line') {
          return (
            <p
              key={`line-${idx}`}
              className={`text-sm leading-relaxed text-foreground/85 ${idx > 0 ? 'mt-2' : ''}`}
            >
              {segment.text}
            </p>
          );
        }
        return (
          <ItineraryPointList
            key={`list-${idx}`}
            items={segment.items}
            className={idx > 0 ? 'mt-2' : ''}
          />
        );
      })}
    </div>
  );
}
