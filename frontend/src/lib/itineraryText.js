/** Common bullet prefixes entered in admin: -, *, •, ·, numbered lists */
const BULLET_PREFIX_RE = /^(\u2022|\u2023|\u25E6|\u25AA|\*|-|–|—|•|·|\d+[\.\)])\s+/;

/** Lines that start with an emoji (typical admin Kutch / Rann itinerary style) */
const EMOJI_LED_LINE_RE = /^(?:\p{Extended_Pictographic}\p{Emoji_Modifier}?|\p{Emoji_Presentation})/u;

export function normaliseItineraryDetailsText(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map((item) => String(item ?? '').trim()).filter(Boolean).join('\n');
  return String(value);
}

export function isItineraryBulletLine(line) {
  return BULLET_PREFIX_RE.test(String(line || '').trim());
}

export function stripItineraryBulletPrefix(line) {
  return String(line || '').trim().replace(BULLET_PREFIX_RE, '').trim();
}

export function isEmojiLedLine(line) {
  const text = String(line || '').trim();
  if (!text) return false;
  try {
    return EMOJI_LED_LINE_RE.test(text);
  } catch {
    return /^[\u2600-\u27BF\uD83C-\uDBFF]/.test(text);
  }
}

/**
 * Parse itinerary day details for display.
 * Backward compatible with single-line paragraph strings from older tours.
 */
export function parseItineraryDetails(text) {
  const raw = normaliseItineraryDetailsText(text);
  const trimmed = raw.trim();
  if (!trimmed) return { kind: 'empty' };

  const lines = raw.split(/\r?\n/);
  const hasLineBreaks = lines.length > 1;
  const nonEmptyLines = lines.map((line) => line.trim()).filter(Boolean);

  if (!nonEmptyLines.length) return { kind: 'empty' };

  const hasBullets = nonEmptyLines.some(isItineraryBulletLine);

  if (!hasLineBreaks && !hasBullets) {
    return { kind: 'paragraph', text: trimmed };
  }

  if (!hasBullets) {
    const emojiLines = nonEmptyLines.filter(isEmojiLedLine);
    if (emojiLines.length >= 2) {
      const segments = [];
      let emojiBuffer = [];

      const flushEmoji = () => {
        if (!emojiBuffer.length) return;
        segments.push({ kind: 'emojiList', items: [...emojiBuffer] });
        emojiBuffer = [];
      };

      for (const line of lines) {
        const lineText = line.trim();
        if (!lineText) {
          flushEmoji();
          continue;
        }
        if (isEmojiLedLine(lineText)) {
          emojiBuffer.push(lineText);
        } else {
          flushEmoji();
          segments.push({ kind: 'line', text: lineText });
        }
      }
      flushEmoji();

      if (segments.length === 1 && segments[0].kind === 'emojiList') {
        return { kind: 'emojiList', items: segments[0].items };
      }
      if (segments.length) {
        return { kind: 'segments', segments };
      }
    }

    return { kind: 'preline', text: raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n') };
  }

  const segments = [];
  let bulletBuffer = [];

  const flushBullets = () => {
    if (!bulletBuffer.length) return;
    segments.push({ kind: 'bullets', items: [...bulletBuffer] });
    bulletBuffer = [];
  };

  for (const line of lines) {
    const lineText = line.trim();
    if (!lineText) {
      flushBullets();
      continue;
    }
    if (isItineraryBulletLine(lineText)) {
      bulletBuffer.push(stripItineraryBulletPrefix(lineText));
    } else {
      flushBullets();
      segments.push({ kind: 'line', text: lineText });
    }
  }
  flushBullets();

  if (segments.length === 1 && segments[0].kind === 'bullets') {
    return { kind: 'bullets', items: segments[0].items };
  }
  if (segments.length === 1 && segments[0].kind === 'line') {
    return { kind: 'paragraph', text: segments[0].text };
  }

  return { kind: 'segments', segments };
}

export function formatItineraryDetailsHtml(text, esc) {
  const escape = typeof esc === 'function' ? esc : (value) => String(value ?? '');
  const parsed = parseItineraryDetails(text);

  if (parsed.kind === 'empty') return '';
  if (parsed.kind === 'paragraph') return escape(parsed.text);
  if (parsed.kind === 'preline') {
    return escape(parsed.text).replace(/\n/g, '<br/>');
  }
  if (parsed.kind === 'bullets' || parsed.kind === 'emojiList') {
    const items = parsed.items.map((item) => `<li>${escape(item)}</li>`).join('');
    const listStyle =
      parsed.kind === 'emojiList'
        ? 'margin:0;padding:0;list-style:none'
        : 'margin:0;padding-left:1.25rem';
    return `<ul style="${listStyle}">${items}</ul>`;
  }

  return parsed.segments
    .map((segment) => {
      if (segment.kind === 'line') return `<p style="margin:0 0 0.5rem">${escape(segment.text)}</p>`;
      const items = segment.items.map((item) => `<li>${escape(item)}</li>`).join('');
      if (segment.kind === 'emojiList') {
        return `<ul style="margin:0 0 0.5rem;padding:0;list-style:none">${items}</ul>`;
      }
      return `<ul style="margin:0 0 0.5rem;padding-left:1.25rem">${items}</ul>`;
    })
    .join('');
}
