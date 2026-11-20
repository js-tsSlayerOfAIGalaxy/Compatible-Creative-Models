import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  DEFAULT_ARTICLES,
  DEFAULT_BACKLINKS,
  DEFAULT_PROFILE,
  DEFAULT_SHOOTS,
} from './data/defaultPortfolio';
import { BookingModal } from './components/BookingModal';
import { CompCardSection } from './components/CompCardSection';
import { EditorialJournal } from './components/EditorialJournal';
import { Header, type ActiveView } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { LookbookGallery } from './components/LookbookGallery';
import { SeoStudio } from './components/SeoStudio';
import type {
  JournalArticle,
  ModelProfile,
  PortfolioShoot,
  BacklinkTarget,
} from './types';
import { syncDocumentSeo } from './utils/seoSync';

const STORAGE_KEYS = {
  profile: 'sebastian_cc_profile_v5',
  shoots: 'sebastian_cc_shoots_v5',
  articles: 'sebastian_cc_articles_v5',
  backlinks: 'sebastian_cc_backlinks_v5',
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

  const [activeView, setActiveView] = useState<ActiveView>(() => {
    if (typeof window === 'undefined') return 'portfolio';
    const h = window.location.hash;
    if (h === '#studio') return 'studio';
    if (h === '#comp-card') return 'compcard';
    if (h === '#journal' || h.startsWith('#journal-')) return 'journal';
    return 'portfolio';
  });
  const [bookingOpen, setBookingOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    const onHashChange = () => {
      const h = window.location.hash;
      if (h === '#studio') {
        setActiveView('studio');
      } else if (h === '#comp-card') {
        setActiveView('compcard');
      } else if (h === '#journal' || h.startsWith('#journal-')) {
        setActiveView('journal');
      } else if (activeView === 'studio') {
        setActiveView('portfolio');
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [activeView]);

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
    syncDocumentSeo(profile, shoots, articles);
  }, [profile, shoots, articles]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((current) => (current === msg ? '' : current));
    }, 3200);
  };

  const handleNavigate = (view: ActiveView) => {
    setActiveView(view);
    if (window.location.hash === '#studio' && view !== 'studio') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

            <EditorialJournal
              articles={articles}
              shoots={shoots}
              modelName={profile.name}
            />
          </>
        )}

        {activeView === 'journal' && (
          <EditorialJournal
            articles={articles}
            shoots={shoots}
            modelName={profile.name}
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
              handleNavigate('journal');
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

          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => handleNavigate('portfolio')}
              className="hover:text-zinc-200 transition-colors"
            >
              Portfolio
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('journal')}
              className="hover:text-zinc-200 transition-colors"
            >
              Journal
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('compcard')}
              className="hover:text-zinc-200 transition-colors"
            >
              Comp Card
            </button>
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
