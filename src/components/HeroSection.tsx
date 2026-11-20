import { ArrowDownRight } from 'lucide-react';
import type { ModelProfile } from '../types';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  profile: ModelProfile;
  onExploreLookbook: () => void;
  onOpenCompCard: () => void;
}

export function HeroSection({
  profile,
  onExploreLookbook,
  onOpenCompCard,
}: HeroSectionProps) {
  return (
    <section className="pt-10 pb-14 lg:pt-14 lg:pb-20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        {/* Split-Screen Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Left Typographic Hierarchy */}
          <div className="lg:col-span-6 flex flex-col justify-between py-2">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2.5 text-xs tracking-wide text-zinc-400">
                <span className="text-[#D4AF37] font-medium">{profile.agency}</span>
                <span aria-hidden="true">·</span>
                <span>Markiewicz Creative Models</span>
                <span aria-hidden="true">·</span>
                <span>{profile.location}</span>
              </div>

              <h1
                className="font-display font-normal text-zinc-100 leading-[1.03] tracking-tight"
                style={{ fontSize: 'clamp(2.75rem, 4.75vw, 4.5rem)' }}
              >
                {profile.heroHeadline}
              </h1>

              <p className="text-base leading-relaxed text-zinc-400 max-w-xl">
                {profile.bio}
              </p>
            </div>

            <div className="pt-10 flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={onExploreLookbook}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-zinc-100 text-[#050505] rounded-lg hover:bg-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                Explore Lookbook
                <ArrowDownRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenCompCard}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-300 hover:text-white border-b border-zinc-700 hover:border-[#D4AF37] pb-0.5 transition-colors whitespace-nowrap shrink-0"
              >
                Digital Comp Card
              </button>
            </div>
          </div>

          {/* Right Matching-Height Editorial Portrait */}
          <div className="lg:col-span-6">
            <div className="relative h-full min-h-[420px] lg:min-h-[560px] rounded-2xl overflow-hidden border border-zinc-800/90 bg-[#0D0D0F]">
              <ResilientImage
                src={profile.heroImage}
                alt={`${profile.name} — ${profile.tagline} portrait`}
                title={profile.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex items-end justify-between gap-4">
                <div>
                  <p className="font-display text-xl text-zinc-100">{profile.name}</p>
                  <p className="text-xs text-zinc-300">{profile.tagline}</p>
                </div>
                <span className="font-mono text-xs text-zinc-300 tabular-nums whitespace-nowrap">
                  {profile.measurements.height}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 5-Column Measurements & Reach Strip Below Hero Split */}
        <div className="mt-10 pt-8 border-t border-zinc-800/90 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          <div>
            <p className="text-xs text-zinc-500 mb-1">Height</p>
            <p className="font-mono text-sm text-zinc-100 tabular-nums">{profile.measurements.height}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Chest / Waist / Hip</p>
            <p className="font-mono text-sm text-zinc-100 tabular-nums">
              {profile.measurements.bust.split('/')[0].trim()} · {profile.measurements.waist.split('/')[0].trim()} · {profile.measurements.hips.split('/')[0].trim()}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Shoe</p>
            <p className="font-mono text-sm text-zinc-100 tabular-nums">{profile.measurements.shoe}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Hair / Eyes</p>
            <p className="font-mono text-sm text-zinc-100">
              {profile.measurements.hair} · {profile.measurements.eyes}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs text-zinc-500 mb-1">Representation</p>
            <p className="font-mono text-sm text-[#D4AF37] tabular-nums">{profile.campaignCount}</p>
          </div>
        </div>
      </div>

      {/* Subtle Editorial Marquee Divider */}
      <div className="mt-14 border-y border-zinc-900 bg-[#08080A] py-3 overflow-hidden">
        <div className="animate-marquee text-xs tracking-widest text-zinc-500 select-none">
          <span className="mx-6">Sebastian Markiewicz</span>
          <span aria-hidden="true">·</span>
          <span className="mx-6">Compatible Creative</span>
          <span aria-hidden="true">·</span>
          <span className="mx-6">Markiewicz Creative Models</span>
          <span aria-hidden="true">·</span>
          <span className="mx-6">Catwalk &amp; Runway Presentations</span>
          <span aria-hidden="true">·</span>
          <span className="mx-6">Athletic &amp; Lifestyle Campaigns</span>
          <span aria-hidden="true">·</span>
          <span className="mx-6">Sebastian Markiewicz</span>
          <span aria-hidden="true">·</span>
          <span className="mx-6">Compatible Creative</span>
          <span aria-hidden="true">·</span>
          <span className="mx-6">Markiewicz Creative Models</span>
          <span aria-hidden="true">·</span>
          <span className="mx-6">Catwalk &amp; Runway Presentations</span>
          <span aria-hidden="true">·</span>
          <span className="mx-6">Athletic &amp; Lifestyle Campaigns</span>
          <span aria-hidden="true">·</span>
        </div>
      </div>
    </section>
  );
}
