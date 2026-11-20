import { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import type { JournalArticle, PortfolioShoot } from '../types';
import { ResilientImage } from './ResilientImage';

interface EditorialJournalProps {
  articles: JournalArticle[];
  shoots: PortfolioShoot[];
  modelName: string;
}

export function EditorialJournal({
  articles,
  shoots,
  modelName,
}: EditorialJournalProps) {
  const [activeArticle, setActiveArticle] = useState<JournalArticle | null>(null);

  return (
    <section className="py-14 lg:py-20 border-t border-zinc-900">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="mb-10">
          <p className="text-xs text-zinc-500 mb-2">
            Compatible Creative · Markiewicz Creative Models
          </p>
          <h2 className="font-display text-3xl lg:text-4xl font-normal text-zinc-100 tracking-tight">
            Compatible Creative Journal
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article) => {
            const linkedShoot = shoots.find((s) => article.linkedShootIds.includes(s.id));
            return (
              <article
                key={article.id}
                className="group flex flex-col justify-between rounded-2xl border border-zinc-800/90 bg-[#0D0D0F] overflow-hidden"
              >
                {linkedShoot && (
                  <div className="aspect-[16/9] overflow-hidden border-b border-zinc-800/80">
                    <ResilientImage
                      src={linkedShoot.imageUrl}
                      alt={linkedShoot.altText}
                      title={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                )}

                <div className="p-6 lg:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mb-3">
                      <span className="text-[#D4AF37]">{article.targetKeyword}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{article.publishedAt}</span>
                      <span aria-hidden="true">·</span>
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="font-display text-2xl lg:text-3xl text-zinc-100 leading-snug mb-3">
                      {article.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-zinc-400">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                    <span className="font-mono text-xs text-zinc-500 truncate max-w-[60%]">
                      /journal/{article.slug}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveArticle(article)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-100 hover:text-[#D4AF37] transition-colors whitespace-nowrap"
                    >
                      Read Essay
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={activeArticle.title}
        >
          <div className="max-w-3xl mx-auto my-8 rounded-2xl border border-zinc-800 bg-[#0A0A0C] p-6 sm:p-10">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                <span className="text-[#D4AF37]">{activeArticle.targetKeyword}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{activeArticle.publishedAt}</span>
                <span aria-hidden="true">·</span>
                <span>{activeArticle.readTime}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 hover:text-white shrink-0"
                aria-label="Close article"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl text-zinc-100 leading-tight mb-4">
              {activeArticle.title}
            </h2>

            <p className="text-sm text-zinc-400 mb-6 pb-6 border-b border-zinc-800">
              By {modelName} · Compatible Creative &amp; Markiewicz Creative Models
            </p>

            <div className="space-y-8">
              {activeArticle.sections.map((section, idx) => (
                <section key={idx} className="space-y-2.5">
                  <h3 className="font-display text-2xl text-zinc-100">{section.heading}</h3>
                  <p className="text-base leading-relaxed text-zinc-300">{section.body}</p>
                </section>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
