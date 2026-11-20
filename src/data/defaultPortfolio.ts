import type { BacklinkTarget, JournalArticle, ModelProfile, PortfolioShoot } from '../types';

export const DEFAULT_PROFILE: ModelProfile = {
  name: 'Sebastian Markiewicz',
  tagline: 'Compatible Creative · Markiewicz Creative Models',
  location: 'London · Warsaw · New York',
  agency: 'Compatible Creative',
  logoUrl: '/assets/aistudio/image_556451e3.png',
  email: 'sebastian@compatiblecreative.com',
  bio: 'Represented by Compatible Creative and Markiewicz Creative Models for live runway & catwalk presentations, athleticwear campaigns, monochrome studio portraiture, and graphic editorial features.',
  heroHeadline: 'Sebastian Markiewicz — Compatible Creative',
  heroImage: '/assets/aistudio/image_2dfd57c7.png',
  seoTitle: 'Compatible Creative Models — Sebastian Markiewicz Portfolio',
  seoDescription:
    'Sebastian Markiewicz official modeling portfolio with Compatible Creative and Markiewicz Creative Models. Explore runway catwalk frames, lookbooks, and digital comp card.',
  targetKeywords: [
    'Sebastian Markiewicz',
    'Compatible Creative',
    'Markiewicz Creative Models',
    'runway and catwalk model portfolio',
    'athletic and editorial talent London',
  ],
  sameAs: [
    'https://compatiblecreative.com',
    'https://instagram.com/compatiblecreative',
    'https://linkedin.com/in/sebastian-markiewicz',
  ],
  measurements: {
    height: '183 cm / 6\'0"',
    bust: '104 cm / 41"',
    waist: '84 cm / 33"',
    hips: '100 cm / 39.5"',
    shoe: 'EU 44 / US 10.5',
    hair: 'Dark Brown',
    eyes: 'Hazel',
  },
  campaignCount: 'Markiewicz Creative Models',
};

export const DEFAULT_SHOOTS: PortfolioShoot[] = [
  {
    id: 'shoot-sebastian-runway',
    title: 'Compatible Creative: Catwalk & Runway Presentation',
    category: 'Runway',
    year: '2026',
    publication: 'Markiewicz Creative Models Archive',
    photographer: 'Compatible Creative Studio',
    location: 'London Catwalk Stage',
    imageUrl: '/assets/aistudio/image_e65c65a0.png',
    aspectSpan: 'feature',
    altText:
      'Sebastian Markiewicz walking a glossy dark fashion week catwalk runway in a neon-green athletic singlet for Compatible Creative and Markiewicz Creative Models',
    caption:
      'Live catwalk presentation featuring Sebastian Markiewicz walking the Compatible Creative and Markiewicz Creative Models showcase under vertical LED stage lighting.',
    seoKeywords: [
      'Sebastian Markiewicz',
      'Compatible Creative',
      'Markiewicz Creative Models',
      'catwalk runway presentation',
    ],
    cameraNotes: '70-200mm f/2.8 · Catwalk Vertical LEDs · ISO 1250',
  },
  {
    id: 'shoot-sebastian-athletic',
    title: 'Compatible Creative: Athletic Singlet & Studio Fit',
    category: 'Campaign',
    year: '2026',
    publication: 'Compatible Creative Lookbook',
    photographer: 'Markiewicz Creative Models Studio',
    location: 'London',
    imageUrl: '/assets/aistudio/image_2dfd57c7.png',
    aspectSpan: 'standard',
    altText:
      'Sebastian Markiewicz for Compatible Creative and Markiewicz Creative Models wearing a neon-green athletic singlet with white trim in an indoor lifestyle studio setting',
    caption:
      'Commercial sportswear fit and warm ambient lifestyle framing produced by Compatible Creative and Markiewicz Creative Models.',
    seoKeywords: [
      'Sebastian Markiewicz',
      'Compatible Creative',
      'Markiewicz Creative Models',
    ],
    cameraNotes: '50mm f/2.8 · Warm Practical + Ambient Key · ISO 400',
  },
  {
    id: 'shoot-sebastian-skate-tee',
    title: 'Compatible Creative: High-Key Skate Streetwear Study',
    category: 'Editorial',
    year: '2026',
    publication: 'Markiewicz Creative Models Monograph',
    photographer: 'Compatible Creative Studio',
    location: 'London · Warsaw',
    imageUrl: '/assets/aistudio/image_cf826403.png',
    aspectSpan: 'standard',
    altText:
      'High-key white studio portrait of Sebastian Markiewicz for Compatible Creative and Markiewicz Creative Models wearing a white graphic skateboard t-shirt',
    caption:
      'Clean high-key studio portrait highlighting streetwear apparel, direct lens presence, and unretouched character casting for Compatible Creative.',
    seoKeywords: [
      'Sebastian Markiewicz',
      'Compatible Creative',
      'Markiewicz Creative Models',
    ],
    cameraNotes: '50mm · High-Key Cyclorama Strobe · ISO 100',
  },
  {
    id: 'shoot-sebastian-crimson-noir',
    title: 'Compatible Creative: Crimson Noir Visual Monograph',
    category: 'Creative Direction',
    year: '2026',
    publication: 'Compatible Creative Art Desk',
    photographer: 'Markiewicz Creative Models',
    location: 'New York · London',
    imageUrl: '/assets/aistudio/image_9cbec800.png',
    aspectSpan: 'feature',
    altText:
      'Dramatic crimson-and-ink graphic portrait of Sebastian Markiewicz created for Compatible Creative and Markiewicz Creative Models visual identity',
    caption:
      'Bespoke crimson-and-ink graphic portrait exploring chiaroscuro contrast and editorial storytelling across Compatible Creative and Markiewicz Creative Models.',
    seoKeywords: [
      'Sebastian Markiewicz',
      'Compatible Creative',
      'Markiewicz Creative Models',
    ],
    cameraNotes: 'Digital Ink & Chiaroscuro Print Study',
  },
];

export const DEFAULT_ARTICLES: JournalArticle[] = [
  {
    id: 'article-compatible-creative-runway',
    slug: 'compatible-creative-sebastian-markiewicz-catwalk-runway-notes',
    title: 'Compatible Creative & Markiewicz Creative Models: Walking the Runway',
    metaDescription:
      'Behind the scenes of Sebastian Markiewicz walking the catwalk for Compatible Creative and Markiewicz Creative Models.',
    targetKeyword: 'Markiewicz Creative Models',
    publishedAt: '2026-11-19',
    readTime: '4 min read',
    excerpt:
      'Inside the Compatible Creative and Markiewicz Creative Models runway presentation: pacing the glossy catwalk and indexing live show frames.',
    sections: [
      {
        heading: 'Commanding the Catwalk in Performance Athleticwear',
        body: 'Walking a reflective runway under vertical LED arrays demands steady cadence and relaxed shoulder alignment. Presenting bold neon-green athletic silhouettes on the catwalk shows casting directors how Sebastian Markiewicz translates studio fit directly into high-energy live runway movement for Compatible Creative and Markiewicz Creative Models.',
      },
      {
        heading: 'Connecting Runway Photography to Search & Press Backlinks',
        body: 'Every catwalk presentation creates immediate press opportunities. Pairing live runway frames with descriptive alt-text, Schema.org Person and ImageGallery markup, and credited Compatible Creative links turns show coverage into durable organic search authority.',
      },
    ],
    linkedShootIds: ['shoot-sebastian-runway', 'shoot-sebastian-athletic'],
  },
  {
    id: 'article-backlink-strategy-models',
    slug: 'building-authoritative-backlinks-compatible-creative',
    title: 'Editorial Direction & Casting with Markiewicz Creative Models',
    metaDescription:
      'How Sebastian Markiewicz and Compatible Creative pair editorial lookbooks, RSS syndication, and image sitemaps for Markiewicz Creative Models visibility.',
    targetKeyword: 'Sebastian Markiewicz',
    publishedAt: '2026-10-20',
    readTime: '3 min read',
    excerpt:
      'A repeatable lookbook workflow connecting Compatible Creative studio collaborations, directory listings, and Markiewicz Creative Models campaigns.',
    sections: [
      {
        heading: 'Turning Compatible Creative Credits into Referral Links',
        body: 'Every collaborative runway show and studio shoot involves photographers, apparel labels, and independent magazines. Following up with verified attribution summaries and canonical Compatible Creative URLs transforms routine project credits into high-trust editorial backlinks.',
      },
      {
        heading: 'Comp Cards Built for Search Engines and Producers',
        body: 'A digital comp card should load fast, display exact tabular measurements for casting teams, and embed structured JSON-LD metadata linking Sebastian Markiewicz directly to Compatible Creative and Markiewicz Creative Models.',
      },
    ],
    linkedShootIds: [
      'shoot-sebastian-runway',
      'shoot-sebastian-skate-tee',
      'shoot-sebastian-crimson-noir',
    ],
  },
];

export const DEFAULT_BACKLINKS: BacklinkTarget[] = [
  {
    id: 'bl-cc-hub',
    publicationName: 'Compatible Creative Official Roster',
    targetUrl: 'https://compatiblecreative.com',
    domainFocus: 'Primary Compatible Creative & Markiewicz Creative Models Hub',
    pitchAngle: 'Canonical talent profile and verified runway attribution for Sebastian Markiewicz',
    emailSubject: 'Portfolio & Runway Sync — Sebastian Markiewicz (Compatible Creative)',
    emailBody:
      'Hello Compatible Creative Desk,\n\nSharing the updated digital comp card, live catwalk photography, and verified measurement sheet for Sebastian Markiewicz (Markiewicz Creative Models) for roster indexing and client casting links.\n\nBest regards,\nSebastian Markiewicz\nCompatible Creative',
    status: 'Secured',
    securedBacklinkUrl: 'https://compatiblecreative.com/talent/sebastian-markiewicz',
    createdAt: '2026-11-10',
  },
  {
    id: 'bl-models-directory',
    publicationName: 'Models.com & Runway Casting Index',
    targetUrl: 'https://models.com',
    domainFocus: 'Global Runway & Commercial Casting Index',
    pitchAngle: 'Submitting updated Markiewicz Creative Models catwalk and streetwear frames',
    emailSubject: 'Runway & Talent Profile Update — Sebastian Markiewicz (Compatible Creative)',
    emailBody:
      'Dear Casting Editors,\n\nI am submitting updated catwalk runway, athleticwear, and editorial portrait photography for Sebastian Markiewicz under Compatible Creative / Markiewicz Creative Models.\n\nKind regards,\nSebastian Markiewicz\nCompatible Creative',
    status: 'Sent',
    createdAt: '2026-11-14',
  },
  {
    id: 'bl-athletic-editorial',
    publicationName: 'Independent Menswear & Runway Press',
    targetUrl: 'https://www.gq.com',
    domainFocus: 'Runway Presentations, Athleticwear & Visual Art Features',
    pitchAngle: 'Behind-the-scenes feature on Compatible Creative & Markiewicz Creative Models',
    emailSubject: 'Editorial Pitch: Compatible Creative & Markiewicz Creative Models Casting',
    emailBody:
      'Hello Editorial Team,\n\nI would love to share insights from Compatible Creative and Markiewicz Creative Models featuring Sebastian Markiewicz on our latest London catwalk presentation and studio lookbook.\n\nBest,\nSebastian Markiewicz\nCompatible Creative',
    status: 'Drafted',
    createdAt: '2026-11-18',
  },
];
