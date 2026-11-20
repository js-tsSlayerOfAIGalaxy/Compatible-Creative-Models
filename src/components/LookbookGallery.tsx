import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { PortfolioShoot, ShootCategory } from '../types';
import { ResilientImage } from './ResilientImage';

interface LookbookGalleryProps {
  shoots: PortfolioShoot[];
}

const CATEGORIES: Array<'All' | ShootCategory> = [
  'All',
  'Runway',
  'Campaign',
  'Editorial',
  'Creative Direction',
];

export function LookbookGallery({ shoots }: LookbookGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | ShootCategory>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredShoots =
    selectedCategory === 'All'
      ? shoots
      : shoots.filter((shoot) => shoot.category === selectedCategory);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % filteredShoots.length));
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev - 1 + filteredShoots.length) % filteredShoots.length
        );
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, filteredShoots.length]);

  const activeShoot = lightboxIndex !== null ? filteredShoots[lightboxIndex] : null;

  return (
    <section id="lookbook-section" className="py-12 lg:py-16">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        {/* Section Header + Interactive Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs text-zinc-500 mb-2">
              Compatible Creative Models · Curated Talent &amp; Art Archive
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-normal text-zinc-100 tracking-tight">
              Compatible Creative Models Lookbook
            </h2>
          </div>

          <div
            className="inline-flex items-center gap-1 p-1 bg-[#0D0D0F] border border-zinc-800 rounded-lg overflow-x-auto max-w-full"
            role="tablist"
            aria-label="Filter Compatible Creative Models shoots by category"
          >
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setSelectedCategory(category);
                    setLightboxIndex(null);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                    active ? 'bg-zinc-100 text-[#050505]' : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  {category === 'All' ? 'All Works' : category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Gallery Grid */}
        {filteredShoots.length === 0 ? (
          <div className="py-16 text-center border border-zinc-800 rounded-2xl bg-[#0D0D0F]">
            <p className="font-display text-2xl text-zinc-200 mb-2">No shoots in this category yet</p>
            <p className="text-sm text-zinc-400">
              Add a new Compatible Creative Models look or switch categories to inspect the archive.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShoots.map((shoot, idx) => {
              const isFeature = shoot.aspectSpan === 'feature' && selectedCategory === 'All';
              return (
                <article
                  key={shoot.id}
                  className={`group relative rounded-2xl overflow-hidden border border-zinc-800/90 bg-[#0D0D0F] ${
                    isFeature ? 'md:col-span-2 aspect-[4/3] lg:aspect-[16/11]' : 'aspect-[4/5]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    className="w-full h-full text-left block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                  >
                    <ResilientImage
                      src={shoot.imageUrl}
                      alt={shoot.altText}
                      title={shoot.title}
                      className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />

                    {/* Measured Gradient Scrim for Guaranteed WCAG AA Contrast */}
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent">
                      <div className="flex items-center gap-2 text-xs text-zinc-300 mb-1.5">
                        <span>{shoot.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{shoot.publication}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{shoot.year}</span>
                      </div>
                      <h3 className="font-display text-xl lg:text-2xl text-zinc-100 leading-snug">
                        {shoot.title}
                      </h3>
                      <p className="mt-1 text-xs text-zinc-400">
                        {shoot.photographer} · {shoot.location}
                      </p>
                    </div>
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Editorial Lightbox */}
      {activeShoot && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 lg:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={activeShoot.title}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 z-10 w-10 h-10 inline-flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="max-w-[1160px] w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 relative flex items-center justify-center max-h-[80vh] rounded-2xl overflow-hidden border border-zinc-800 bg-[#0A0A0C]">
              <ResilientImage
                src={activeShoot.imageUrl}
                alt={activeShoot.altText}
                title={activeShoot.title}
                className="max-h-[78vh] w-auto object-contain"
              />
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
                  <span>{activeShoot.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeShoot.publication}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{activeShoot.year}</span>
                </div>
                <h3 className="font-display text-3xl text-zinc-100 leading-tight">
                  {activeShoot.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                  {activeShoot.caption}
                </p>
              </div>

              <div className="pt-5 border-t border-zinc-800 space-y-3 text-xs">
                <div className="flex justify-between gap-4">
                  <span className="text-zinc-500">Production</span>
                  <span className="text-zinc-200 text-right">{activeShoot.photographer}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-zinc-500">Location</span>
                  <span className="text-zinc-200 text-right">{activeShoot.location}</span>
                </div>
                {activeShoot.cameraNotes && (
                  <div className="flex justify-between gap-4">
                    <span className="text-zinc-500">Technical Notes</span>
                    <span className="font-mono text-zinc-300 text-right">{activeShoot.cameraNotes}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-800 gap-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxIndex(
                        (lightboxIndex - 1 + filteredShoots.length) % filteredShoots.length
                      )
                    }
                    className="w-10 h-10 inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-[#0D0D0F] text-zinc-300 hover:text-white"
                    aria-label="Previous shoot"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxIndex((lightboxIndex + 1) % filteredShoots.length)
                    }
                    className="w-10 h-10 inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-[#0D0D0F] text-zinc-300 hover:text-white"
                    aria-label="Next shoot"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <span className="font-mono text-xs text-zinc-500 tabular-nums">
                  {lightboxIndex + 1} / {filteredShoots.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
