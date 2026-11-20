import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy } from 'lucide-react';
import type { ExternalWorkLink, JournalArticle, PortfolioShoot } from '../types';
import { ResilientImage } from './ResilientImage';

interface EditorialJournalProps {
  articles: JournalArticle[];
  shoots: PortfolioShoot[];
  modelName: string;
  otherWorkLinks?: ExternalWorkLink[];
  isFullPage?: boolean;
  selectedSlug?: string | null;
  onSelectArticleSlug?: (slug: string) => void;
  onOpenBlogIndex?: () => void;
  onOpenPortfolio?: () => void;
}

function renderSectionBody(body: string) {
  const blocks = body.split('\n\n');
  return blocks.map((block, blockIdx) => {
    const lines = block
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    const bulletLines = lines.filter((l) => l.startsWith('• '));

    if (bulletLines.length > 0 && bulletLines.length === lines.length) {
      return (
        <ul key={blockIdx} className="space-y-3 pl-5 list-disc marker:text-[#D4AF37]">
          {bulletLines.map((line, i) => (
            <li key={i} className="text-base leading-relaxed text-zinc-300">
              {line.slice(2)}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p key={blockIdx} className="text-base leading-relaxed text-zinc-300">
        {block}
      </p>
    );
  });
}

export function EditorialJournal({
  articles,
  shoots,
  modelName,
  otherWorkLinks = [],
  isFullPage = false,
  selectedSlug = null,
  onSelectArticleSlug,
  onOpenBlogIndex,
  onOpenPortfolio,
}: EditorialJournalProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [copiedUrl, setCopiedUrl] = useState(false);

  const categories = useMemo(() => {
    const found = new Set<string>(['All']);
    articles.forEach((a) => {
      if (a.category) found.add(a.category);
    });
    return Array.from(found);
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (activeCategory === 'All') return articles;
    return articles.filter((a) => a.category === activeCategory);
  }, [articles, activeCategory]);

  const activeArticle = useMemo(
    () => (selectedSlug ? articles.find((a) => a.slug === selectedSlug) ?? null : null),
    [articles, selectedSlug]
  );

  // Dedicated /blog/:slug Page View
  if (activeArticle) {
    const linkedShoots = shoots.filter((s) => activeArticle.linkedShootIds.includes(s.id));
    const relatedArticles = articles.filter((a) => a.id !== activeArticle.id).slice(0, 2);

    const handleCopyShareUrl = async () => {
      if (typeof window === 'undefined') return;
      await navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    };

    return (
      <article className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          {/* Breadcrumb & Back to /blog */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-zinc-800/80 text-xs">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-zinc-500">
              <button
                type="button"
                onClick={onOpenPortfolio}
                className="hover:text-zinc-200 transition-colors"
              >
                Portfolio
              </button>
              <span aria-hidden="true">/</span>
              <button
                type="button"
                onClick={onOpenBlogIndex}
                className="hover:text-zinc-200 transition-colors"
              >
                Blog
              </button>
              <span aria-hidden="true">/</span>
              <span className="text-zinc-300 truncate max-w-[220px] sm:max-w-md">
                {activeArticle.title}
              </span>
            </nav>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleCopyShareUrl}
                className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-[#D4AF37] transition-colors"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-[#D4AF37]" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedUrl ? 'Link Copied' : 'Copy Article URL'}
              </button>

              <button
                type="button"
                onClick={onOpenBlogIndex}
                className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-[#D4AF37] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                All Blog Posts
              </button>
            </div>
          </div>

          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mb-4">
              {activeArticle.category && (
                <>
                  <span className="text-[#D4AF37]">{activeArticle.category}</span>
                  <span aria-hidden="true">·</span>
                </>
              )}
              <span>{activeArticle.targetKeyword}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={activeArticle.publishedAt} className="font-mono tabular-nums">
                {activeArticle.publishedAt}
              </time>
              <span aria-hidden="true">·</span>
              <span>{activeArticle.readTime}</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-normal text-zinc-100 leading-[1.1] tracking-tight mb-5">
              {activeArticle.title}
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed mb-6">
              {activeArticle.excerpt}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-zinc-800/80 text-xs text-zinc-400">
              <span>
                By <strong className="text-zinc-200 font-medium">{modelName}</strong> · Compatible Creative &amp; Markiewicz Creative Models
              </span>
              <span className="font-mono text-zinc-500">/blog/{activeArticle.slug}</span>
            </div>
          </header>

          {linkedShoots[0] && (
            <figure className="mb-10 rounded-2xl overflow-hidden border border-zinc-800 bg-[#0D0D0F]">
              <div className="aspect-[16/10] overflow-hidden">
                <ResilientImage
                  src={linkedShoots[0].imageUrl}
                  alt={linkedShoots[0].altText}
                  title={linkedShoots[0].title}
                  priority
                  sizes="(max-width: 1023px) 100vw, 832px"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <figcaption className="px-5 py-3.5 text-xs text-zinc-400 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2">
                <span>{linkedShoots[0].caption}</span>
                <span className="font-mono text-zinc-500">{linkedShoots[0].location}</span>
              </figcaption>
            </figure>
          )}

          <div className="space-y-10 mb-14">
            {activeArticle.sections.map((section, idx) => {
              const inlineShoot = idx === 1 ? linkedShoots[1] : undefined;
              return (
                <div key={idx} className="space-y-10">
                  <section className="space-y-4">
                    <h2 className="font-display text-2xl sm:text-3xl text-zinc-100 tracking-tight">
                      {section.heading}
                    </h2>
                    <div className="space-y-4">{renderSectionBody(section.body)}</div>
                  </section>

                  {inlineShoot && (
                    <figure className="rounded-2xl overflow-hidden border border-zinc-800 bg-[#0D0D0F]">
                      <div className="aspect-[16/10] overflow-hidden">
                        <ResilientImage
                          src={inlineShoot.imageUrl}
                          alt={inlineShoot.altText}
                          title={inlineShoot.title}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <figcaption className="px-5 py-3.5 text-xs text-zinc-400 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2">
                        <span>{inlineShoot.caption}</span>
                        <span className="font-mono text-zinc-500">{inlineShoot.photographer}</span>
                      </figcaption>
                    </figure>
                  )}
                </div>
              );
            })}
          </div>

          {linkedShoots.length > 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
              {linkedShoots.slice(2).map((shoot) => (
                <figure
                  key={shoot.id}
                  className="rounded-xl overflow-hidden border border-zinc-800 bg-[#0D0D0F]"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <ResilientImage
                      src={shoot.imageUrl}
                      alt={shoot.altText}
                      title={shoot.title}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <figcaption className="p-4 text-xs text-zinc-400 space-y-1">
                    <p className="text-zinc-200 font-medium">{shoot.title}</p>
                    <p>{shoot.caption}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}

          {/* Cross-reference External Work */}
          {otherWorkLinks.length > 0 && (
            <div className="rounded-2xl border border-zinc-800 bg-[#0D0D0F] p-6 sm:p-8 mb-14">
              <p className="text-xs text-[#D4AF37] mb-1">
                Compatible Creative · Compatible Music
              </p>
              <h2 className="font-display text-2xl text-zinc-100 mb-4">
                Related Studio &amp; Audio Work
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {otherWorkLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 rounded-xl border border-zinc-800/80 bg-[#050505] px-4 py-3 hover:border-[#D4AF37]/60 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-zinc-100 truncate group-hover:text-[#D4AF37] transition-colors">
                        {link.title}
                      </p>
                      <p className="font-mono text-[11px] text-zinc-500 truncate">{link.domain}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-[#D4AF37] shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Related Blog Articles */}
          {relatedArticles.length > 0 && (
            <div className="pt-10 border-t border-zinc-800">
              <h2 className="font-display text-2xl text-zinc-100 mb-6">
                More from the Blog
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedArticles.map((rel) => (
                  <a
                    key={rel.id}
                    href={`/blog/${rel.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectArticleSlug?.(rel.slug);
                    }}
                    className="block text-left rounded-xl border border-zinc-800 bg-[#0D0D0F] p-5 hover:border-zinc-600 transition-colors"
                  >
                    <p className="text-xs text-[#D4AF37] mb-2">
                      {rel.category || rel.targetKeyword} · {rel.readTime}
                    </p>
                    <h3 className="font-display text-xl text-zinc-100 mb-2">{rel.title}</h3>
                    <p className="text-xs text-zinc-400 line-clamp-2">{rel.excerpt}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    );
  }

  return (
    <section
      id="blog-section"
      className={isFullPage ? 'py-12 lg:py-16' : 'py-14 lg:py-20 border-t border-zinc-900'}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs text-zinc-500 mb-2">
              Compatible Creative · Markiewicz Creative Models · Compatible Music
            </p>
            {isFullPage ? (
              <h1 className="font-display text-4xl lg:text-5xl font-normal text-zinc-100 tracking-tight">
                Compatible Creative Blog
              </h1>
            ) : (
              <h2 className="font-display text-3xl lg:text-4xl font-normal text-zinc-100 tracking-tight">
                Compatible Creative Blog
              </h2>
            )}
          </div>

          {!isFullPage && onOpenBlogIndex ? (
            <button
              type="button"
              onClick={onOpenBlogIndex}
              className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-200 hover:text-[#D4AF37] transition-colors whitespace-nowrap"
            >
              View All Blog Pages (/blog)
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            categories.length > 1 && (
              <div className="flex flex-wrap items-center gap-5 border-b border-zinc-800/80 pb-2">
                {categories.map((cat) => {
                  const active = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`pb-1 text-xs font-medium transition-colors whitespace-nowrap border-b-2 -mb-[9px] ${
                        active
                          ? 'text-zinc-100 border-[#D4AF37]'
                          : 'text-zinc-500 border-transparent hover:text-zinc-300'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            )
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(isFullPage ? filteredArticles : articles).map((article) => {
            const linkedShoot = shoots.find((s) => article.linkedShootIds.includes(s.id));
            return (
              <article
                key={article.id}
                className="group flex flex-col justify-between rounded-2xl border border-zinc-800/90 bg-[#0D0D0F] overflow-hidden"
              >
                {linkedShoot && (
                  <a
                    href={`/blog/${article.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectArticleSlug?.(article.slug);
                    }}
                    className="block w-full aspect-[16/9] overflow-hidden border-b border-zinc-800/80 text-left"
                  >
                    <ResilientImage
                      src={linkedShoot.imageUrl}
                      alt={linkedShoot.altText}
                      title={article.title}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </a>
                )}

                <div className="p-6 lg:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mb-3">
                      <span className="text-[#D4AF37]">
                        {article.category || article.targetKeyword}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{article.publishedAt}</span>
                      <span aria-hidden="true">·</span>
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="font-display text-2xl lg:text-3xl text-zinc-100 leading-snug mb-3">
                      <a
                        href={`/blog/${article.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectArticleSlug?.(article.slug);
                        }}
                        className="hover:text-[#D4AF37] transition-colors"
                      >
                        {article.title}
                      </a>
                    </h3>

                    <p className="text-sm leading-relaxed text-zinc-400">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                    <span className="font-mono text-xs text-zinc-500 truncate max-w-[60%]">
                      /blog/{article.slug}
                    </span>
                    <a
                      href={`/blog/${article.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectArticleSlug?.(article.slug);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-100 hover:text-[#D4AF37] transition-colors whitespace-nowrap"
                    >
                      Read Post
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
