export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  categoryId: string;
  categoryName?: string;
  tags: string[];
  author: {
    id: string;
    name: string;
    avatar: string;
    role: string;
    bio?: string;
  };
  status: 'published' | 'draft' | 'scheduled';
  featured: boolean;
  trending: boolean;
  viewsCount: number;
  readTimeMinutes: number;
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  publishedAt: string;
  updatedAt: string;
  commentsCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon?: string;
  postCount?: number;
}

export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'spam';
  parentId?: string | null;
  replies?: Comment[];
}

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed';
  subscribedAt: string;
}

export interface AdConfig {
  enabled: boolean;
  googleAdSenseClientId: string;
  headerBanner: {
    enabled: boolean;
    slotId: string;
    customCode?: string;
  };
  inArticleTop: {
    enabled: boolean;
    slotId: string;
    customCode?: string;
  };
  inArticleBottom: {
    enabled: boolean;
    slotId: string;
    customCode?: string;
  };
  sidebarBanner: {
    enabled: boolean;
    slotId: string;
    customCode?: string;
  };
  footerBanner: {
    enabled: boolean;
    slotId: string;
    customCode?: string;
  };
  showAdLabels: boolean;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  siteUrl: string;
  logoText: string;
  logoUrl?: string;
  faviconUrl?: string;
  adminEmail: string;
  defaultAuthorName: string;
  defaultAuthorBio: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    github?: string;
  };
  customHeaderCode?: string;
  customFooterCode?: string;
  cookieConsentText: string;
  allowComments: boolean;
  requireCommentApproval: boolean;
  postsPerPage: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface AnalyticsSummary {
  totalPosts: number;
  totalViews: number;
  totalComments: number;
  totalSubscribers: number;
  pendingCommentsCount: number;
  estimatedAdEarnings: number;
  dailyTraffic: { date: string; views: number; visitors: number }[];
  categoryDistribution: { category: string; count: number }[];
  topPosts: { title: string; views: number; slug: string }[];
}
