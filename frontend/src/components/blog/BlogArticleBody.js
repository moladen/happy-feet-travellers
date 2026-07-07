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
