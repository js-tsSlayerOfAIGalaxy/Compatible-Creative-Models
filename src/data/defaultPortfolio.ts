import type {
  BacklinkTarget,
  ExternalWorkLink,
  JournalArticle,
  ModelProfile,
  PortfolioShoot,
} from '../types';

export const OTHER_WORK_LINKS: ExternalWorkLink[] = [
  {
    id: 'work-compatible-creative-uk',
    title: 'Compatible Creative Studio & Direction',
    subtitle: 'Official Agency & Multidisciplinary Hub',
    domain: 'compatiblecreative.co.uk',
    url: 'https://www.compatiblecreative.co.uk/',
    category: 'Studio & Direction',
    description:
      'Explore the flagship Compatible Creative platform spanning art direction, visual production, photography collaborations, and talent projects.',
  },
  {
    id: 'work-compatible-music-album',
    title: 'Compatible Music — Official Albums',
    subtitle: 'Original Releases & Sound Design',
    domain: 'compatiblecreative.co.uk/albums/compatible-music',
    url: 'https://www.compatiblecreative.co.uk/albums/compatible-music/',
    category: 'Album Release',
    description:
      'Listen to the Compatible Music album catalog and sonic projects produced alongside Sebastian Markiewicz visual lookbooks.',
  },
  {
    id: 'work-beatport-catalog',
    title: 'Sebastian Markiewicz on Beatport',
    subtitle: 'Official Electronic Artist Discography',
    domain: 'beatport.com/artist/sebastian-markiewicz/311129',
    url: 'https://www.beatport.com/artist/sebastian-markiewicz/311129',
    category: 'Streaming & Catalog',
    description:
      'Verified Beatport artist catalog featuring electronic releases, singles, and DJ-ready tracks by Sebastian Markiewicz.',
  },
  {
    id: 'work-soundcloud-archive',
    title: 'Sebastian Markiewicz on SoundCloud',
    subtitle: 'Live Sessions, Mixes & Runway Audio',
    domain: 'soundcloud.com/sebastianmarkiewicz',
    url: 'https://soundcloud.com/sebastianmarkiewicz',
    category: 'Audio Archive',
    description:
      'Streaming archive of studio sessions, runway soundscapes, and Compatible Music previews by Sebastian Markiewicz.',
  },
];

export const DEFAULT_PROFILE: ModelProfile = {
  name: 'Sebastian Markiewicz',
  tagline: 'Compatible Creative · Markiewicz Creative Models',
  location: 'London · Warsaw · New York',
  agency: 'Compatible Creative',
  logoUrl: '/assets/aistudio/image_556451e3.png',
  email: 'sebastian@compatiblecreative.com',
  bio: 'Represented by Compatible Creative and Markiewicz Creative Models for live runway & catwalk presentations, athleticwear campaigns, monochrome studio portraiture, and Compatible Music visual direction.',
  heroHeadline: 'Sebastian Markiewicz — Compatible Creative',
  heroImage: '/assets/aistudio/image_2dfd57c7.png',
  seoTitle: 'Compatible Creative Models — Sebastian Markiewicz Portfolio',
  seoDescription:
    'Sebastian Markiewicz official modeling portfolio with Compatible Creative and Markiewicz Creative Models. Explore runway catwalk frames, lookbooks, Compatible Music, and digital comp card.',
  targetKeywords: [
    'Sebastian Markiewicz',
    'Compatible Creative',
    'Markiewicz Creative Models',
    'Compatible Music',
    'runway and catwalk model portfolio',
  ],
  sameAs: [
    'https://www.compatiblecreative.co.uk/',
    'https://www.compatiblecreative.co.uk/albums/compatible-music/',
    'https://www.beatport.com/artist/sebastian-markiewicz/311129',
    'https://soundcloud.com/sebastianmarkiewicz',
    'https://compatible-creative-models.vercel.app/',
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
    id: 'article-bedroom-beats-paris-runways',
    slug: 'from-bedroom-beats-to-paris-runways-sebastian-markiewicz',
    title: 'From Bedroom Beats to Paris Runways: The Unlikely Reinvention of Sebastian Markiewicz',
    category: 'Editorial',
    metaDescription:
      'From bedroom DJ mixes on SoundCloud and Beatport to Paris Fashion Week catwalks: the unlikely reinvention of model Sebastian Markiewicz with Compatible Creative.',
    targetKeyword: 'Sebastian Markiewicz',
    publishedAt: '2026-11-20',
    readTime: '5 min read',
    excerpt:
      'In the world of creative careers, reinvention is practically a rite of passage. Yet few pivots are quite as dramatic—or as visually striking—as trading late-night Ableton sessions and dusty bedroom turntables for the blinding flashbulbs of Paris Fashion Week. Enter Sebastian Markiewicz, a man whose journey from self-described mediocre bedroom DJ and struggling music producer to sought-after professional lingerie model proves that sometimes your true calling isn’t in the booth—it’s on the catwalk.',
    sections: [
      {
        heading: 'The Bedroom Years: Chasing a Sound That Never Quite Clicked',
        body: 'For years, Sebastian Markiewicz’s universe revolved around four-on-the-floor rhythms, tangled MIDI cables, and the relentless pursuit of a club-ready track. Like thousands of aspiring electronic artists, he spent countless hours hunched over a laptop, tweaking synth patches, mastering transitions, and uploading mixes to SoundCloud to the sound of polite, lukewarm applause.\n\nWhile his passion for underground house and progressive beats was undeniable, his output remained stubbornly middle-of-the-road. His DJ sets were functional rather than electric; his productions lacked the sonic punch required to break out of the bedroom circuit and onto festival stages. For a long time, it looked as though Sebastian was destined to remain another face in the crowded sea of hobbyist producers—grinding away in obscurity while waiting for a big break that never came.',
      },
      {
        heading: 'The Pivot: Trading Headphones for High Fashion',
        body: 'Everything changed when Sebastian realised that his strongest asset wasn’t his ear for arrangement, but his presence in front of a lens. What started as casual test shoots to create promotional artwork for his stalled music projects quickly caught the eye of fashion scouts and casting directors.\n\nStripping away the oversized hoodies and studio headphones revealed a striking frame, effortless poise, and an unselfconscious confidence that translated immediately on camera. Rather than fighting an uphill battle for dancefloor credibility, Sebastian leaned into the unexpected turn—trading the mixing desk for casting calls and intensive runway coaching.',
      },
      {
        heading: 'Owning the Paris Catwalks',
        body: 'Today, the lukewarm SoundCloud comments are a distant memory. Sebastian has carved out a thriving career in one of the most competitive corners of the fashion industry: high-end lingerie and intimate apparel.\n\nStepping onto the prestigious runways of Paris requires a rare blend of athleticism, vulnerability, and commanding stage presence—qualities Sebastian seems to have unlocked the moment he left the studio behind. Whether walking for avant-garde European lingerie houses or fronting sleek editorial campaigns, he brings a relaxed, magnetic energy to the catwalk that his music productions could never quite capture.',
      },
      {
        heading: 'What We Can Learn from Sebastian’s Leap',
        body: 'Sebastian Markiewicz’s story is a refreshing reminder that a "failed" chapter is often just the prelude to the right one:\n\n• Know when to pivot. Pouring years into a craft doesn’t mean you are locked into it forever. Recognising where your natural strengths lie can open doors you never planned to knock on.\n• Use every stepping stone. Without needing press photos for his music career, Sebastian might never have stepped in front of a professional camera in the first place.\n• Confidence is transferable. The nerve it takes to put your creative work out into the world—even when it falls flat—builds the exact resilience needed to command a runway in front of hundreds of critical eyes.\n\nHe may never headline Ibiza or top the Beatport charts, but under the bright lights of Paris, Sebastian Markiewicz has finally found his rhythm.',
      },
    ],
    linkedShootIds: [
      'shoot-sebastian-runway',
      'shoot-sebastian-athletic',
      'shoot-sebastian-skate-tee',
      'shoot-sebastian-crimson-noir',
    ],
  },
  {
    id: 'article-compatible-creative-runway',
    slug: 'compatible-creative-sebastian-markiewicz-catwalk-runway-notes',
    title: 'Compatible Creative & Markiewicz Creative Models: Walking the Runway',
    category: 'Runway',
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
    id: 'article-compatible-music-soundtrack',
    slug: 'compatible-music-sebastian-markiewicz-sound-and-runway',
    title: 'Compatible Music: Scoring Runway Presentations & Editorial Films',
    category: 'Compatible Music',
    metaDescription:
      'How Sebastian Markiewicz pairs Compatible Music albums, Beatport releases, and SoundCloud sessions with Compatible Creative fashion productions.',
    targetKeyword: 'Compatible Music',
    publishedAt: '2026-11-12',
    readTime: '4 min read',
    excerpt:
      'Connecting visual modeling work with original electronic sound design from Compatible Music across Compatible Creative UK, Beatport, and SoundCloud.',
    sections: [
      {
        heading: 'Sonic Identity Behind Compatible Creative',
        body: 'Alongside editorial and catwalk modeling with Markiewicz Creative Models, Sebastian Markiewicz produces electronic tracks and atmospheric scores under Compatible Music. Original tempo and bassline phrasing directly inform runway pacing and campaign film edits.',
      },
      {
        heading: 'Cross-Platform Discography & Creative Attribution',
        body: 'Listeners and creative directors can explore full album releases on compatiblecreative.co.uk/albums/compatible-music, DJ-ready catalog releases on Beatport, and live studio mixes on SoundCloud — uniting modeling and sound direction under one verified identity.',
      },
    ],
    linkedShootIds: ['shoot-sebastian-crimson-noir', 'shoot-sebastian-runway'],
  },
  {
    id: 'article-backlink-strategy-models',
    slug: 'building-authoritative-backlinks-compatible-creative',
    title: 'Editorial Direction & Casting with Markiewicz Creative Models',
    category: 'SEO & Backlinks',
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
  {
    id: 'article-studio-streetwear-casting',
    slug: 'high-key-studio-streetwear-casting-notes-sebastian-markiewicz',
    title: 'High-Key Streetwear & Chiaroscuro Portraiture Notes',
    category: 'Editorial',
    metaDescription:
      'Contrasting clean cyclorama streetwear portraits with graphic chiaroscuro studies in the Compatible Creative portfolio.',
    targetKeyword: 'Compatible Creative',
    publishedAt: '2026-10-08',
    readTime: '3 min read',
    excerpt:
      'Why modern casting books benefit from pairing unretouched high-key studio tests with bold graphic print direction.',
    sections: [
      {
        heading: 'Unretouched High-Key Tests for Commercial Bookings',
        body: 'Bookers and menswear stylists rely on neutral white-background portraits to evaluate proportions, skin tone, and apparel drape. Shooting direct-to-lens frames for Markiewicz Creative Models provides immediate clarity ahead of lookbook fittings.',
      },
      {
        heading: 'Graphic Print Contrast for Art & Music Crossovers',
        body: 'Paired against clean studio tests, high-contrast crimson and ink monographs echo the aesthetic world of Compatible Music artwork and nocturnal visual campaigns.',
      },
    ],
    linkedShootIds: ['shoot-sebastian-skate-tee', 'shoot-sebastian-crimson-noir'],
  },
];

export const DEFAULT_BACKLINKS: BacklinkTarget[] = [
  {
    id: 'bl-cc-uk',
    publicationName: 'Compatible Creative UK',
    targetUrl: 'https://www.compatiblecreative.co.uk/',
    domainFocus: 'Official Compatible Creative Multidisciplinary Flagship',
    pitchAngle: 'Primary brand hub linking modeling, art direction, and Compatible Music',
    emailSubject: 'Portfolio & Lookbook Sync — Sebastian Markiewicz (Compatible Creative)',
    emailBody:
      'Hello Compatible Creative Desk,\n\nSharing the updated digital comp card, blog articles, and runway archive for Sebastian Markiewicz (Markiewicz Creative Models) linked with compatiblecreative.co.uk.\n\nBest regards,\nSebastian Markiewicz\nCompatible Creative',
    status: 'Secured',
    securedBacklinkUrl: 'https://www.compatiblecreative.co.uk/',
    createdAt: '2026-11-10',
  },
  {
    id: 'bl-cc-music',
    publicationName: 'Compatible Music — Official Album Hub',
    targetUrl: 'https://www.compatiblecreative.co.uk/albums/compatible-music/',
    domainFocus: 'Original Compatible Music Releases & Runway Soundtracks',
    pitchAngle: 'Cross-linking sonic catalog with visual fashion direction',
    emailSubject: 'Audio & Runway Direction Feature — Compatible Music',
    emailBody:
      'Hello Music & Visuals Team,\n\nConnecting the Compatible Music album catalog with Sebastian Markiewicz runway and lookbook features.\n\nBest regards,\nSebastian Markiewicz',
    status: 'Secured',
    securedBacklinkUrl: 'https://www.compatiblecreative.co.uk/albums/compatible-music/',
    createdAt: '2026-11-12',
  },
  {
    id: 'bl-beatport',
    publicationName: 'Beatport Official Artist Profile',
    targetUrl: 'https://www.beatport.com/artist/sebastian-markiewicz/311129',
    domainFocus: 'Electronic Music Discography & Producer Authority',
    pitchAngle: 'Verified artist citation linking music releases and creative direction',
    emailSubject: 'Artist & Creative Profile Link — Sebastian Markiewicz',
    emailBody:
      'Verified Beatport artist catalog entry for Sebastian Markiewicz.',
    status: 'Secured',
    securedBacklinkUrl: 'https://www.beatport.com/artist/sebastian-markiewicz/311129',
    createdAt: '2026-11-14',
  },
  {
    id: 'bl-soundcloud',
    publicationName: 'SoundCloud — Sebastian Markiewicz',
    targetUrl: 'https://soundcloud.com/sebastianmarkiewicz',
    domainFocus: 'Live Mixes, Runway Audio & Compatible Music Previews',
    pitchAngle: 'Audio stream integration and cross-domain artist verification',
    emailSubject: 'Audio & Lookbook Link — Sebastian Markiewicz',
    emailBody:
      'Official SoundCloud stream hub for Sebastian Markiewicz and Compatible Music.',
    status: 'Secured',
    securedBacklinkUrl: 'https://soundcloud.com/sebastianmarkiewicz',
    createdAt: '2026-11-16',
  },
];
