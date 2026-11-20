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
    alternateName: ['Compatible Creative', 'Markiewicz Creative Models', 'Compatible Music'],
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
      url: 'https://www.compatiblecreative.co.uk/',
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

  const blogNode = {
    '@type': 'Blog',
    '@id': `${origin}/blog`,
    name: 'Compatible Creative Blog — Sebastian Markiewicz',
    url: `${origin}/blog`,
    author: { '@id': personId },
    blogPost: articles.map((article) => {
      const linkedImages = shoots
        .filter((s) => article.linkedShootIds.includes(s.id))
        .map((s) =>
          s.imageUrl.startsWith('http') || s.imageUrl.startsWith('data:')
            ? s.imageUrl
            : `${origin}${s.imageUrl}`
        );
      return {
        '@type': 'BlogPosting',
        '@id': `${origin}/blog/${article.slug}`,
        headline: article.title,
        description: article.metaDescription,
        datePublished: article.publishedAt,
        dateModified: article.publishedAt,
        keywords: [
          article.targetKeyword,
          'Sebastian Markiewicz',
          'Compatible Creative',
          'Markiewicz Creative Models',
          'Compatible Music',
        ].join(', '),
        image: linkedImages.length > 0 ? linkedImages : [`${origin}${profile.heroImage}`],
        author: { '@id': personId },
        publisher: {
          '@type': 'Organization',
          name: profile.agency,
          ...(logoUrl ? { logo: { '@type': 'ImageObject', url: logoUrl } } : {}),
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${origin}/blog/${article.slug}`,
        },
      };
    }),
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [personNode, galleryNode, blogNode],
  };
}

export function syncDocumentSeo(
  profile: ModelProfile,
  shoots: PortfolioShoot[],
  articles: JournalArticle[],
  activeArticle?: JournalArticle | null,
  isBlogIndex?: boolean
) {
  if (typeof document === 'undefined') return;

  const origin = window.location.origin;
  const canonicalUrl = `${origin}${window.location.pathname}`;
  const articleLeadShoot = activeArticle
    ? shoots.find((s) => activeArticle.linkedShootIds.includes(s.id))
    : undefined;
  const leadImageRaw = articleLeadShoot?.imageUrl || profile.heroImage;
  const leadImageUrl =
    leadImageRaw.startsWith('http') || leadImageRaw.startsWith('data:')
      ? leadImageRaw
      : `${origin}${leadImageRaw}`;

  const pageTitle = activeArticle
    ? `${activeArticle.title} | Compatible Creative Blog`
    : isBlogIndex
    ? `Blog — ${profile.name} | Compatible Creative Models`
    : profile.seoTitle;

  const pageDescription = activeArticle
    ? activeArticle.metaDescription
    : isBlogIndex
    ? `Editorial notes, runway dispatches, SEO case studies, and Compatible Music highlights by ${profile.name} (${profile.agency}).`
    : profile.seoDescription;

  document.title = pageTitle;
  setMetaContent('meta[name="description"]', 'name', 'description', pageDescription);
  setMetaContent('meta[name="keywords"]', 'name', 'keywords', profile.targetKeywords.join(', '));
  setMetaContent('meta[property="og:type"]', 'property', 'og:type', activeArticle ? 'article' : 'website');
  setMetaContent('meta[property="og:title"]', 'property', 'og:title', pageTitle);
  setMetaContent('meta[property="og:description"]', 'property', 'og:description', pageDescription);
  setMetaContent('meta[property="og:site_name"]', 'property', 'og:site_name', profile.name);
  setMetaContent('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
  setMetaContent('meta[property="og:image"]', 'property', 'og:image', leadImageUrl);
  if (activeArticle) {
    setMetaContent('meta[property="article:published_time"]', 'property', 'article:published_time', activeArticle.publishedAt);
  }
  setMetaContent('meta[name="twitter:title"]', 'name', 'twitter:title', pageTitle);
  setMetaContent('meta[name="twitter:description"]', 'name', 'twitter:description', pageDescription);
  setMetaContent('meta[name="twitter:image"]', 'name', 'twitter:image', leadImageUrl);

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
    <loc>${origin}/blog/${a.slug}</loc>
    <lastmod>${a.publishedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
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
    <loc>${origin}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
${articleUrls}
</urlset>`;
}
