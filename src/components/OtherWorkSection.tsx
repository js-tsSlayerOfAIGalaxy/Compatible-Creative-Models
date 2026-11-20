import { ArrowUpRight, Disc3, Globe, Headphones, Music2 } from 'lucide-react';
import type { ExternalWorkLink } from '../types';

interface OtherWorkSectionProps {
  links: ExternalWorkLink[];
  compact?: boolean;
}

function getWorkIcon(category: ExternalWorkLink['category']) {
  switch (category) {
    case 'Studio & Direction':
      return Globe;
    case 'Album Release':
      return Disc3;
    case 'Streaming & Catalog':
      return Music2;
    case 'Audio Archive':
      return Headphones;
  }
}

export function OtherWorkSection({ links, compact = false }: OtherWorkSectionProps) {
  return (
    <section
      id="other-work"
      className={compact ? 'py-10 border-t border-zinc-800/80' : 'py-14 lg:py-20 border-t border-zinc-900'}
    >
      <div className={compact ? '' : 'max-w-[1280px] mx-auto px-6 lg:px-10'}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs text-zinc-500 mb-2">
              Compatible Creative · Compatible Music · Sebastian Markiewicz
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-normal text-zinc-100 tracking-tight">
              Other Work &amp; Audio Catalog
            </h2>
          </div>
          <p className="text-xs text-zinc-400 max-w-md leading-relaxed">
            Explore Sebastian Markiewicz&apos;s multidisciplinary creative studio, Compatible Music albums, and verified music releases across the web.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {links.map((item) => {
            const Icon = getWorkIcon(item.category);
            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between rounded-2xl border border-zinc-800/90 bg-[#0D0D0F] p-6 lg:p-7 hover:border-[#D4AF37]/60 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-lg border border-zinc-800 bg-black/60 inline-flex items-center justify-center text-[#D4AF37] shrink-0">
                        <Icon className="w-4 h-4" />
                      </span>
                      <div>
                        <p className="text-xs text-[#D4AF37]">{item.category}</p>
                        <p className="text-xs text-zinc-500">{item.subtitle}</p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-[#D4AF37] transition-colors shrink-0" />
                  </div>

                  <div>
                    <h3 className="font-display text-2xl text-zinc-100 group-hover:text-white transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-zinc-500 truncate">
                    {item.domain}
                  </span>
                  <span className="text-xs font-medium text-zinc-200 group-hover:text-[#D4AF37] transition-colors whitespace-nowrap">
                    Visit Site
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
