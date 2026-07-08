import { looksLikeHtmlContent, normalizeBlogBody, prepareBlogHtml } from '@/lib/blogContent';

const PROSE_CLASS =
  'blog-content prose prose-neutral max-w-none prose-headings:font-display prose-headings:text-primary prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-2 prose-p:text-foreground prose-p:leading-relaxed prose-li:text-foreground prose-a:text-secondary prose-a:no-underline hover:prose-a:text-primary prose-strong:text-primary prose-strong:font-bold prose-em:italic [&_p]:my-4';

function renderParagraphText(text, keyPrefix) {
  const paragraphs = String(text || '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (!paragraphs.length) return null;

  return paragraphs.map((para, index) => (
    <p key={`${keyPrefix}-${index}`} className="mb-4 whitespace-pre-line last:mb-0">
      {para}
    </p>
  ));
}

function displayHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function renderBlocks(blocks) {
  return blocks.map((block, index) => {
    if (block.type === 'image' && block.url) {
      return (
        <figure
          key={`block-image-${index}`}
          className="my-8 overflow-hidden rounded-2xl border border-[#dceaf7] bg-section-alt not-prose"
        >
          <div className="aspect-[16/10] w-full bg-section-alt">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={block.url} alt={block.caption || ''} className="h-full w-full object-cover" />
          </div>
          {block.caption ? (
            <figcaption className="border-t border-[#dceaf7] px-4 py-3 text-sm text-foreground/70">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    }

    if (block.type === 'link' && block.url) {
      const title = block.title || displayHost(block.url);
      return (
        <aside
          key={`block-link-${index}`}
          className="blog-link-embed my-8 not-prose"
        >
          <a
            href={block.url}
            target="_blank"
            rel="noopener noreferrer"
            className="blog-link-embed__card group flex flex-col gap-3 rounded-2xl border border-[#dceaf7] bg-gradient-to-br from-[#f8fbff] to-white p-5 shadow-sm transition hover:border-[#4fa3d1] hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">
                External link · {displayHost(block.url)}
              </p>
              <p className="mt-1 font-display text-lg font-bold text-primary group-hover:text-secondary">
                {title}
              </p>
              {block.description ? (
                <p className="mt-1 text-sm leading-relaxed text-foreground/75">{block.description}</p>
              ) : null}
            </div>
            <span className="inline-flex shrink-0 items-center justify-center rounded-xl bg-cta px-4 py-2.5 text-sm font-bold text-white transition group-hover:bg-cta-hover">
              {block.label || 'Visit link'}
              <span className="ml-2" aria-hidden>↗</span>
            </span>
          </a>
        </aside>
      );
    }

    if (block.type === 'paragraph') {
      const text = String(block.text || '').trim();
      if (!text) return null;
      if (looksLikeHtmlContent(text)) {
        return (
          <div
            key={`block-paragraph-${index}`}
            className={`${PROSE_CLASS} blog-rich-block`}
            dangerouslySetInnerHTML={{ __html: prepareBlogHtml(text) }}
          />
        );
      }
      return (
        <div key={`block-paragraph-${index}`}>{renderParagraphText(block.text, `p-${index}`)}</div>
      );
    }

    return null;
  });
}

export default function BlogArticleBody({ content }) {
  const body = normalizeBlogBody(content);

  if (body.kind === 'empty') {
    return (
      <p className="text-foreground/80">Full article body will appear here when connected to your CMS.</p>
    );
  }

  if (body.kind === 'blocks') {
    return <div className={PROSE_CLASS}>{renderBlocks(body.blocks)}</div>;
  }

  if (body.kind === 'html') {
    return <div className={PROSE_CLASS} dangerouslySetInnerHTML={{ __html: body.html }} />;
  }

  return (
    <div className={PROSE_CLASS}>
      {body.paragraphs.map((para, i) => (
        <p key={i} className="mb-4 whitespace-pre-line last:mb-0">
          {para}
        </p>
      ))}
    </div>
  );
}
