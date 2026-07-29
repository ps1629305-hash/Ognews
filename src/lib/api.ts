import { Post, Category, Comment, Subscriber, AdConfig, SiteSettings, ContactMessage, AnalyticsSummary } from '../types';

async function handleResponse<T>(res: Response, defaultErrorMsg = 'Request failed'): Promise<T> {
  const contentType = res.headers.get('content-type') || '';
  let data: any = null;

  if (contentType.includes('application/json')) {
    try {
      data = await res.json();
    } catch {
      throw new Error(`Invalid JSON response from server (${res.status})`);
    }
  } else {
    const text = await res.text();
    if (!res.ok) {
      throw new Error(`Server returned error ${res.status}: ${text.slice(0, 100)}`);
    }
    throw new Error(`Expected JSON but server returned non-JSON content (${res.status})`);
  }

  if (!res.ok) {
    throw new Error(data?.error || defaultErrorMsg);
  }

  return data as T;
}

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
  return handleResponse<{ posts: Post[]; total: number; page: number; totalPages: number }>(res, 'Failed to fetch posts');
}

export async function fetchPostBySlug(slug: string): Promise<{ post: Post; related: Post[]; comments: Comment[] }> {
  const res = await fetch(`/api/posts/${encodeURIComponent(slug)}`);
  return handleResponse<{ post: Post; related: Post[]; comments: Comment[] }>(res, 'Post not found');
}

export async function createPost(postData: Partial<Post>): Promise<{ success: boolean; post: Post }> {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
  return handleResponse<{ success: boolean; post: Post }>(res, 'Failed to create post');
}

export async function updatePost(id: string, postData: Partial<Post>): Promise<{ success: boolean; post: Post }> {
  const res = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
  return handleResponse<{ success: boolean; post: Post }>(res, 'Failed to update post');
}

export async function deletePost(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
  return handleResponse<{ success: boolean }>(res, 'Failed to delete post');
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch('/api/categories');
  return handleResponse<Category[]>(res, 'Failed to fetch categories');
}

export async function createCategory(cat: { name: string; description?: string; color?: string; icon?: string }): Promise<{ success: boolean; category: Category }> {
  const res = await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cat),
  });
  return handleResponse<{ success: boolean; category: Category }>(res, 'Failed to create category');
}

export async function deleteCategory(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
  return handleResponse<{ success: boolean }>(res, 'Failed to delete category');
}

export async function fetchComments(postId?: string): Promise<Comment[]> {
  const url = postId ? `/api/comments?postId=${encodeURIComponent(postId)}` : '/api/comments';
  const res = await fetch(url);
  return handleResponse<Comment[]>(res, 'Failed to fetch comments');
}

export async function submitComment(data: { postId: string; authorName: string; authorEmail: string; content: string; parentId?: string | null }): Promise<{ success: boolean; comment: Comment; message: string }> {
  const res = await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<{ success: boolean; comment: Comment; message: string }>(res, 'Failed to submit comment');
}

export async function moderateComment(id: string, status: 'approved' | 'spam'): Promise<{ success: boolean }> {
  const res = await fetch(`/api/comments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return handleResponse<{ success: boolean }>(res, 'Failed to update comment');
}

export async function deleteComment(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
  return handleResponse<{ success: boolean }>(res, 'Failed to delete comment');
}

export async function subscribeNewsletter(email: string, name?: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/subscribers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name }),
  });
  return handleResponse<{ success: boolean; message: string }>(res, 'Failed to subscribe');
}

export async function fetchSubscribers(): Promise<Subscriber[]> {
  const res = await fetch('/api/subscribers');
  return handleResponse<Subscriber[]>(res, 'Failed to fetch subscribers');
}

export async function sendContactMessage(data: { name: string; email: string; subject?: string; message: string }): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<{ success: boolean; message: string }>(res, 'Failed to send message');
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const res = await fetch('/api/contact');
  return handleResponse<ContactMessage[]>(res, 'Failed to fetch contact messages');
}

export async function fetchSettings(): Promise<SiteSettings> {
  const res = await fetch('/api/settings');
  return handleResponse<SiteSettings>(res, 'Failed to fetch settings');
}

export async function updateSettings(settings: Partial<SiteSettings>): Promise<{ success: boolean; settings: SiteSettings }> {
  const res = await fetch('/api/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  return handleResponse<{ success: boolean; settings: SiteSettings }>(res, 'Failed to update settings');
}

export async function fetchAdsConfig(): Promise<AdConfig> {
  const res = await fetch('/api/ads');
  return handleResponse<AdConfig>(res, 'Failed to fetch ads config');
}

export async function updateAdsConfig(ads: Partial<AdConfig>): Promise<{ success: boolean; ads: AdConfig }> {
  const res = await fetch('/api/ads', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ads),
  });
  return handleResponse<{ success: boolean; ads: AdConfig }>(res, 'Failed to update ads config');
}

export async function fetchAnalytics(): Promise<AnalyticsSummary> {
  const res = await fetch('/api/analytics');
  return handleResponse<AnalyticsSummary>(res, 'Failed to fetch analytics');
}

export async function generateAIArticle(prompt: string, type: 'article' | 'seo', category?: string): Promise<{ success: boolean; result: any }> {
  const res = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, type, category }),
  });
  return handleResponse<{ success: boolean; result: any }>(res, 'AI generation failed');
}

export async function exportPHPPackage(): Promise<{ success: boolean; schemaSql: string; dbPhp: string; instructions: string[] }> {
  const res = await fetch('/api/export/php');
  return handleResponse<{ success: boolean; schemaSql: string; dbPhp: string; instructions: string[] }>(res, 'Failed to export PHP package');
}

export async function adminLogin(email: string, password: string): Promise<{ success: boolean; token: string; user: any }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<{ success: boolean; token: string; user: any }>(res, 'Login failed');
}

export const updateAdConfig = updateAdsConfig;
export const fetchAdConfig = fetchAdsConfig;
export const fetchPHPExport = exportPHPPackage;
