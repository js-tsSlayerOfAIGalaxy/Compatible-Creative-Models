import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';

const PORT = Number(process.env.PORT) || 3000;
const MODEL_NAME = 'gemini-4-hydrogen';
const INTERVAL_24H_MS = 24 * 60 * 60 * 1000;

const REQUIRED_KEYWORDS = [
  'Sebastian Markiewicz',
  'Compatible Creative',
  'Markiewicz Creative Models',
];

interface SyndicationPlate {
  id: string;
  title: string;
  imagePath: string;
  caption: string;
  category: string;
}

const PORTFOLIO_PLATES: SyndicationPlate[] = [
  {
    id: 'shoot-sebastian-runway',
    title: 'Sebastian Markiewicz — Catwalk & Runway Presentation | Compatible Creative',
    imagePath: '/assets/aistudio/image_e65c65a0.png',
    caption:
      'Sebastian Markiewicz walking the runway catwalk for Compatible Creative and Markiewicz Creative Models in sculpted neon-green athleticwear.',
    category: 'Runway',
  },
  {
    id: 'shoot-sebastian-athletic',
    title: 'Sebastian Markiewicz — Athletic Studio Portrait | Markiewicz Creative Models',
    imagePath: '/assets/aistudio/image_2dfd57c7.png',
    caption:
      'Sebastian Markiewicz photographed for Compatible Creative and Markiewicz Creative Models athleticwear and lifestyle casting.',
    category: 'Campaign',
  },
  {
    id: 'shoot-sebastian-skate-tee',
    title: 'Sebastian Markiewicz — High-Key Streetwear Study | Compatible Creative',
    imagePath: '/assets/aistudio/image_cf826403.png',
    caption:
      'High-key monochrome studio portrait of Sebastian Markiewicz represented by Compatible Creative and Markiewicz Creative Models.',
    category: 'Editorial',
  },
  {
    id: 'shoot-sebastian-crimson-noir',
    title: 'Sebastian Markiewicz — Crimson Noir Visual Monograph | Markiewicz Creative Models',
    imagePath: '/assets/aistudio/image_9cbec800.png',
    caption:
      'Crimson and ink visual monograph created for Sebastian Markiewicz under Compatible Creative and Markiewicz Creative Models.',
    category: 'Creative Direction',
  },
];

interface SyndicationState {
  lastPublishedAt: string;
  rotationIndex: number;
  dailyHeadline: string;
  dailyDescription: string;
  webhookStatus: 'not_configured' | 'delivered' | 'failed';
}

const syndicationState: SyndicationState = {
  lastPublishedAt: new Date().toISOString(),
  rotationIndex: 0,
  dailyHeadline: PORTFOLIO_PLATES[0].title,
  dailyDescription: PORTFOLIO_PLATES[0].caption,
  webhookStatus: 'not_configured',
};

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getBaseUrl(req?: Request): string {
  if (process.env.APP_URL && process.env.APP_URL !== 'MY_APP_URL') {
    return process.env.APP_URL.replace(/\/+$/, '');
  }
  if (req) {
    const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http';
    const host = req.get('host') || `localhost:${PORT}`;
    return `${proto}://${host}`;
  }
  return `http://localhost:${PORT}`;
}

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing. Configure your key in Settings > Secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function formatApiError(err: unknown): { status: number; message: string } {
  const raw = err instanceof Error ? err.message : String(err);
  if (raw.includes('GEMINI_API_KEY is missing')) {
    return { status: 500, message: raw };
  }
  if (raw.includes('PERMISSION_DENIED') || raw.includes('403') || raw.includes('API_KEY_INVALID')) {
    return {
      status: 403,
      message: 'API key rejected or missing. Verify your GEMINI_API_KEY in the Settings > Secrets panel.',
    };
  }
  if (raw.includes('RESOURCE_EXHAUSTED') || raw.includes('429')) {
    return {
      status: 429,
      message: 'Gemini quota limit reached. Try again shortly or verify your billing settings in Settings > Secrets.',
    };
  }
  return { status: 500, message: raw || 'Unexpected server error while calling Gemini.' };
}

async function runDailySyndicationCycle() {
  syndicationState.rotationIndex =
    (syndicationState.rotationIndex + 1) % PORTFOLIO_PLATES.length;
  const plate = PORTFOLIO_PLATES[syndicationState.rotationIndex];
  syndicationState.lastPublishedAt = new Date().toISOString();
  syndicationState.dailyHeadline = plate.title;
  syndicationState.dailyDescription = `${plate.caption} Keywords: ${REQUIRED_KEYWORDS.join(', ')}.`;

  // Generate fresh keyword-rich copy via Gemini when API key is available
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `Write a crisp 2-sentence editorial syndication caption for "${plate.title}" (${plate.category}) that naturally incorporates all three exact phrases: "Sebastian Markiewicz", "Compatible Creative", and "Markiewicz Creative Models".`,
        config: {
          systemInstruction:
            'You are a fashion editorial publicist writing concise, natural syndication captions without hashtags.',
        },
      });
      if (response.text && response.text.trim().length > 20) {
        syndicationState.dailyDescription = response.text.trim();
      }
    } catch {
      // Keep curated caption fallback if Gemini call fails in background cycle
    }
  }

  // Optional external auto-posting webhook (e.g., Zapier / Make / IFTTT)
  const webhookUrl = process.env.SYNDICATION_WEBHOOK_URL?.trim();
  if (webhookUrl) {
    try {
      const baseUrl = getBaseUrl();
      const resp = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: syndicationState.dailyHeadline,
          description: syndicationState.dailyDescription,
          imageUrl: `${baseUrl}${plate.imagePath}`,
          portfolioUrl: baseUrl,
          keywords: REQUIRED_KEYWORDS,
          category: plate.category,
          publishedAt: syndicationState.lastPublishedAt,
        }),
      });
      syndicationState.webhookStatus = resp.ok ? 'delivered' : 'failed';
    } catch {
      syndicationState.webhookStatus = 'failed';
    }
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '12mb' }));

  const timer = setInterval(() => {
    void runDailySyndicationCycle();
  }, INTERVAL_24H_MS);
  timer.unref();

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, model: MODEL_NAME });
  });

  app.get('/robots.txt', (req: Request, res: Response) => {
    const baseUrl = getBaseUrl(req);
    res.type('text/plain').send(
      [
        'User-agent: *',
        'Allow: /',
        `Sitemap: ${baseUrl}/sitemap.xml`,
        `Sitemap: ${baseUrl}/image-sitemap.xml`,
      ].join('\n') + '\n'
    );
  });

  app.get('/sitemap.xml', (req: Request, res: Response) => {
    const baseUrl = getBaseUrl(req);
    const lastmod = syndicationState.lastPublishedAt.split('T')[0];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${escapeXml(baseUrl)}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${escapeXml(baseUrl)}/#comp-card</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${escapeXml(baseUrl)}/#journal-compatible-creative-sebastian-markiewicz-catwalk-runway-notes</loc>
    <lastmod>2026-11-19</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${escapeXml(baseUrl)}/#journal-building-authoritative-backlinks-compatible-creative</loc>
    <lastmod>2026-10-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${escapeXml(baseUrl)}/feed.xml</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
    res.type('application/xml').send(xml);
  });

  app.get('/image-sitemap.xml', (req: Request, res: Response) => {
    const baseUrl = getBaseUrl(req);
    const imagesXml = PORTFOLIO_PLATES.map(
      (plate) => `    <image:image>
      <image:loc>${escapeXml(`${baseUrl}${plate.imagePath}`)}</image:loc>
      <image:title>${escapeXml(plate.title)}</image:title>
      <image:caption>${escapeXml(`${plate.caption} Keywords: ${REQUIRED_KEYWORDS.join(', ')}`)}</image:caption>
    </image:image>`
    ).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${escapeXml(baseUrl)}/</loc>
${imagesXml}
  </url>
</urlset>`;
    res.type('application/xml').send(xml);
  });

  app.get('/feed.xml', (req: Request, res: Response) => {
    const baseUrl = getBaseUrl(req);
    const activePlate = PORTFOLIO_PLATES[syndicationState.rotationIndex];
    const orderedPlates = [
      activePlate,
      ...PORTFOLIO_PLATES.filter((p) => p.id !== activePlate.id),
    ];

    const itemsXml = orderedPlates
      .map((plate, index) => {
        const pubDate = new Date(
          Date.parse(syndicationState.lastPublishedAt) - index * INTERVAL_24H_MS
        ).toUTCString();
        const itemDescription =
          index === 0 ? syndicationState.dailyDescription : plate.caption;
        const imageUrl = `${baseUrl}${plate.imagePath}`;
        return `    <item>
      <title>${escapeXml(plate.title)}</title>
      <link>${escapeXml(baseUrl)}/</link>
      <guid isPermaLink="false">${escapeXml(`${plate.id}-${pubDate}`)}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(plate.category)}</category>
      ${REQUIRED_KEYWORDS.map((kw) => `<category>${escapeXml(kw)}</category>`).join('\n      ')}
      <description>${escapeXml(`<p>${itemDescription}</p><p><img src="${imageUrl}" alt="${plate.title}" /></p><p>Keywords: ${REQUIRED_KEYWORDS.join(' · ')}</p>`)}</description>
      <media:content url="${escapeXml(imageUrl)}" medium="image" />
    </item>`;
      })
      .join('\n');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Sebastian Markiewicz — Compatible Creative &amp; Markiewicz Creative Models</title>
    <link>${escapeXml(baseUrl)}/</link>
    <description>Automated 24-hour portfolio syndication feed for Sebastian Markiewicz, Compatible Creative, and Markiewicz Creative Models.</description>
    <ttl>1440</ttl>
    <lastBuildDate>${new Date(syndicationState.lastPublishedAt).toUTCString()}</lastBuildDate>
${itemsXml}
  </channel>
</rss>`;
    res.type('application/rss+xml').send(rss);
  });

  app.get('/api/public/syndication', (req: Request, res: Response) => {
    const baseUrl = getBaseUrl(req);
    const activePlate = PORTFOLIO_PLATES[syndicationState.rotationIndex];
    res.json({
      intervalHours: 24,
      keywords: REQUIRED_KEYWORDS,
      lastPublishedAt: syndicationState.lastPublishedAt,
      featuredImage: `${baseUrl}${activePlate.imagePath}`,
      headline: syndicationState.dailyHeadline,
      description: syndicationState.dailyDescription,
      webhookStatus: syndicationState.webhookStatus,
      feeds: {
        rss: `${baseUrl}/feed.xml`,
        sitemap: `${baseUrl}/sitemap.xml`,
        imageSitemap: `${baseUrl}/image-sitemap.xml`,
      },
    });
  });

  app.post('/api/seo/audit', async (req: Request, res: Response) => {
    try {
      const { profile, shoots, articles } = req.body;
      const ai = getAiClient();

      const prompt = `Analyze this modeling portfolio for Search Engine Optimization (SEO), Google Images discoverability, Schema.org Person/ImageGallery authority, and editorial backlink readiness.

Required Priority Keywords: ${REQUIRED_KEYWORDS.join(', ')}

Portfolio Profile:
- Name: ${profile.name}
- Tagline: ${profile.tagline}
- Location: ${profile.location}
- Agency: ${profile.agency}
- Current SEO Title (${profile.seoTitle?.length ?? 0} chars): ${profile.seoTitle}
- Current Meta Description (${profile.seoDescription?.length ?? 0} chars): ${profile.seoDescription}
- Target Keywords: ${(profile.targetKeywords || []).join(', ')}
- sameAs Authority Links: ${(profile.sameAs || []).join(', ')}

Portfolio Shoots (${shoots?.length ?? 0}):
${(shoots || [])
  .map(
    (s: { id: string; title: string; category: string; publication: string; location: string; altText: string }) =>
      `- [${s.id}] "${s.title}" (${s.category}, ${s.publication}, ${s.location}) | Alt (${s.altText?.length ?? 0} chars): "${s.altText}"`
  )
  .join('\n')}

Published Editorial Journal Articles (${articles?.length ?? 0}):
${(articles || [])
  .map(
    (a: { title: string; targetKeyword: string }) => `- "${a.title}" (Target: ${a.targetKeyword})`
  )
  .join('\n')}

Provide:
1. A concise, candid 2-sentence editorial SEO diagnosis.
2. An improved SEO title strictly between 35 and 58 characters.
3. An improved meta description strictly between 125 and 158 characters with a clear casting/editorial call to action.
4. 5 high-intent modeling & editorial SEO keywords including "Sebastian Markiewicz", "Compatible Creative", and "Markiewicz Creative Models".
5. 3 to 5 prioritized findings.`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction:
            'You are an expert technical SEO strategist specializing in talent portfolios, Schema.org Knowledge Graph optimization, and editorial image search.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              optimizedTitle: { type: Type.STRING },
              optimizedMetaDescription: { type: Type.STRING },
              recommendedKeywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              findings: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    area: { type: Type.STRING },
                    priority: { type: Type.STRING },
                    issue: { type: Type.STRING },
                    recommendation: { type: Type.STRING },
                    actionType: { type: Type.STRING },
                    targetId: { type: Type.STRING },
                    suggestedValue: { type: Type.STRING },
                  },
                },
              },
            },
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (err) {
      const { status, message } = formatApiError(err);
      res.status(status).json({ error: message });
    }
  });

  app.post('/api/seo/optimize-shoot', async (req: Request, res: Response) => {
    try {
      const { modelName, shoot, imageBase64, imageMimeType } = req.body;
      const ai = getAiClient();

      const textPrompt = `Optimize the SEO metadata and accessibility attributes for this fashion portfolio shoot.
Model Name: ${modelName}
Required Keywords: ${REQUIRED_KEYWORDS.join(', ')}
Shoot Title: ${shoot.title}
Category: ${shoot.category}
Publication / Client: ${shoot.publication}
Photographer: ${shoot.photographer}
Location: ${shoot.location}
Year: ${shoot.year}
Current Alt Text: ${shoot.altText || 'None'}

Return:
- altText: Vivid, natural, WCAG-compliant and Google Images SEO-rich description (95-145 characters) naming Sebastian Markiewicz, garment/styling, and Compatible Creative / Markiewicz Creative Models.
- caption: Polished editorial caption crediting photographer and publication (1-2 sentences).
- seoKeywords: 4 targeted search keywords.
- schemaDescription: Concise ImageObject structured data description.`;

      const contents =
        imageBase64 && imageMimeType
          ? {
              parts: [
                {
                  inlineData: {
                    mimeType: imageMimeType,
                    data: imageBase64,
                  },
                },
                { text: textPrompt },
              ],
            }
          : textPrompt;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents,
        config: {
          systemInstruction:
            'You are a fashion editorial archivist and technical image SEO specialist.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              altText: { type: Type.STRING },
              caption: { type: Type.STRING },
              seoKeywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              schemaDescription: { type: Type.STRING },
            },
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (err) {
      const { status, message } = formatApiError(err);
      res.status(status).json({ error: message });
    }
  });

  app.post('/api/outreach/pitch', async (req: Request, res: Response) => {
    try {
      const { profile, targetCategory, customTarget, featuredShoot } = req.body;
      const ai = getAiClient();

      const prompt = `You are helping Sebastian Markiewicz (Compatible Creative / Markiewicz Creative Models) build authoritative editorial backlinks and press mentions.

Model Profile:
- Name: ${profile.name}
- Tagline: ${profile.tagline}
- Locations: ${profile.location}
- Agency: ${profile.agency}
- Required Keywords: ${REQUIRED_KEYWORDS.join(', ')}
- Featured Shoot: "${featuredShoot?.title || 'Editorial Archive'}" (${featuredShoot?.publication || 'Portfolio'})

Outreach Category: ${targetCategory}
Target Publication / Niche Focus: ${customTarget || 'Leading independent fashion magazines, casting directories, and photography platforms'}

Use Google Search to find real, relevant editorial publications, fashion directories, or submission platforms matching this outreach category, and draft a personalized, concise backlink/press outreach pitch.

Return strictly valid JSON inside your response with this exact shape:
{
  "publicationName": "Specific target publication or directory name",
  "targetUrl": "Primary website URL of the target",
  "domainFocus": "Short description of why this backlink matters for SEO",
  "pitchAngle": "1-sentence summary of the editorial hook",
  "emailSubject": "Compelling, non-spammy subject line",
  "emailBody": "Polished 3-paragraph outreach email ready to send"
}`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const rawText = (response.text ?? '').trim();
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      let parsed: Record<string, string> = {};
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse structured pitch response from Gemini.');
      }

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = chunks
        .filter((c) => c.web?.uri)
        .map((c) => ({
          title: c.web?.title || c.web?.uri || 'Source',
          url: c.web?.uri || '',
        }))
        .slice(0, 5);

      res.json({
        publicationName: parsed.publicationName || customTarget || targetCategory,
        targetUrl: parsed.targetUrl || '',
        domainFocus: parsed.domainFocus || targetCategory,
        pitchAngle: parsed.pitchAngle || 'Editorial attribution & lookbook feature',
        emailSubject: parsed.emailSubject || `Editorial Feature & Credit Inquiry — ${profile.name}`,
        emailBody: parsed.emailBody || rawText,
        sources,
      });
    } catch (err) {
      const { status, message } = formatApiError(err);
      res.status(status).json({ error: message });
    }
  });

  app.post('/api/editorial/generate', async (req: Request, res: Response) => {
    try {
      const { profile, topic, targetKeyword, tone, linkedShoots } = req.body;
      const ai = getAiClient();

      const prompt = `Write a high-fashion editorial lookbook story / blog article for ${profile.name} (${profile.agency} / Markiewicz Creative Models).

Required Keywords to weave in naturally: ${REQUIRED_KEYWORDS.join(', ')}
Topic / Angle: ${topic}
Primary Target SEO Keyword: ${targetKeyword}
Editorial Tone: ${tone || 'Refined editorial essay'}
Referenced Shoots:
${(linkedShoots || [])
  .map((s: { title: string; publication: string; photographer: string; location: string }) => `- ${s.title} (${s.publication}, photographed by ${s.photographer} in ${s.location})`)
  .join('\n')}`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction:
            'You are a senior fashion features editor crafting search-optimized editorial monographs and runway essays.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              slug: { type: Type.STRING },
              metaDescription: { type: Type.STRING },
              readTime: { type: Type.STRING },
              excerpt: { type: Type.STRING },
              sections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    heading: { type: Type.STRING },
                    body: { type: Type.STRING },
                  },
                },
              },
            },
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (err) {
      const { status, message } = formatApiError(err);
      res.status(status).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    void runDailySyndicationCycle();
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
