const HTML_TAG_RE = /<\/?(?:p|div|h[1-6]|ul|ol|li|br|blockquote|strong|b|em|i|a|img|span|table|thead|tbody|tr|td|th)\b/i;

export const EMPTY_PARAGRAPH_BLOCK = { type: 'paragraph', text: '' };
export const EMPTY_IMAGE_BLOCK = { type: 'image', url: '', caption: '' };

export function looksLikeHtmlContent(value) {
  return typeof value === 'string' && HTML_TAG_RE.test(value.trim());
}

/** Strip noisy Word-export markup while keeping structure. */
export function prepareBlogHtml(html) {
  let out = String(html || '').trim();
  if (!out) return '';

  out = out.replace(/<span[^>]*font-weight:\s*bold[^>]*>([\s\S]*?)<\/span>/gi, '<strong>$1</strong>');
  out = out.replace(/\s(lang|class)="[^"]*"/gi, '');
  out = out.replace(/\sstyle="[^"]*"/gi, '');

  return out;
}

export function parseBlogContentInput(content) {
  if (typeof content === 'string') {
    const trimmed = content.trim();
    if (!trimmed) return content;
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        return JSON.parse(trimmed);
      } catch {
        return content;
      }
    }
  }
  return content;
}

export function isBlogBlocksContent(content) {
  const parsed = parseBlogContentInput(content);
  return Boolean(
    parsed &&
      typeof parsed === 'object' &&
      !Array.isArray(parsed) &&
      Array.isArray(parsed.blocks)
  );
}

function htmlToPlainText(html) {
  return String(html || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<li[^>]*>/gi, '\n- ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function normalizeBlock(block) {
  if (!block || typeof block !== 'object') return { ...EMPTY_PARAGRAPH_BLOCK };
  if (block.type === 'image') {
    return {
      type: 'image',
      url: String(block.url || '').trim(),
      caption: String(block.caption || '').trim(),
    };
  }
  return {
    type: 'paragraph',
    text: String(block.text ?? block.body ?? '').trim(),
  };
}

export function blockHasContent(block) {
  const normalized = normalizeBlock(block);
  if (normalized.type === 'image') return Boolean(normalized.url);
  return Boolean(normalized.text);
}

export function blogBlocksHaveMinContent(blocks, minChars = 20) {
  let chars = 0;
  let hasImage = false;

  for (const block of blocks || []) {
    const normalized = normalizeBlock(block);
    if (normalized.type === 'image' && normalized.url) {
      hasImage = true;
      chars += 12;
      continue;
    }
    chars += normalized.text.length;
  }

  return chars >= minChars || (hasImage && chars >= 3);
}

export function deserializeBlogContent(content) {
  const parsed = parseBlogContentInput(content);
  if (isBlogBlocksContent(parsed)) {
    const blocks = parsed.blocks.map(normalizeBlock);
    return blocks.length ? blocks : [{ ...EMPTY_PARAGRAPH_BLOCK }];
  }

  if (typeof parsed === 'string') {
    const trimmed = parsed.trim();
    if (!trimmed) return [{ ...EMPTY_PARAGRAPH_BLOCK }];
    if (looksLikeHtmlContent(trimmed)) {
      return [{ type: 'paragraph', text: htmlToPlainText(trimmed) }];
    }
    const paragraphs = trimmed.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
    return paragraphs.length
      ? paragraphs.map((text) => ({ type: 'paragraph', text }))
      : [{ ...EMPTY_PARAGRAPH_BLOCK }];
  }

  if (Array.isArray(parsed)) {
    const paragraphs = parsed.map((item) => String(item ?? '').trim()).filter(Boolean);
    return paragraphs.length
      ? paragraphs.map((text) => ({ type: 'paragraph', text }))
      : [{ ...EMPTY_PARAGRAPH_BLOCK }];
  }

  return [{ ...EMPTY_PARAGRAPH_BLOCK }];
}

export function serializeBlogBlocks(blocks) {
  const normalized = (blocks || []).map(normalizeBlock).filter(blockHasContent);
  if (!normalized.length) {
    return {
      version: 1,
      blocks: [{ type: 'paragraph', text: 'Travel story coming soon.' }],
    };
  }
  return { version: 1, blocks: normalized };
}

/**
 * Normalise blog body from API (blocks, string HTML, plain text, or legacy string array).
 */
export function normalizeBlogBody(content) {
  const parsed = parseBlogContentInput(content);
  if (isBlogBlocksContent(parsed)) {
    const blocks = parsed.blocks.map(normalizeBlock).filter(blockHasContent);
    return blocks.length ? { kind: 'blocks', blocks } : { kind: 'empty' };
  }

  if (Array.isArray(parsed)) {
    const paragraphs = parsed.map((item) => String(item ?? '').trim()).filter(Boolean);
    return paragraphs.length ? { kind: 'paragraphs', paragraphs } : { kind: 'empty' };
  }

  if (typeof parsed !== 'string') {
    return { kind: 'empty' };
  }

  const trimmed = parsed.trim();
  if (!trimmed || trimmed === '...') {
    return { kind: 'empty' };
  }

  if (looksLikeHtmlContent(trimmed)) {
    return { kind: 'html', html: prepareBlogHtml(trimmed) };
  }

  const paragraphs = trimmed.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  return paragraphs.length ? { kind: 'paragraphs', paragraphs } : { kind: 'empty' };
}
