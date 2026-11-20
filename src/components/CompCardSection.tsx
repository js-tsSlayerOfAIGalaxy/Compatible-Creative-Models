import { useState } from 'react';
import { Check, Copy, ExternalLink, Printer } from 'lucide-react';
import type { BacklinkTarget, ModelProfile, PortfolioShoot } from '../types';
import { ResilientImage } from './ResilientImage';

interface CompCardSectionProps {
  profile: ModelProfile;
  shoots: PortfolioShoot[];
  backlinks: BacklinkTarget[];
  onOpenBooking: () => void;
}

export function CompCardSection({
  profile,
  shoots,
  backlinks,
  onOpenBooking,
}: CompCardSectionProps) {
  const [copiedSpecs, setCopiedSpecs] = useState(false);

  const secondaryFrames = shoots.filter((s) => s.imageUrl !== profile.heroImage).slice(0, 3);

  const handleCopyCompCard = async () => {
    const summary = [
      `${profile.name} — ${profile.agency}`,
      `Representation: ${profile.agency} (${profile.location})`,
      `Booking: ${profile.email}`,
      `Height: ${profile.measurements.height}`,
      `Chest: ${profile.measurements.bust} | Waist: ${profile.measurements.waist} | Hip: ${profile.measurements.hips}`,
      `Shoe: ${profile.measurements.shoe} | Hair: ${profile.measurements.hair} | Eyes: ${profile.measurements.eyes}`,
    ].join('\n');

    await navigator.clipboard.writeText(summary);
    setCopiedSpecs(true);
    setTimeout(() => setCopiedSpecs(false), 2000);
  };

  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 space-y-14">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800 pb-8">
          <div className="flex items-center gap-4">
            {profile.logoUrl && (
              <img
                src={profile.logoUrl.endsWith('.png') && profile.logoUrl.startsWith('/assets/aistudio/') ? profile.logoUrl.replace(/\.png$/, '.webp') : profile.logoUrl}
                alt={`${profile.agency} logo`}
                width={48}
                height={48}
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-contain bg-black border border-zinc-800 p-1 shrink-0"
              />
            )}
            <div>
              <p className="text-xs text-zinc-500 mb-1">
                {profile.agency} · {profile.location}
              </p>
              <h1 className="font-display text-4xl lg:text-5xl font-normal text-zinc-100 tracking-tight">
                Compatible Creative Comp Card
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 print:hidden">
            <button
              type="button"
              onClick={handleCopyCompCard}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-zinc-200 bg-[#0D0D0F] border border-zinc-800 rounded-lg hover:border-zinc-600 transition-colors whitespace-nowrap"
            >
              {copiedSpecs ? <Check className="w-3.5 h-3.5 text-[#D4AF37]" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSpecs ? 'Copied Specs' : 'Copy Spec Sheet'}
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-zinc-200 bg-[#0D0D0F] border border-zinc-800 rounded-lg hover:border-zinc-600 transition-colors whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>

            <button
              type="button"
              onClick={onOpenBooking}
              className="inline-flex items-center px-5 py-2 text-xs font-semibold bg-zinc-100 text-[#050505] rounded-lg hover:bg-white transition-colors whitespace-nowrap"
            >
              Request Availability
            </button>
          </div>
        </div>

        {/* Classic 2-Column Editorial Comp Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-zinc-800 bg-[#0D0D0F] aspect-[3/4]">
            <ResilientImage
              src={profile.heroImage}
              alt={`${profile.name} — ${profile.agency} comp card front portrait`}
              title={profile.name}
              priority
              sizes="(max-width: 1023px) 100vw, 42vw"
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {secondaryFrames.map((frame) => (
                <div
                  key={frame.id}
                  className="rounded-xl overflow-hidden border border-zinc-800 bg-[#0D0D0F] aspect-[4/5]"
                >
                  <ResilientImage
                    src={frame.imageUrl}
                    alt={frame.altText}
                    title={frame.title}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-[#0D0D0F] p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-5 border-b border-zinc-800">
                <div>
                  <h2 className="font-display text-3xl text-zinc-100">{profile.name}</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">{profile.agency}</p>
                </div>
                <span className="font-mono text-xs text-zinc-400">{profile.email}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-5 gap-x-6 pt-5">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Height</p>
                  <p className="font-mono text-sm text-zinc-100 tabular-nums">{profile.measurements.height}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Chest</p>
                  <p className="font-mono text-sm text-zinc-100 tabular-nums">{profile.measurements.bust}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Waist</p>
                  <p className="font-mono text-sm text-zinc-100 tabular-nums">{profile.measurements.waist}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Hip</p>
                  <p className="font-mono text-sm text-zinc-100 tabular-nums">{profile.measurements.hips}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Shoe</p>
                  <p className="font-mono text-sm text-zinc-100 tabular-nums">{profile.measurements.shoe}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Hair</p>
                  <p className="font-mono text-sm text-zinc-100">{profile.measurements.hair}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Eyes</p>
                  <p className="font-mono text-sm text-zinc-100">{profile.measurements.eyes}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Markets</p>
                  <p className="font-mono text-sm text-zinc-100">LDN · WAW · NYC</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Press & Editorial Backlink Citations */}
        <div className="pt-4">
          <div className="mb-6">
            <p className="text-xs text-zinc-500 mb-1">
              {profile.agency} · Verified Industry Index &amp; Press
            </p>
            <h2 className="font-display text-2xl lg:text-3xl text-zinc-100">
              Compatible Creative Credits &amp; Authority Links
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-[#0D0D0F]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-xs text-zinc-500">
                  <th className="py-3.5 px-5 font-medium">Publication / Directory</th>
                  <th className="py-3.5 px-5 font-medium">Editorial Focus</th>
                  <th className="py-3.5 px-5 font-medium">Backlink Status</th>
                  <th className="py-3.5 px-5 font-medium text-right">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70 text-sm">
                {backlinks.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-4 px-5 font-medium text-zinc-100">{item.publicationName}</td>
                    <td className="py-4 px-5 text-zinc-400">{item.domainFocus}</td>
                    <td className="py-4 px-5 font-mono text-xs">
                      <span
                        className={
                          item.status === 'Secured'
                            ? 'text-[#D4AF37]'
                            : item.status === 'Sent'
                            ? 'text-zinc-200'
                            : 'text-zinc-500'
                        }
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      {item.securedBacklinkUrl || item.targetUrl ? (
                        <a
                          href={item.securedBacklinkUrl || item.targetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-zinc-300 hover:text-[#D4AF37] transition-colors"
                        >
                          Visit
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-zinc-600">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
