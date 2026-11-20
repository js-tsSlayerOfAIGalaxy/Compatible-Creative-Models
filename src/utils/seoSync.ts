import type { JournalArticle, ModelProfile, PortfolioShoot } from '../types';

function setMetaContent(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attribute, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function buildJsonLdPayload(
  profile: ModelProfile,
  shoots: PortfolioShoot[],
  articles: JournalArticle[],
  origin: string
) {
  const personId = `${origin}/#model`;

  const logoUrl = profile.logoUrl
    ? profile.logoUrl.startsWith('http') || profile.logoUrl.startsWith('data:')
      ? profile.logoUrl
      : `${origin}${profile.logoUrl}`
    : undefined;

  const personNode = {
    '@type': 'Person',
    '@id': personId,
    name: profile.name,
    alternateName: ['Compatible Creative', 'Markiewicz Creative Models'],
    jobTitle: profile.tagline,
    description: profile.seoDescription,
    url: origin,
    email: `mailto:${profile.email}`,
    image: profile.heroImage.startsWith('http') ? profile.heroImage : `${origin}${profile.heroImage}`,
    homeLocation: {
      '@type': 'Place',
      name: profile.location,
    },
    worksFor: {
      '@type': 'Organization',
      name: profile.agency,
      alternateName: 'Markiewicz Creative Models',
      ...(logoUrl ? { logo: logoUrl } : {}),
    },
    knowsAbout: profile.targetKeywords,
    sameAs: profile.sameAs.filter(Boolean),
  };

  const galleryNode = {
    '@type': 'ImageGallery',
    '@id': `${origin}/#lookbook`,
    name: `${profile.name} — Editorial Lookbook & Runway Archive`,
    about: { '@id': personId },
    associatedMedia: shoots.map((shoot) => ({
      '@type': 'ImageObject',
      name: shoot.title,
      caption: shoot.caption,
      description: shoot.altText,
      contentUrl: shoot.imageUrl.startsWith('http') || shoot.imageUrl.startsWith('data:')
        ? shoot.imageUrl
        : `${origin}${shoot.imageUrl}`,
      creator: {
        '@type': 'Person',
        name: shoot.photographer,
      },
      contentLocation: {
        '@type': 'Place',
        name: shoot.location,
      },
      keywords: shoot.seoKeywords.join(', '),
    })),
  };

  const articleNodes = articles.map((article) => ({
    '@type': 'Article',
    '@id': `${origin}/#journal-${article.slug}`,
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publishedAt,
    keywords: article.targetKeyword,
    author: { '@id': personId },
    mainEntityOfPage: `${origin}/#journal-${article.slug}`,
  }));

  return {
    '@context': 'https://schema.org',
    '@graph': [personNode, galleryNode, ...articleNodes],
  };
}

export function syncDocumentSeo(
  profile: ModelProfile,
  shoots: PortfolioShoot[],
  articles: JournalArticle[]
) {
  if (typeof document === 'undefined') return;

  const origin = window.location.origin;
  const canonicalUrl = `${origin}${window.location.pathname}`;
  const heroImageUrl =
    profile.heroImage.startsWith('http') || profile.heroImage.startsWith('data:')
      ? profile.heroImage
      : `${origin}${profile.heroImage}`;

  document.title = profile.seoTitle;
  setMetaContent('meta[name="description"]', 'name', 'description', profile.seoDescription);
  setMetaContent('meta[name="keywords"]', 'name', 'keywords', profile.targetKeywords.join(', '));
  setMetaContent('meta[property="og:title"]', 'property', 'og:title', profile.seoTitle);
  setMetaContent('meta[property="og:description"]', 'property', 'og:description', profile.seoDescription);
  setMetaContent('meta[property="og:site_name"]', 'property', 'og:site_name', profile.name);
  setMetaContent('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
  setMetaContent('meta[property="og:image"]', 'property', 'og:image', heroImageUrl);
  setMetaContent('meta[name="twitter:title"]', 'name', 'twitter:title', profile.seoTitle);
  setMetaContent('meta[name="twitter:description"]', 'name', 'twitter:description', profile.seoDescription);
  setMetaContent('meta[name="twitter:image"]', 'name', 'twitter:image', heroImageUrl);

  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', canonicalUrl);

  let scriptEl = document.getElementById('portfolio-jsonld') as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'portfolio-jsonld';
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }
  scriptEl.textContent = JSON.stringify(buildJsonLdPayload(profile, shoots, articles, origin), null, 2);
}

export function generateSitemapXml(origin: string, articles: JournalArticle[]) {
  const today = new Date().toISOString().split('T')[0];
  const articleUrls = articles
    .map(
      (a) => `  <url>
    <loc>${origin}/#journal-${a.slug}</loc>
    <lastmod>${a.publishedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${origin}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${origin}/#comp-card</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
${articleUrls}
</urlset>`;
}
