const HTML_TAG_RE = /<\/?(?:p|div|h[1-6]|ul|ol|li|br|blockquote|strong|b|em|i|a|img|span|table|thead|tbody|tr|td|th)\b/i;

const SAFE_COLOR_RE = /^(#[0-9a-f]{3,8}|rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)|[a-z]{3,20})$/i;

export function stripHtmlToText(html) {
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

function sanitizeInlineColorStyle(style) {
  const match = /(?:^|;)\s*color:\s*([^;]+)/i.exec(String(style || ''));
  if (!match) return '';
  const color = match[1].trim().replace(/['"]/g, '');
  if (!SAFE_COLOR_RE.test(color)) return '';
  return `color: ${color}`;
}

export const EMPTY_PARAGRAPH_BLOCK = { type: 'paragraph', text: '' };
export const EMPTY_IMAGE_BLOCK = { type: 'image', url: '', caption: '' };
export const EMPTY_LINK_BLOCK = {
  type: 'link',
  url: '',
  title: '',
  description: '',
  label: 'Visit link',
};

/** True for same-app paths like /tour/spiti-valley (not protocol-relative //…). */
export function isInternalAppPath(url) {
  const raw = String(url || '').trim();
  return raw.startsWith('/') && !raw.startsWith('//');
}

function siteOrigins() {
  const origins = new Set();
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_FRONTEND_URL,
    process.env.NEXT_PUBLIC_APP_URL,
  ];
  for (const value of candidates) {
    if (!value) continue;
    try {
      origins.add(new URL(value).origin);
    } catch {
      /* ignore bad env */
    }
  }
  return origins;
}

/**
 * Allowlist blog URLs:
 * - Internal app paths (/tour/…, /blog/…, landing package paths)
 * - Absolute http(s); same-site / localhost absolute URLs collapse to paths
 */
export function sanitizeBlogUrl(url) {
  const raw = String(url || '').trim();
  if (!raw || /[\u0000-\u001F<>"']/.test(raw)) return '';
  if (/^(javascript|data|vbscript):/i.test(raw)) return '';
  // Protocol-relative URLs are not allowed
  if (raw.startsWith('//')) return '';

  if (isInternalAppPath(raw)) {
    return raw;
  }

  try {
    const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const parsed = new URL(withProto);
    if (!['http:', 'https:'].includes(parsed.protocol)) return '';

    const host = parsed.hostname.toLowerCase();
    const isLocal = host === 'localhost' || host === '127.0.0.1';
    if (isLocal || siteOrigins().has(parsed.origin)) {
      return `${parsed.pathname}${parsed.search}${parsed.hash}` || '/';
    }

    return parsed.href;
  } catch {
    return '';
  }
}

/** Alias — accepts http(s) and internal app paths for blog link blocks. */
export function sanitizeExternalUrl(url) {
  return sanitizeBlogUrl(url);
}

export function looksLikeHtmlContent(value) {
  return typeof value === 'string' && HTML_TAG_RE.test(value.trim());
}

function rewriteAnchorTag(attrs) {
  const hrefMatch = /\bhref\s*=\s*(["'])(.*?)\1/i.exec(attrs);
  if (!hrefMatch) return null;
  const safe = sanitizeBlogUrl(hrefMatch[2]);
  if (!safe) return null;

  let cleaned = attrs
    .replace(/\bhref\s*=\s*(["']).*?\1/i, `href="${safe.replace(/"/g, '&quot;')}"`)
    .replace(/\s(target|rel)\s*=\s*(["']).*?\2/gi, '');

  if (isInternalAppPath(safe)) {
    return `<a${cleaned}>`;
  }
  return `<a${cleaned} target="_blank" rel="noopener noreferrer">`;
}

/** Strip noisy Word-export markup while keeping structure and safe links. */
export function prepareBlogHtml(html) {
  let out = String(html || '').trim();
  if (!out) return '';

  out = out.replace(/<span[^>]*font-weight:\s*bold[^>]*>([\s\S]*?)<\/span>/gi, '<strong>$1</strong>');
  out = out.replace(/\s(lang|class)="[^"]*"/gi, '');
  out = out.replace(/\sstyle="([^"]*)"/gi, (_, styles) => {
    const safe = sanitizeInlineColorStyle(styles);
    return safe ? ` style="${safe}"` : '';
  });

  out = out.replace(/<a\b([^>]*)>/gi, (full, attrs) => {
    const rewritten = rewriteAnchorTag(attrs);
    return rewritten || full.replace(/^<a/i, '<span').replace(/>$/, ' data-invalid-link="1">');
  });

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

export function normalizeBlock(block) {
  if (!block || typeof block !== 'object') return { ...EMPTY_PARAGRAPH_BLOCK };
  if (block.type === 'image') {
    return {
      type: 'image',
      url: String(block.url || '').trim(),
      caption: String(block.caption || '').trim(),
    };
  }
  if (block.type === 'link') {
    return {
      type: 'link',
      url: sanitizeBlogUrl(block.url),
      title: String(block.title || '').trim(),
      description: String(block.description || block.caption || '').trim(),
      label: String(block.label || block.buttonLabel || 'Visit link').trim() || 'Visit link',
    };
  }
  return {
    type: 'paragraph',
    text: String(block.text ?? block.body ?? ''),
  };
}

function paragraphCharCount(text) {
  const raw = String(text || '').trim();
  if (!raw) return 0;
  return looksLikeHtmlContent(raw) ? stripHtmlToText(raw).length : raw.length;
}

export function blockHasContent(block) {
  const normalized = normalizeBlock(block);
  if (normalized.type === 'image') return Boolean(normalized.url);
  if (normalized.type === 'link') return Boolean(normalized.url);
  return paragraphCharCount(normalized.text) > 0;
}

export function blogBlocksHaveMinContent(blocks, minChars = 20) {
  let chars = 0;
  let hasImage = false;

  for (const block of blocks || []) {
    const normalized = normalizeBlock(block);
    if (normalized.type === 'image') {
      if (normalized.url) {
        hasImage = true;
        chars += 12;
      }
      continue;
    }
    if (normalized.type === 'link') {
      if (normalized.url) chars += 8;
      continue;
    }
    chars += paragraphCharCount(normalized.text);
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
      return [{ type: 'paragraph', text: prepareBlogHtml(trimmed) }];
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
