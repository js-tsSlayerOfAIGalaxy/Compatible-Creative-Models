import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export type ActiveView = 'portfolio' | 'blog' | 'compcard' | 'studio';

interface HeaderProps {
  brandName: string;
  logoUrl?: string;
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onOpenBooking: () => void;
}

const NAV_ITEMS: { id: ActiveView; label: string; href: string }[] = [
  { id: 'portfolio', label: 'Portfolio', href: '/' },
  { id: 'blog', label: 'Blog', href: '/blog' },
  { id: 'compcard', label: 'Comp Card', href: '/#comp-card' },
];

export function Header({
  brandName,
  logoUrl,
  activeView,
  onNavigate,
  onOpenBooking,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (view: ActiveView) => {
    onNavigate(view);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#050505]/92 backdrop-blur-md border-b border-zinc-800/80 print:hidden">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark + Compatible Creative Emblem */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleSelect('portfolio');
          }}
          className="inline-flex items-center gap-3 font-display text-2xl font-semibold tracking-tight text-zinc-100 whitespace-nowrap shrink-0 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
        >
          {logoUrl && (
            <img
              src={logoUrl}
              alt={`${brandName} logo`}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-md object-contain bg-black shrink-0"
            />
          )}
          <span>{brandName}</span>
        </a>

        {/* Zone 2: Clean Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Primary Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelect(item.id);
                }}
                className={`relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                  isActive ? 'text-zinc-100' : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {item.label}
                <span
                  className={`absolute left-0 right-0 -bottom-0.5 h-px transition-opacity duration-200 ${
                    isActive ? 'bg-[#D4AF37] opacity-100' : 'opacity-0'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action + Mobile Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenBooking}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2 text-xs font-semibold tracking-wide bg-zinc-100 text-[#050505] rounded-lg hover:bg-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          >
            Book Talent
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 text-zinc-300 hover:text-white border border-zinc-800 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-[#0A0A0C] px-6 py-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleSelect(item.id);
              }}
              className={`block w-full text-left py-2.5 text-sm font-medium transition-colors ${
                activeView === item.id ? 'text-[#D4AF37]' : 'text-zinc-300 hover:text-white'
              }`}
            >
              {item.label}
            </a>
          ))}
          <div className="pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenBooking();
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold bg-zinc-100 text-[#050505] rounded-lg"
            >
              Book Talent
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
