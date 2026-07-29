import { Post, Category, Comment, Subscriber, AdConfig, SiteSettings, ContactMessage, AnalyticsSummary } from '../types';

export async function fetchPosts(params?: {
  category?: string;
  tag?: string;
  search?: string;
  status?: string;
  featured?: boolean;
  trending?: boolean;
  page?: number;
  limit?: number;
}): Promise<{ posts: Post[]; total: number; page: number; totalPages: number }> {
  const query = new URLSearchParams();
  if (params?.category) query.append('category', params.category);
  if (params?.tag) query.append('tag', params.tag);
  if (params?.search) query.append('search', params.search);
  if (params?.status) query.append('status', params.status);
  if (params?.featured) query.append('featured', 'true');
  if (params?.trending) query.append('trending', 'true');
  if (params?.page) query.append('page', params.page.toString());
  if (params?.limit) query.append('limit', params.limit.toString());

  const res = await fetch(`/api/posts?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export async function fetchPostBySlug(slug: string): Promise<{ post: Post; related: Post[]; comments: Comment[] }> {
  const res = await fetch(`/api/posts/${encodeURIComponent(slug)}`);
  if (!res.ok) throw new Error('Post not found');
  return res.json();
}

export async function createPost(postData: Partial<Post>): Promise<{ success: boolean; post: Post }> {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
  if (!res.ok) throw new Error('Failed to create post');
  return res.json();
}

export async function updatePost(id: string, postData: Partial<Post>): Promise<{ success: boolean; post: Post }> {
  const res = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
  if (!res.ok) throw new Error('Failed to update post');
  return res.json();
}

export async function deletePost(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete post');
  return res.json();
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch('/api/categories');
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function createCategory(cat: { name: string; description?: string; color?: string; icon?: string }): Promise<{ success: boolean; category: Category }> {
  const res = await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cat),
  });
  if (!res.ok) throw new Error('Failed to create category');
  return res.json();
}

export async function deleteCategory(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete category');
  return res.json();
}

export async function fetchComments(postId?: string): Promise<Comment[]> {
  const url = postId ? `/api/comments?postId=${encodeURIComponent(postId)}` : '/api/comments';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch comments');
  return res.json();
}

export async function submitComment(data: { postId: string; authorName: string; authorEmail: string; content: string; parentId?: string | null }): Promise<{ success: boolean; comment: Comment; message: string }> {
  const res = await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to submit comment');
  return res.json();
}

export async function moderateComment(id: string, status: 'approved' | 'spam'): Promise<{ success: boolean }> {
  const res = await fetch(`/api/comments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update comment');
  return res.json();
}

export async function deleteComment(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete comment');
  return res.json();
}

export async function subscribeNewsletter(email: string, name?: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/subscribers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to subscribe');
  return data;
}

export async function fetchSubscribers(): Promise<Subscriber[]> {
  const res = await fetch('/api/subscribers');
  if (!res.ok) throw new Error('Failed to fetch subscribers');
  return res.json();
}

export async function sendContactMessage(data: { name: string; email: string; subject?: string; message: string }): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await res.json();
  if (!res.ok) throw new Error(resData.error || 'Failed to send message');
  return resData;
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const res = await fetch('/api/contact');
  if (!res.ok) throw new Error('Failed to fetch contact messages');
  return res.json();
}

export async function fetchSettings(): Promise<SiteSettings> {
  const res = await fetch('/api/settings');
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
}

export async function updateSettings(settings: Partial<SiteSettings>): Promise<{ success: boolean; settings: SiteSettings }> {
  const res = await fetch('/api/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
}

export async function fetchAdsConfig(): Promise<AdConfig> {
  const res = await fetch('/api/ads');
  if (!res.ok) throw new Error('Failed to fetch ads config');
  return res.json();
}

export async function updateAdsConfig(ads: Partial<AdConfig>): Promise<{ success: boolean; ads: AdConfig }> {
  const res = await fetch('/api/ads', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ads),
  });
  if (!res.ok) throw new Error('Failed to update ads config');
  return res.json();
}

export async function fetchAnalytics(): Promise<AnalyticsSummary> {
  const res = await fetch('/api/analytics');
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export async function generateAIArticle(prompt: string, type: 'article' | 'seo', category?: string): Promise<{ success: boolean; result: any }> {
  const res = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, type, category }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'AI generation failed');
  return data;
}

export async function exportPHPPackage(): Promise<{ success: boolean; schemaSql: string; dbPhp: string; instructions: string[] }> {
  const res = await fetch('/api/export/php');
  if (!res.ok) throw new Error('Failed to export PHP package');
  return res.json();
}

export async function adminLogin(email: string, password: string): Promise<{ success: boolean; token: string; user: any }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export const updateAdConfig = updateAdsConfig;
export const fetchAdConfig = fetchAdsConfig;
export const fetchPHPExport = exportPHPPackage;

