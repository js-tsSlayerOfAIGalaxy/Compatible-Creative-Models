import { useEffect, useState } from 'react';
import {
  BookOpen,
  Check,
  Code2,
  Copy,
  ExternalLink,
  ImagePlus,
  Link2,
  Loader2,
  SearchCheck,
  Sparkles,
  Trash2,
} from 'lucide-react';
import type {
  BacklinkStatus,
  BacklinkTarget,
  JournalArticle,
  ModelProfile,
  PortfolioShoot,
  SeoAuditFinding,
  SeoAuditResult,
  ShootCategory,
} from '../types';
import { buildJsonLdPayload, generateSitemapXml } from '../utils/seoSync';
import { ResilientImage } from './ResilientImage';

export type StudioTab = 'audit' | 'shoots' | 'outreach' | 'editorial';

interface SeoStudioProps {
  profile: ModelProfile;
  shoots: PortfolioShoot[];
  articles: JournalArticle[];
  backlinks: BacklinkTarget[];
  initialTab?: StudioTab;
  focusedShootId?: string | null;
  onUpdateProfile: (next: ModelProfile) => void;
  onUpdateShoot: (shoot: PortfolioShoot) => void;
  onAddShoot: (shoot: PortfolioShoot) => void;
  onPublishArticle: (article: JournalArticle) => void;
  onAddBacklink: (target: BacklinkTarget) => void;
  onUpdateBacklinkStatus: (id: string, status: BacklinkStatus, securedUrl?: string) => void;
  onDeleteBacklink: (id: string) => void;
  onResetAll: () => void;
  onNotify: (message: string) => void;
}

const STUDIO_TABS: { id: StudioTab; label: string }[] = [
  { id: 'audit', label: 'SEO Audit & Meta' },
  { id: 'shoots', label: 'Shoots & Alt-Text' },
  { id: 'outreach', label: 'Backlink Outreach' },
  { id: 'editorial', label: 'Editorial Story AI' },
];

export function SeoStudio({
  profile,
  shoots,
  articles,
  backlinks,
  initialTab = 'audit',
  focusedShootId = null,
  onUpdateProfile,
  onUpdateShoot,
  onAddShoot,
  onPublishArticle,
  onAddBacklink,
  onUpdateBacklinkStatus,
  onDeleteBacklink,
  onResetAll,
  onNotify,
}: SeoStudioProps) {
  const [activeTab, setActiveTab] = useState<StudioTab>(initialTab);
  const [errorMsg, setErrorMsg] = useState('');

  // Tab 1: SEO Audit & Profile state
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<SeoAuditResult | null>(null);
  const [appliedFindingIds, setAppliedFindingIds] = useState<string[]>([]);
  const [keywordsInput, setKeywordsInput] = useState(profile.targetKeywords.join(', '));
  const [sameAsInput, setSameAsInput] = useState(profile.sameAs.join('\n'));
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedSitemap, setCopiedSitemap] = useState(false);

  // Tab 2: Shoots & Alt-Text Optimizer state
  const [selectedShootId, setSelectedShootId] = useState<string>(
    focusedShootId || shoots[0]?.id || ''
  );
  const [optimizingShoot, setOptimizingShoot] = useState(false);
  const [uploadedBase64, setUploadedBase64] = useState<string | null>(null);
  const [uploadedMime, setUploadedMime] = useState<string | null>(null);
  const [newShootOpen, setNewShootOpen] = useState(false);
  const [newShootTitle, setNewShootTitle] = useState('');
  const [newShootCategory, setNewShootCategory] = useState<ShootCategory>('Campaign');
  const [newShootPub, setNewShootPub] = useState('');
  const [newShootPhotographer, setNewShootPhotographer] = useState('');
  const [newShootLocation, setNewShootLocation] = useState('London');
  const [newShootImage, setNewShootImage] = useState('');

  // Tab 3: Backlink Outreach state
  const [targetCategory, setTargetCategory] = useState('Editorial Magazine Feature');
  const [customTarget, setCustomTarget] = useState('');
  const [outreachShootId, setOutreachShootId] = useState(shoots[0]?.id || '');
  const [generatingPitch, setGeneratingPitch] = useState(false);
  const [draftPitch, setDraftPitch] = useState<BacklinkTarget | null>(null);
  const [copiedPitchId, setCopiedPitchId] = useState<string | null>(null);

  // Tab 4: Editorial Story Generator state
  const [storyTopic, setStoryTopic] = useState(
    'Blending Athletic Commercial Presence with Graphic Direction at Compatible Creative'
  );
  const [storyKeyword, setStoryKeyword] = useState(
    profile.targetKeywords[0] || 'Compatible Creative'
  );
  const [storyTone, setStoryTone] = useState('Refined Compatible Creative editorial essay');
  const [selectedLinkedShoots, setSelectedLinkedShoots] = useState<string[]>(
    shoots.slice(0, 2).map((s) => s.id)
  );
  const [generatingStory, setGeneratingStory] = useState(false);
  const [draftArticle, setDraftArticle] = useState<JournalArticle | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (focusedShootId) {
      setSelectedShootId(focusedShootId);
    }
  }, [focusedShootId]);

  useEffect(() => {
    setKeywordsInput(profile.targetKeywords.join(', '));
    setSameAsInput(profile.sameAs.join('\n'));
  }, [profile.targetKeywords, profile.sameAs]);

  const selectedShoot = shoots.find((s) => s.id === selectedShootId) || shoots[0];

  // Grounded live metrics (zero arbitrary scores)
  const richAltCount = shoots.filter((s) => s.altText.trim().length >= 75).length;
  const titleLength = profile.seoTitle.trim().length;
  const metaLength = profile.seoDescription.trim().length;
  const securedBacklinkCount = backlinks.filter((b) => b.status === 'Secured').length;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://portfolio.local';
  const liveJsonLd = JSON.stringify(buildJsonLdPayload(profile, shoots, articles, origin), null, 2);
  const liveSitemap = generateSitemapXml(origin, articles);

  const handleRunAudit = async () => {
    setErrorMsg('');
    setAuditLoading(true);
    try {
      const res = await fetch('/api/seo/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, shoots, articles }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to run SEO audit.');
      setAuditResult(data);
      setAppliedFindingIds([]);
      onNotify('AI SEO audit completed with live recommendations.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to reach SEO audit API.');
    } finally {
      setAuditLoading(false);
    }
  };

  const handleApplyFinding = (finding: SeoAuditFinding) => {
    if (finding.actionType === 'update_title' && finding.suggestedValue) {
      onUpdateProfile({ ...profile, seoTitle: finding.suggestedValue });
      setAppliedFindingIds((prev) => [...prev, finding.id]);
      onNotify('Updated live page <title> and OpenGraph title.');
      return;
    }
    if (finding.actionType === 'update_description' && finding.suggestedValue) {
      onUpdateProfile({ ...profile, seoDescription: finding.suggestedValue });
      setAppliedFindingIds((prev) => [...prev, finding.id]);
      onNotify('Updated live meta description and Schema.org summary.');
      return;
    }
    if (finding.actionType === 'update_shoot_alt' && finding.targetId && finding.suggestedValue) {
      const target = shoots.find((s) => s.id === finding.targetId);
      if (target) {
        onUpdateShoot({ ...target, altText: finding.suggestedValue });
        setAppliedFindingIds((prev) => [...prev, finding.id]);
        onNotify(`Updated alt-text for "${target.title}".`);
      }
      return;
    }
    if (finding.actionType === 'add_keywords' && auditResult?.recommendedKeywords?.length) {
      const merged = Array.from(
        new Set([...profile.targetKeywords, ...auditResult.recommendedKeywords])
      );
      onUpdateProfile({ ...profile, targetKeywords: merged });
      setAppliedFindingIds((prev) => [...prev, finding.id]);
      onNotify('Merged recommended keywords into live Schema.org profile.');
    }
  };

  const handleApplyOptimizedMeta = () => {
    if (!auditResult) return;
    onUpdateProfile({
      ...profile,
      seoTitle: auditResult.optimizedTitle || profile.seoTitle,
      seoDescription: auditResult.optimizedMetaDescription || profile.seoDescription,
      targetKeywords:
        auditResult.recommendedKeywords?.length > 0
          ? auditResult.recommendedKeywords
          : profile.targetKeywords,
    });
    onNotify('Applied AI-optimized title, meta description, and keywords to live DOM.');
  };

  const handleSaveProfileChanges = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedKeywords = keywordsInput
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    const parsedSameAs = sameAsInput
      .split('\n')
      .map((u) => u.trim())
      .filter(Boolean);

    onUpdateProfile({
      ...profile,
      targetKeywords: parsedKeywords,
      sameAs: parsedSameAs,
    });
    onNotify('Portfolio identity, measurements, and JSON-LD schema saved.');
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    mode: 'existing' | 'new'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const base64 = result.split(',')[1] || '';
      setUploadedBase64(base64);
      setUploadedMime(file.type || 'image/jpeg');
      if (mode === 'new') {
        setNewShootImage(result);
      } else if (selectedShoot) {
        onUpdateShoot({ ...selectedShoot, imageUrl: result });
        onNotify('Updated shoot photograph locally.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOptimizeShoot = async () => {
    if (!selectedShoot) return;
    setErrorMsg('');
    setOptimizingShoot(true);
    try {
      const res = await fetch('/api/seo/optimize-shoot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelName: profile.name,
          shoot: selectedShoot,
          imageBase64: uploadedBase64,
          imageMimeType: uploadedMime,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to optimize shoot.');

      onUpdateShoot({
        ...selectedShoot,
        altText: data.altText || selectedShoot.altText,
        caption: data.caption || selectedShoot.caption,
        seoKeywords: Array.isArray(data.seoKeywords)
          ? data.seoKeywords
          : selectedShoot.seoKeywords,
      });
      onNotify(`Optimized alt-text & ImageObject schema for "${selectedShoot.title}".`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to optimize shoot.');
    } finally {
      setOptimizingShoot(false);
    }
  };

  const handleCreateShoot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShootTitle.trim() || !newShootImage.trim()) {
      setErrorMsg('Provide both a shoot title and an uploaded image or image path.');
      return;
    }
    setErrorMsg('');
    const created: PortfolioShoot = {
      id: `shoot-${Date.now()}`,
      title: newShootTitle.trim(),
      category: newShootCategory,
      year: String(new Date().getFullYear()),
      publication: newShootPub.trim() || 'Independent Editorial',
      photographer: newShootPhotographer.trim() || 'Studio Team',
      location: newShootLocation.trim() || 'Paris',
      imageUrl: newShootImage.trim(),
      aspectSpan: 'standard',
      altText: `${profile.name} ${newShootCategory.toLowerCase()} editorial photograph — ${newShootTitle.trim()}`,
      caption: `${newShootTitle.trim()} photographed in ${newShootLocation.trim() || 'Paris'}.`,
      seoKeywords: [profile.name, `${newShootCategory} model`, newShootLocation.trim() || 'Paris'],
    };
    onAddShoot(created);
    setSelectedShootId(created.id);
    setNewShootOpen(false);
    setNewShootTitle('');
    setNewShootPub('');
    setNewShootPhotographer('');
    setNewShootImage('');
    onNotify('Added new shoot to Lookbook & Schema.org ImageGallery.');
  };

  const handleGeneratePitch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setGeneratingPitch(true);
    try {
      const featuredShoot = shoots.find((s) => s.id === outreachShootId) || shoots[0];
      const res = await fetch('/api/outreach/pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          targetCategory,
          customTarget,
          featuredShoot,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate backlink pitch.');

      setDraftPitch({
        id: `bl-${Date.now()}`,
        publicationName: data.publicationName,
        targetUrl: data.targetUrl || '',
        domainFocus: data.domainFocus,
        pitchAngle: data.pitchAngle,
        emailSubject: data.emailSubject,
        emailBody: data.emailBody,
        status: 'Drafted',
        createdAt: new Date().toISOString().split('T')[0],
        sources: data.sources || [],
      });
      onNotify('Drafted search-grounded backlink outreach pitch.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to draft backlink pitch.');
    } finally {
      setGeneratingPitch(false);
    }
  };

  const handleGenerateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyTopic.trim() || !storyKeyword.trim()) {
      setErrorMsg('Enter an editorial topic and target SEO keyword.');
      return;
    }
    setErrorMsg('');
    setGeneratingStory(true);
    try {
      const linked = shoots.filter((s) => selectedLinkedShoots.includes(s.id));
      const res = await fetch('/api/editorial/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          topic: storyTopic,
          targetKeyword: storyKeyword,
          tone: storyTone,
          linkedShoots: linked,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate editorial story.');

      setDraftArticle({
        id: `article-${Date.now()}`,
        slug: data.slug || `editorial-${Date.now()}`,
        title: data.title,
        metaDescription: data.metaDescription,
        targetKeyword: storyKeyword,
        publishedAt: new Date().toISOString().split('T')[0],
        readTime: data.readTime || '4 min read',
        excerpt: data.excerpt,
        sections: Array.isArray(data.sections) ? data.sections : [],
        linkedShootIds: selectedLinkedShoots,
      });
      onNotify('Generated search-optimized lookbook essay preview.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to generate editorial article.');
    } finally {
      setGeneratingStory(false);
    }
  };

  return (
    <section className="py-10 lg:py-14">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 space-y-8">
        {/* Studio Header & Grounded Diagnostics Strip */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-zinc-800 pb-8">
          <div>
            <p className="text-xs text-zinc-500 mb-2">
              {profile.agency} Visibility Engine · Gemini 4 Hydrogen · Live DOM Meta &amp; JSON-LD
            </p>
            <h1 className="font-display text-4xl lg:text-5xl font-normal text-zinc-100 tracking-tight">
              Compatible Creative SEO &amp; Backlink Studio
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onResetAll}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-100 border border-zinc-800 rounded-lg transition-colors whitespace-nowrap"
            >
              Reset Defaults
            </button>
          </div>
        </div>

        {/* Grounded Real SEO Health Indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-zinc-800 bg-[#0D0D0F] p-5">
            <p className="text-xs text-zinc-500 mb-1.5">Image Alt-Text Coverage</p>
            <p className="font-mono text-2xl text-zinc-100 tabular-nums">
              {richAltCount} / {shoots.length}
            </p>
            <p className="text-xs text-zinc-400 mt-1">Shoots with ≥ 75-char descriptions</p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-[#0D0D0F] p-5">
            <p className="text-xs text-zinc-500 mb-1.5">Title &amp; Meta Length</p>
            <p className="font-mono text-2xl text-zinc-100 tabular-nums">
              {titleLength} / {metaLength}
            </p>
            <p className="text-xs text-zinc-400 mt-1">Target: 30–60 title · 120–160 meta</p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-[#0D0D0F] p-5">
            <p className="text-xs text-zinc-500 mb-1.5">Indexed Journal Essays</p>
            <p className="font-mono text-2xl text-zinc-100 tabular-nums">{articles.length}</p>
            <p className="text-xs text-zinc-400 mt-1">Active Schema.org Article nodes</p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-[#0D0D0F] p-5">
            <p className="text-xs text-zinc-500 mb-1.5">Backlink Pipeline</p>
            <p className="font-mono text-2xl text-[#D4AF37] tabular-nums">
              {securedBacklinkCount} / {backlinks.length}
            </p>
            <p className="text-xs text-zinc-400 mt-1">Secured vs. tracked publications</p>
          </div>
        </div>

        {/* Interactive Studio Tab Bar */}
        <div
          className="inline-flex items-center gap-1 p-1 bg-[#0D0D0F] border border-zinc-800 rounded-lg overflow-x-auto max-w-full"
          role="tablist"
          aria-label="SEO Studio tools"
        >
          {STUDIO_TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setActiveTab(tab.id);
                  setErrorMsg('');
                }}
                className={`px-4 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                  active ? 'bg-zinc-100 text-[#050505]' : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-950/30 text-sm text-rose-200">
            {errorMsg}
          </div>
        )}

        {/* TAB 1: SEO Audit, Identity & Live JSON-LD */}
        {activeTab === 'audit' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: AI SEO Auditor */}
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-2xl border border-zinc-800 bg-[#0D0D0F] p-6 lg:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl text-zinc-100">
                      Live Portfolio SEO Audit
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1">
                      Inspects live page titles, image alt-text depth, keyword alignment, and Schema.org completeness.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={auditLoading}
                    onClick={handleRunAudit}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold bg-zinc-100 text-[#050505] rounded-lg hover:bg-white disabled:opacity-60 transition-colors whitespace-nowrap shrink-0"
                  >
                    {auditLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <SearchCheck className="w-4 h-4" />
                    )}
                    {auditLoading ? 'Auditing Portfolio...' : 'Run AI SEO Audit'}
                  </button>
                </div>

                {auditResult ? (
                  <div className="space-y-6 pt-4 border-t border-zinc-800">
                    <p className="text-sm leading-relaxed text-zinc-200">{auditResult.summary}</p>

                    <div className="rounded-xl border border-zinc-800 bg-[#050505] p-5 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs font-medium text-[#D4AF37]">
                          Suggested Metadata Upgrade
                        </span>
                        <button
                          type="button"
                          onClick={handleApplyOptimizedMeta}
                          className="px-3.5 py-1.5 text-xs font-semibold bg-zinc-100 text-[#050505] rounded-md hover:bg-white transition-colors"
                        >
                          Apply Title, Meta &amp; Keywords
                        </button>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Optimized Title ({auditResult.optimizedTitle?.length ?? 0} chars)</p>
                        <p className="text-sm text-zinc-100 mt-0.5">{auditResult.optimizedTitle}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">
                          Optimized Meta Description ({auditResult.optimizedMetaDescription?.length ?? 0} chars)
                        </p>
                        <p className="text-sm text-zinc-300 mt-0.5">
                          {auditResult.optimizedMetaDescription}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xs font-medium text-zinc-400">Prioritized Fixes</h3>
                      {auditResult.findings?.map((finding) => {
                        const applied = appliedFindingIds.includes(finding.id);
                        const canApply =
                          finding.actionType !== 'general' &&
                          (Boolean(finding.suggestedValue) || finding.actionType === 'add_keywords');
                        return (
                          <div
                            key={finding.id}
                            className="rounded-xl border border-zinc-800 bg-[#050505] p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs text-zinc-400">
                                <span className="font-medium text-zinc-200">{finding.area}</span>
                                <span aria-hidden="true">·</span>
                                <span
                                  className={
                                    finding.priority === 'High'
                                      ? 'text-[#D4AF37]'
                                      : 'text-zinc-400'
                                  }
                                >
                                  {finding.priority} Priority
                                </span>
                              </div>
                              <p className="text-sm text-zinc-200">{finding.issue}</p>
                              <p className="text-xs text-zinc-400">{finding.recommendation}</p>
                              {finding.suggestedValue && (
                                <p className="text-xs font-mono text-zinc-300 bg-[#0D0D0F] border border-zinc-800 rounded p-2 mt-2">
                                  {finding.suggestedValue}
                                </p>
                              )}
                            </div>

                            {canApply && (
                              <button
                                type="button"
                                disabled={applied}
                                onClick={() => handleApplyFinding(finding)}
                                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                                  applied
                                    ? 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                                    : 'bg-zinc-100 text-[#050505] hover:bg-white'
                                }`}
                              >
                                {applied ? 'Applied' : 'Apply Fix'}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-zinc-800 text-sm text-zinc-400">
                    Click <span className="text-zinc-200 font-medium">Run AI SEO Audit</span> to
                    scan your portfolio shoots, meta descriptions, and Knowledge Graph signals.
                  </div>
                )}
              </div>

              {/* Live JSON-LD & Sitemap Inspector */}
              <div className="rounded-2xl border border-zinc-800 bg-[#0D0D0F] p-6 lg:p-8 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-[#D4AF37]" />
                    <h2 className="font-display text-2xl text-zinc-100">
                      Live Schema.org JSON-LD &amp; Sitemap
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        await navigator.clipboard.writeText(liveJsonLd);
                        setCopiedSchema(true);
                        setTimeout(() => setCopiedSchema(false), 2000);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-200 border border-zinc-800 rounded-lg hover:border-zinc-600"
                    >
                      {copiedSchema ? <Check className="w-3.5 h-3.5 text-[#D4AF37]" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedSchema ? 'Copied JSON-LD' : 'Copy JSON-LD'}
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await navigator.clipboard.writeText(liveSitemap);
                        setCopiedSitemap(true);
                        setTimeout(() => setCopiedSitemap(false), 2000);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-200 border border-zinc-800 rounded-lg hover:border-zinc-600"
                    >
                      {copiedSitemap ? <Check className="w-3.5 h-3.5 text-[#D4AF37]" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedSitemap ? 'Copied XML' : 'Copy Sitemap.xml'}
                    </button>
                  </div>
                </div>

                <pre className="p-4 rounded-xl bg-[#050505] border border-zinc-800 text-xs font-mono text-zinc-300 overflow-x-auto max-h-72">
                  {liveJsonLd}
                </pre>
              </div>
            </div>

            {/* Right: Editable Portfolio Identity & Metadata */}
            <div className="lg:col-span-5">
              <form
                onSubmit={handleSaveProfileChanges}
                className="rounded-2xl border border-zinc-800 bg-[#0D0D0F] p-6 lg:p-8 space-y-4"
              >
                <h2 className="font-display text-2xl text-zinc-100">
                  Portfolio Identity &amp; Meta Tags
                </h2>
                <p className="text-xs text-zinc-400">
                  Changes persist locally and immediately update live page metadata and Schema.org Person nodes.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1" htmlFor="prof-name">
                      Model Name
                    </label>
                    <input
                      id="prof-name"
                      type="text"
                      value={profile.name}
                      onChange={(e) => onUpdateProfile({ ...profile, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-[#050505] border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1" htmlFor="prof-location">
                      Primary Markets
                    </label>
                    <input
                      id="prof-location"
                      type="text"
                      value={profile.location}
                      onChange={(e) => onUpdateProfile({ ...profile, location: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-[#050505] border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1" htmlFor="prof-agency">
                      Agency / Management
                    </label>
                    <input
                      id="prof-agency"
                      type="text"
                      value={profile.agency}
                      onChange={(e) => onUpdateProfile({ ...profile, agency: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-[#050505] border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1" htmlFor="prof-email">
                      Booking Email
                    </label>
                    <input
                      id="prof-email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => onUpdateProfile({ ...profile, email: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-[#050505] border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1" htmlFor="prof-seo-title">
                    SEO Page Title ({profile.seoTitle.length} chars)
                  </label>
                  <input
                    id="prof-seo-title"
                    type="text"
                    value={profile.seoTitle}
                    onChange={(e) => onUpdateProfile({ ...profile, seoTitle: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-[#050505] border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1" htmlFor="prof-seo-desc">
                    Meta Description ({profile.seoDescription.length} chars)
                  </label>
                  <textarea
                    id="prof-seo-desc"
                    rows={3}
                    value={profile.seoDescription}
                    onChange={(e) =>
                      onUpdateProfile({ ...profile, seoDescription: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-[#050505] border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1" htmlFor="prof-keywords">
                    Target SEO Keywords (comma-separated)
                  </label>
                  <textarea
                    id="prof-keywords"
                    rows={2}
                    value={keywordsInput}
                    onChange={(e) => setKeywordsInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-[#050505] border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1" htmlFor="prof-sameas">
                    Authority Profile URLs (`sameAs` for Knowledge Graph, one per line)
                  </label>
                  <textarea
                    id="prof-sameas"
                    rows={3}
                    value={sameAsInput}
                    onChange={(e) => setSameAsInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-[#050505] border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 text-xs font-semibold bg-zinc-100 text-[#050505] rounded-lg hover:bg-white transition-colors"
                >
                  Save Profile &amp; Sync Live SEO
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: Shoots & AI Alt-Text Optimizer */}
        {activeTab === 'shoots' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Shoot Selector */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl text-zinc-100">Lookbook Frames</h2>
                <button
                  type="button"
                  onClick={() => setNewShootOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#0D0D0F] border border-zinc-800 rounded-lg text-zinc-200 hover:border-zinc-600"
                >
                  <ImagePlus className="w-3.5 h-3.5" />
                  Add Shoot
                </button>
              </div>

              {newShootOpen && (
                <form
                  onSubmit={handleCreateShoot}
                  className="rounded-xl border border-zinc-800 bg-[#0D0D0F] p-4 space-y-3"
                >
                  <input
                    type="text"
                    placeholder="Shoot title (e.g. Atelier Silk Study)"
                    value={newShootTitle}
                    onChange={(e) => setNewShootTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#050505] border border-zinc-800 rounded-lg text-zinc-100"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={newShootCategory}
                      onChange={(e) => setNewShootCategory(e.target.value as ShootCategory)}
                      className="px-3 py-2 text-xs bg-[#050505] border border-zinc-800 rounded-lg text-zinc-100"
                    >
                      <option value="Runway">Runway</option>
                      <option value="Campaign">Campaign</option>
                      <option value="Editorial">Editorial</option>
                      <option value="Creative Direction">Creative Direction</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Location"
                      value={newShootLocation}
                      onChange={(e) => setNewShootLocation(e.target.value)}
                      className="px-3 py-2 text-xs bg-[#050505] border border-zinc-800 rounded-lg text-zinc-100"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Publication"
                      value={newShootPub}
                      onChange={(e) => setNewShootPub(e.target.value)}
                      className="px-3 py-2 text-xs bg-[#050505] border border-zinc-800 rounded-lg text-zinc-100"
                    />
                    <input
                      type="text"
                      placeholder="Photographer"
                      value={newShootPhotographer}
                      onChange={(e) => setNewShootPhotographer(e.target.value)}
                      className="px-3 py-2 text-xs bg-[#050505] border border-zinc-800 rounded-lg text-zinc-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Upload Portfolio Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'new')}
                      className="w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-zinc-800 file:text-zinc-100"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 text-xs font-semibold bg-zinc-100 text-[#050505] rounded-lg"
                  >
                    Save Shoot to Portfolio
                  </button>
                </form>
              )}

              <div className="space-y-2.5">
                {shoots.map((shoot) => {
                  const active = selectedShoot?.id === shoot.id;
                  return (
                    <button
                      key={shoot.id}
                      type="button"
                      onClick={() => {
                        setSelectedShootId(shoot.id);
                        setUploadedBase64(null);
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition-colors flex items-center gap-3.5 ${
                        active
                          ? 'border-[#D4AF37] bg-[#0D0D0F]'
                          : 'border-zinc-800/80 bg-[#0A0A0C] hover:border-zinc-700'
                      }`}
                    >
                      <div className="w-14 h-16 rounded-lg overflow-hidden shrink-0 bg-zinc-900">
                        <ResilientImage
                          src={shoot.imageUrl}
                          alt={shoot.altText}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-zinc-100 truncate">{shoot.title}</p>
                        <p className="text-xs text-zinc-400 truncate mt-0.5">
                          {shoot.category} · {shoot.publication}
                        </p>
                        <p className="font-mono text-[11px] text-zinc-500 mt-1 tabular-nums">
                          Alt: {shoot.altText.length} chars
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Active Shoot Alt-Text & Schema Editor */}
            {selectedShoot && (
              <div className="lg:col-span-8 rounded-2xl border border-zinc-800 bg-[#0D0D0F] p-6 lg:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
                  <div>
                    <p className="text-xs text-zinc-500">
                      {selectedShoot.publication} · {selectedShoot.location} · {selectedShoot.year}
                    </p>
                    <h3 className="font-display text-2xl text-zinc-100 mt-1">
                      {selectedShoot.title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    disabled={optimizingShoot}
                    onClick={handleOptimizeShoot}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold bg-zinc-100 text-[#050505] rounded-lg hover:bg-white disabled:opacity-60 transition-colors whitespace-nowrap"
                  >
                    {optimizingShoot ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    {optimizingShoot ? 'Optimizing...' : 'Optimize Alt-Text & Schema with AI'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-5 space-y-3">
                    <div className="rounded-xl overflow-hidden border border-zinc-800 aspect-[3/4] bg-[#050505]">
                      <ResilientImage
                        src={selectedShoot.imageUrl}
                        alt={selectedShoot.altText}
                        title={selectedShoot.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">
                        Replace or Analyze Local Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'existing')}
                        className="w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-zinc-800 file:text-zinc-100"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-4">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1.5">
                        Image Alt-Text ({selectedShoot.altText.length} chars — Google Images &amp; WCAG)
                      </label>
                      <textarea
                        rows={3}
                        value={selectedShoot.altText}
                        onChange={(e) =>
                          onUpdateShoot({ ...selectedShoot, altText: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 text-sm bg-[#050505] border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1.5">
                        Editorial Caption &amp; Credit
                      </label>
                      <textarea
                        rows={2}
                        value={selectedShoot.caption}
                        onChange={(e) =>
                          onUpdateShoot({ ...selectedShoot, caption: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 text-sm bg-[#050505] border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1.5">
                        Shoot Keywords (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={selectedShoot.seoKeywords.join(', ')}
                        onChange={(e) =>
                          onUpdateShoot({
                            ...selectedShoot,
                            seoKeywords: e.target.value
                              .split(',')
                              .map((k) => k.trim())
                              .filter(Boolean),
                          })
                        }
                        className="w-full px-3.5 py-2 text-xs font-mono bg-[#050505] border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Backlink Outreach & Press Pitch Writer */}
        {activeTab === 'outreach' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: AI Pitch Generator */}
            <div className="lg:col-span-5 space-y-6">
              <form
                onSubmit={handleGeneratePitch}
                className="rounded-2xl border border-zinc-800 bg-[#0D0D0F] p-6 lg:p-8 space-y-4"
              >
                <h2 className="font-display text-2xl text-zinc-100">
                  Backlink &amp; Press Pitch Writer
                </h2>
                <p className="text-xs text-zinc-400">
                  Uses live Google Search grounding to identify relevant fashion publications or directories and draft personalized link-building outreach.
                </p>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5" htmlFor="pitch-category">
                    Outreach Strategy
                  </label>
                  <select
                    id="pitch-category"
                    value={targetCategory}
                    onChange={(e) => setTargetCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#050505] border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option>Editorial Magazine Feature</option>
                    <option>Modeling &amp; Casting Directory Listing</option>
                    <option>Photographer / Stylist Credit Backlink</option>
                    <option>Independent Fashion Blog Guest Essay</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5" htmlFor="pitch-target">
                    Specific Publication or Niche (optional)
                  </label>
                  <input
                    id="pitch-target"
                    type="text"
                    value={customTarget}
                    onChange={(e) => setCustomTarget(e.target.value)}
                    placeholder="e.g. Vogue Scandinavia, Schon Magazine, PhotoVogue"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#050505] border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5" htmlFor="pitch-shoot">
                    Featured Shoot to Reference
                  </label>
                  <select
                    id="pitch-shoot"
                    value={outreachShootId}
                    onChange={(e) => setOutreachShootId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#050505] border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-[#D4AF37]"
                  >
                    {shoots.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} ({s.publication})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={generatingPitch}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-xs font-semibold bg-zinc-100 text-[#050505] rounded-lg hover:bg-white disabled:opacity-60 transition-colors"
                >
                  {generatingPitch ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Link2 className="w-4 h-4" />
                  )}
                  {generatingPitch
                    ? 'Researching & Drafting Pitch...'
                    : 'Research & Draft Pitch with AI'}
                </button>
              </form>

              {draftPitch && (
                <div className="rounded-2xl border border-zinc-800 bg-[#0D0D0F] p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-[#D4AF37]">Generated Outreach Draft</p>
                      <h3 className="font-display text-xl text-zinc-100 mt-0.5">
                        {draftPitch.publicationName}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onAddBacklink(draftPitch);
                        setDraftPitch(null);
                        onNotify('Saved pitch to Backlink Campaign Tracker.');
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold bg-zinc-100 text-[#050505] rounded-lg hover:bg-white"
                    >
                      Save to Tracker
                    </button>
                  </div>

                  <p className="text-xs text-zinc-400">{draftPitch.pitchAngle}</p>

                  <div className="rounded-xl bg-[#050505] border border-zinc-800 p-4 space-y-2">
                    <p className="text-xs font-medium text-zinc-200">
                      Subject: {draftPitch.emailSubject}
                    </p>
                    <p className="text-xs leading-relaxed text-zinc-300 whitespace-pre-line">
                      {draftPitch.emailBody}
                    </p>
                  </div>

                  {draftPitch.sources && draftPitch.sources.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs text-zinc-500">Grounded Web Sources</p>
                      <ul className="space-y-1">
                        {draftPitch.sources.map((src, idx) => (
                          <li key={idx}>
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-zinc-300 hover:text-[#D4AF37] truncate max-w-full"
                            >
                              <ExternalLink className="w-3 h-3 shrink-0" />
                              <span className="truncate">{src.title}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Backlink Campaign Tracker */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="font-display text-2xl text-zinc-100">
                Backlink &amp; Press Campaign Tracker
              </h2>

              <div className="space-y-4">
                {backlinks.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-zinc-800 bg-[#0D0D0F] p-5 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                          <span>{item.domainFocus}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{item.createdAt}</span>
                        </div>
                        <h3 className="font-display text-xl text-zinc-100">
                          {item.publicationName}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-1">{item.pitchAngle}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          aria-label={`Backlink status for ${item.publicationName}`}
                          value={item.status}
                          onChange={(e) =>
                            onUpdateBacklinkStatus(
                              item.id,
                              e.target.value as BacklinkStatus,
                              item.securedBacklinkUrl
                            )
                          }
                          className="px-3 py-1.5 text-xs bg-[#050505] border border-zinc-700 rounded-lg text-zinc-100"
                        >
                          <option value="Drafted">Drafted</option>
                          <option value="Sent">Sent</option>
                          <option value="Secured">Secured</option>
                        </select>

                        <button
                          type="button"
                          onClick={async () => {
                            await navigator.clipboard.writeText(
                              `Subject: ${item.emailSubject}\n\n${item.emailBody}`
                            );
                            setCopiedPitchId(item.id);
                            setTimeout(() => setCopiedPitchId(null), 1800);
                          }}
                          className="p-2 text-zinc-400 hover:text-zinc-100 border border-zinc-800 rounded-lg"
                          aria-label="Copy pitch email"
                        >
                          {copiedPitchId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteBacklink(item.id)}
                          className="p-2 text-zinc-500 hover:text-rose-400 border border-zinc-800 rounded-lg"
                          aria-label="Delete campaign target"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center gap-3">
                      <label className="text-xs text-zinc-500 whitespace-nowrap">
                        Live Backlink URL:
                      </label>
                      <input
                        type="url"
                        placeholder="https://publication.com/feature-link"
                        value={item.securedBacklinkUrl || ''}
                        onChange={(e) =>
                          onUpdateBacklinkStatus(item.id, item.status, e.target.value)
                        }
                        className="flex-1 px-3 py-1.5 text-xs font-mono bg-[#050505] border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Editorial Blog & Lookbook Story Generator */}
        {activeTab === 'editorial' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form
              onSubmit={handleGenerateStory}
              className="lg:col-span-5 rounded-2xl border border-zinc-800 bg-[#0D0D0F] p-6 lg:p-8 space-y-4 h-fit"
            >
              <h2 className="font-display text-2xl text-zinc-100">
                AI Editorial Story Generator
              </h2>
              <p className="text-xs text-zinc-400">
                Creates search-optimized lookbook essays that rank for casting keywords and earn natural editorial citations.
              </p>

              <div>
                <label className="block text-xs text-zinc-400 mb-1.5" htmlFor="story-topic">
                  Essay Topic / Runway Insight
                </label>
                <textarea
                  id="story-topic"
                  rows={2}
                  value={storyTopic}
                  onChange={(e) => setStoryTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#050505] border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1.5" htmlFor="story-keyword">
                  Target SEO Keyword
                </label>
                <input
                  id="story-keyword"
                  type="text"
                  value={storyKeyword}
                  onChange={(e) => setStoryKeyword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#050505] border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1.5" htmlFor="story-tone">
                  Editorial Voice
                </label>
                <input
                  id="story-tone"
                  type="text"
                  value={storyTone}
                  onChange={(e) => setStoryTone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#050505] border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <p className="text-xs text-zinc-400 mb-2">Link Portfolio Shoots</p>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {shoots.map((s) => {
                    const checked = selectedLinkedShoots.includes(s.id);
                    return (
                      <label
                        key={s.id}
                        className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setSelectedLinkedShoots((prev) =>
                              checked ? prev.filter((id) => id !== s.id) : [...prev, s.id]
                            )
                          }
                          className="accent-[#D4AF37]"
                        />
                        <span className="truncate">{s.title}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={generatingStory}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-xs font-semibold bg-zinc-100 text-[#050505] rounded-lg hover:bg-white disabled:opacity-60 transition-colors"
              >
                {generatingStory ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <BookOpen className="w-4 h-4" />
                )}
                {generatingStory ? 'Writing Editorial Story...' : 'Generate SEO Editorial'}
              </button>
            </form>

            <div className="lg:col-span-7">
              {draftArticle ? (
                <div className="rounded-2xl border border-zinc-800 bg-[#0D0D0F] p-6 lg:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                        <span className="text-[#D4AF37]">{draftArticle.targetKeyword}</span>
                        <span aria-hidden="true">·</span>
                        <span>{draftArticle.readTime}</span>
                      </div>
                      <h3 className="font-display text-3xl text-zinc-100">{draftArticle.title}</h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onPublishArticle(draftArticle);
                        setDraftArticle(null);
                        onNotify('Published story to Editorial Journal & Schema.org Article graph.');
                      }}
                      className="px-5 py-2.5 text-xs font-semibold bg-zinc-100 text-[#050505] rounded-lg hover:bg-white whitespace-nowrap shrink-0"
                    >
                      Publish to Journal
                    </button>
                  </div>

                  <div className="rounded-xl bg-[#050505] border border-zinc-800 p-4 text-xs text-zinc-400">
                    <span className="text-zinc-200 font-medium">Meta Description:</span>{' '}
                    {draftArticle.metaDescription}
                  </div>

                  <p className="text-sm italic text-zinc-300">{draftArticle.excerpt}</p>

                  <div className="space-y-6">
                    {draftArticle.sections.map((sec, idx) => (
                      <div key={idx} className="space-y-2">
                        <h4 className="font-display text-2xl text-zinc-100">{sec.heading}</h4>
                        <p className="text-sm leading-relaxed text-zinc-300">{sec.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-zinc-800 bg-[#0D0D0F] p-10 text-center space-y-3">
                  <BookOpen className="w-8 h-8 text-zinc-600 mx-auto stroke-[1.25]" />
                  <h3 className="font-display text-2xl text-zinc-200">
                    No Draft Essay Previewed Yet
                  </h3>
                  <p className="text-sm text-zinc-400 max-w-md mx-auto">
                    Configure a topic and target search keyword on the left to generate a structured lookbook story ready to publish into your Editorial Journal.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
