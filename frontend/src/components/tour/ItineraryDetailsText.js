import { parseItineraryDetails } from '@/lib/itineraryText';

const DEFAULT_CLASS = 'mt-2 text-sm leading-relaxed text-foreground/85';

export default function ItineraryDetailsText({ details, className = DEFAULT_CLASS }) {
  const parsed = parseItineraryDetails(details);

  if (parsed.kind === 'empty') return null;

  if (parsed.kind === 'paragraph') {
    return <p className={className}>{parsed.text}</p>;
  }

  if (parsed.kind === 'preline') {
    return <p className={`${className} whitespace-pre-line`}>{parsed.text}</p>;
  }

  if (parsed.kind === 'bullets') {
    return (
      <ul className={`${className} list-disc space-y-1 pl-5`}>
        {parsed.items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    );
  }

  if (parsed.kind === 'emojiList') {
    return (
      <ul className={`${className} list-none space-y-2`}>
        {parsed.items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <div className={className}>
      {parsed.segments.map((segment, idx) => {
        if (segment.kind === 'line') {
          return (
            <p key={`line-${idx}`} className={idx > 0 ? 'mt-2' : undefined}>
              {segment.text}
            </p>
          );
        }
        if (segment.kind === 'emojiList') {
          return (
            <ul key={`emoji-${idx}`} className={`list-none space-y-2 ${idx > 0 ? 'mt-2' : ''}`}>
              {segment.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          );
        }
        return (
          <ul key={`bullets-${idx}`} className={`list-disc space-y-1 pl-5 ${idx > 0 ? 'mt-2' : ''}`}>
            {segment.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}
