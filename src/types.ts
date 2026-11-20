export type ShootCategory = 'Runway' | 'Campaign' | 'Editorial' | 'Creative Direction';

export interface ModelMeasurements {
  height: string;
  bust: string;
  waist: string;
  hips: string;
  shoe: string;
  hair: string;
  eyes: string;
}

export interface ExternalWorkLink {
  id: string;
  title: string;
  subtitle: string;
  domain: string;
  url: string;
  category: 'Studio & Direction' | 'Album Release' | 'Streaming & Catalog' | 'Audio Archive';
  description: string;
}

export interface ModelProfile {
  name: string;
  tagline: string;
  location: string;
  agency: string;
  logoUrl: string;
  email: string;
  bio: string;
  heroHeadline: string;
  heroImage: string;
  seoTitle: string;
  seoDescription: string;
  targetKeywords: string[];
  sameAs: string[];
  measurements: ModelMeasurements;
  campaignCount: string;
}

export interface PortfolioShoot {
  id: string;
  title: string;
  category: ShootCategory;
  year: string;
  publication: string;
  photographer: string;
  location: string;
  imageUrl: string;
  aspectSpan: 'feature' | 'standard';
  altText: string;
  caption: string;
  seoKeywords: string[];
  cameraNotes?: string;
}

export interface JournalSection {
  heading: string;
  body: string;
}

export interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  category?: string;
  metaDescription: string;
  targetKeyword: string;
  publishedAt: string;
  readTime: string;
  excerpt: string;
  sections: JournalSection[];
  linkedShootIds: string[];
}

export type BacklinkStatus = 'Drafted' | 'Sent' | 'Secured';

export interface GroundingSource {
  title: string;
  url: string;
}

export interface BacklinkTarget {
  id: string;
  publicationName: string;
  targetUrl: string;
  domainFocus: string;
  pitchAngle: string;
  emailSubject: string;
  emailBody: string;
  status: BacklinkStatus;
  securedBacklinkUrl?: string;
  createdAt: string;
  sources?: GroundingSource[];
}

export interface SeoAuditFinding {
  id: string;
  area: string;
  priority: 'High' | 'Medium' | 'Low';
  issue: string;
  recommendation: string;
  actionType: 'update_title' | 'update_description' | 'add_keywords' | 'update_shoot_alt' | 'general';
  targetId?: string;
  suggestedValue?: string;
}

export interface SeoAuditResult {
  summary: string;
  optimizedTitle: string;
  optimizedMetaDescription: string;
  recommendedKeywords: string[];
  findings: SeoAuditFinding[];
}

export interface BookingInquiry {
  clientName: string;
  brandOrAgency: string;
  email: string;
  shootType: string;
  dates: string;
  location: string;
  brief: string;
}
