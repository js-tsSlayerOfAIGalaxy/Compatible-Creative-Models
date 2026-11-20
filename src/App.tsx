import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  DEFAULT_ARTICLES,
  DEFAULT_BACKLINKS,
  DEFAULT_PROFILE,
  DEFAULT_SHOOTS,
  OTHER_WORK_LINKS,
} from './data/defaultPortfolio';
import { BookingModal } from './components/BookingModal';
import { CompCardSection } from './components/CompCardSection';
import { EditorialJournal } from './components/EditorialJournal';
import { Header, type ActiveView } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { LookbookGallery } from './components/LookbookGallery';
import { OtherWorkSection } from './components/OtherWorkSection';
import { SeoStudio } from './components/SeoStudio';
import type {
  BacklinkTarget,
  JournalArticle,
  ModelProfile,
  PortfolioShoot,
} from './types';
import { syncDocumentSeo } from './utils/seoSync';

const STORAGE_KEYS = {
  profile: 'sebastian_cc_profile_v7',
  shoots: 'sebastian_cc_shoots_v7',
  articles: 'sebastian_cc_articles_v7',
  backlinks: 'sebastian_cc_backlinks_v7',
};

function loadStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function parseLocationRoute(): { view: ActiveView; blogSlug: string | null } {
  if (typeof window === 'undefined') {
    return { view: 'portfolio', blogSlug: null };
  }
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const hash = window.location.hash;

  if (hash === '#studio') {
    return { view: 'studio', blogSlug: null };
  }
  if (pathname === '/blog') {
    return { view: 'blog', blogSlug: null };
  }
  if (pathname.startsWith('/blog/')) {
    const slug = decodeURIComponent(pathname.slice('/blog/'.length)).replace(/\/+$/, '');
    return { view: 'blog', blogSlug: slug || null };
  }
  if (hash === '#comp-card') {
    return { view: 'compcard', blogSlug: null };
  }
  if (hash === '#blog' || hash === '#journal') {
    return { view: 'blog', blogSlug: null };
  }
  if (hash.startsWith('#blog-')) {
    return { view: 'blog', blogSlug: hash.slice('#blog-'.length) || null };
  }
  if (hash.startsWith('#journal-')) {
    return { view: 'blog', blogSlug: hash.slice('#journal-'.length) || null };
  }
  return { view: 'portfolio', blogSlug: null };
}

export default function App() {
  const [profile, setProfile] = useState<ModelProfile>(() =>
    loadStored(STORAGE_KEYS.profile, DEFAULT_PROFILE)
  );
  const [shoots, setShoots] = useState<PortfolioShoot[]>(() =>
    loadStored(STORAGE_KEYS.shoots, DEFAULT_SHOOTS)
  );
  const [articles, setArticles] = useState<JournalArticle[]>(() =>
    loadStored(STORAGE_KEYS.articles, DEFAULT_ARTICLES)
  );
  const [backlinks, setBacklinks] = useState<BacklinkTarget[]>(() =>
    loadStored(STORAGE_KEYS.backlinks, DEFAULT_BACKLINKS)
  );

  const initialRoute = parseLocationRoute();
  const [activeView, setActiveView] = useState<ActiveView>(initialRoute.view);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(initialRoute.blogSlug);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    const syncFromLocation = () => {
      const next = parseLocationRoute();
      setActiveView(next.view);
      setSelectedBlogSlug(next.blogSlug);
    };
    window.addEventListener('popstate', syncFromLocation);
    window.addEventListener('hashchange', syncFromLocation);
    return () => {
      window.removeEventListener('popstate', syncFromLocation);
      window.removeEventListener('hashchange', syncFromLocation);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.shoots, JSON.stringify(shoots));
  }, [shoots]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.articles, JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.backlinks, JSON.stringify(backlinks));
  }, [backlinks]);

  useEffect(() => {
    const activeArticle =
      activeView === 'blog' && selectedBlogSlug
        ? articles.find((a) => a.slug === selectedBlogSlug) ?? null
        : null;
    const isBlogIndex = activeView === 'blog' && !selectedBlogSlug;
    syncDocumentSeo(profile, shoots, articles, activeArticle, isBlogIndex);
  }, [profile, shoots, articles, activeView, selectedBlogSlug]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((current) => (current === msg ? '' : current));
    }, 3200);
  };

  const navigateToPath = useCallback((path: string, view: ActiveView, blogSlug: string | null = null) => {
    setActiveView(view);
    setSelectedBlogSlug(blogSlug);
    if (typeof window !== 'undefined') {
      const currentFull = `${window.location.pathname}${window.location.hash}`;
      if (currentFull !== path) {
        window.history.pushState(null, '', path);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleNavigate = (view: ActiveView) => {
    if (view === 'blog') {
      navigateToPath('/blog', 'blog', null);
    } else if (view === 'compcard') {
      navigateToPath('/#comp-card', 'compcard', null);
    } else if (view === 'studio') {
      navigateToPath('/#studio', 'studio', null);
    } else {
      navigateToPath('/', 'portfolio', null);
    }
  };

  const handleOpenBlogArticle = (slug: string) => {
    navigateToPath(`/blog/${slug}`, 'blog', slug);
  };

  const handleResetAll = () => {
    setProfile(DEFAULT_PROFILE);
    setShoots(DEFAULT_SHOOTS);
    setArticles(DEFAULT_ARTICLES);
    setBacklinks(DEFAULT_BACKLINKS);
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    showToast('Restored default portfolio settings.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#F4F4F5]">
      <Header
        brandName={profile.agency}
        logoUrl={profile.logoUrl}
        activeView={activeView}
        onNavigate={handleNavigate}
        onOpenBooking={() => setBookingOpen(true)}
      />

      <main className="flex-1">
        {activeView === 'portfolio' && (
          <>
            <HeroSection
              profile={profile}
              onExploreLookbook={() => {
                document
                  .getElementById('lookbook-section')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenCompCard={() => handleNavigate('compcard')}
            />

            <LookbookGallery shoots={shoots} />

            <OtherWorkSection links={OTHER_WORK_LINKS} />

            <EditorialJournal
              articles={articles}
              shoots={shoots}
              modelName={profile.name}
              otherWorkLinks={OTHER_WORK_LINKS}
              onSelectArticleSlug={handleOpenBlogArticle}
              onOpenBlogIndex={() => handleNavigate('blog')}
              onOpenPortfolio={() => handleNavigate('portfolio')}
            />
          </>
        )}

        {activeView === 'blog' && (
          <EditorialJournal
            articles={articles}
            shoots={shoots}
            modelName={profile.name}
            otherWorkLinks={OTHER_WORK_LINKS}
            isFullPage
            selectedSlug={selectedBlogSlug}
            onSelectArticleSlug={handleOpenBlogArticle}
            onOpenBlogIndex={() => handleNavigate('blog')}
            onOpenPortfolio={() => handleNavigate('portfolio')}
          />
        )}

        {activeView === 'compcard' && (
          <CompCardSection
            profile={profile}
            shoots={shoots}
            backlinks={backlinks}
            onOpenBooking={() => setBookingOpen(true)}
          />
        )}

        {activeView === 'studio' && (
          <SeoStudio
            profile={profile}
            shoots={shoots}
            articles={articles}
            backlinks={backlinks}
            onUpdateProfile={setProfile}
            onUpdateShoot={(updated) =>
              setShoots((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
            }
            onAddShoot={(created) => setShoots((prev) => [created, ...prev])}
            onPublishArticle={(article) => {
              setArticles((prev) => [article, ...prev]);
              handleOpenBlogArticle(article.slug);
            }}
            onAddBacklink={(target) => setBacklinks((prev) => [target, ...prev])}
            onUpdateBacklinkStatus={(id, status, securedUrl) =>
              setBacklinks((prev) =>
                prev.map((item) =>
                  item.id === id
                    ? { ...item, status, securedBacklinkUrl: securedUrl }
                    : item
                )
              )
            }
            onDeleteBacklink={(id) =>
              setBacklinks((prev) => prev.filter((item) => item.id !== id))
            }
            onResetAll={handleResetAll}
            onNotify={showToast}
          />
        )}
      </main>

      <footer className="border-t border-zinc-900 bg-[#050505] py-10 print:hidden">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-zinc-500">
          <div className="flex items-center gap-3.5">
            {profile.logoUrl && (
              <img
                src={profile.logoUrl}
                alt={`${profile.agency} logo`}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-lg object-contain bg-black border border-zinc-800 p-1 shrink-0"
              />
            )}
            <div className="space-y-1">
              <p className="text-zinc-300 font-medium">
                {profile.agency} · Markiewicz Creative Models · {profile.name}
              </p>
              <p>
                {profile.location} · {profile.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('portfolio');
              }}
              className="hover:text-zinc-200 transition-colors"
            >
              Portfolio
            </a>
            <a
              href="/blog"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('blog');
              }}
              className="hover:text-zinc-200 transition-colors"
            >
              Blog
            </a>
            <a
              href="/#comp-card"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('compcard');
              }}
              className="hover:text-zinc-200 transition-colors"
            >
              Comp Card
            </a>
            <a
              href="https://www.compatiblecreative.co.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-200 transition-colors"
            >
              Compatible Creative UK
            </a>
            <a
              href="https://www.compatiblecreative.co.uk/albums/compatible-music/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-200 transition-colors"
            >
              Compatible Music
            </a>
            <a
              href="https://www.beatport.com/artist/sebastian-markiewicz/311129"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-200 transition-colors"
            >
              Beatport
            </a>
            <a
              href="https://soundcloud.com/sebastianmarkiewicz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-200 transition-colors"
            >
              SoundCloud
            </a>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className="hover:text-zinc-200 transition-colors"
            >
              sitemap.xml
            </a>
            <button
              type="button"
              onClick={() => setBookingOpen(true)}
              className="text-zinc-200 hover:text-[#D4AF37] transition-colors"
            >
              Direct Booking
            </button>
          </div>
        </div>
      </footer>

      <BookingModal
        isOpen={bookingOpen}
        modelName={profile.name}
        agencyName={profile.agency}
        bookingEmail={profile.email}
        onClose={() => setBookingOpen(false)}
      />

      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border border-zinc-700 bg-[#0D0D0F] text-xs text-zinc-100 shadow-2xl"
        >
          <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
