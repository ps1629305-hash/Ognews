import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_POSTS,
  INITIAL_CATEGORIES,
  INITIAL_COMMENTS,
  INITIAL_SUBSCRIBERS,
  INITIAL_ADS_CONFIG,
  INITIAL_SETTINGS,
  INITIAL_CONTACT_MESSAGES,
} from './src/data/initialData';
import { Post, Category, Comment, Subscriber, AdConfig, SiteSettings, ContactMessage } from './src/types';

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'data_db.json');

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Database State Management
let dbData = {
  posts: INITIAL_POSTS,
  categories: INITIAL_CATEGORIES,
  comments: INITIAL_COMMENTS,
  subscribers: INITIAL_SUBSCRIBERS,
  ads: INITIAL_ADS_CONFIG,
  settings: INITIAL_SETTINGS,
  messages: INITIAL_CONTACT_MESSAGES,
  analytics: {
    dailyTraffic: [
      { date: '2026-07-23', views: 3200, visitors: 1850 },
      { date: '2026-07-24', views: 4100, visitors: 2200 },
      { date: '2026-07-25', views: 3800, visitors: 1980 },
      { date: '2026-07-26', views: 5400, visitors: 3100 },
      { date: '2026-07-27', views: 6200, visitors: 3450 },
      { date: '2026-07-28', views: 7800, visitors: 4200 },
      { date: '2026-07-29', views: 8900, visitors: 4900 },
    ],
  },
};

// Load DB from persistent file if exists
function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      dbData = { ...dbData, ...parsed };
      dbData.ads = INITIAL_ADS_CONFIG;
      if (dbData.settings) {
        dbData.settings.siteUrl = 'https://ognews.com';
        dbData.settings.siteName = 'OG News';
        dbData.settings.logoText = 'OG News';
      }
      console.log('[DB] Loaded stored data from file.');
    }
  } catch (err) {
    console.error('[DB] Error loading file DB:', err);
  }
}

// Save DB
function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Error saving file DB:', err);
  }
}

loadDB();

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // CORS & Security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // --- API ENDPOINTS ---

  // Auth / Admin Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    // Default admin credentials (matches requirement: Ps1629305@gmail.com)
    if (
      (email === 'Ps1629305@gmail.com' || email === dbData.settings.adminEmail) &&
      (password === 'admin123' || password === 'admin')
    ) {
      const token = crypto.randomBytes(32).toString('hex');
      return res.json({
        success: true,
        token,
        user: {
          email: dbData.settings.adminEmail,
          name: 'Super Admin',
          role: 'administrator',
        },
      });
    }
    return res.status(401).json({ success: false, error: 'Invalid email or password.' });
  });

  // GET /api/posts - Get posts with filters & pagination
  app.get('/api/posts', (req: Request, res: Response) => {
    let posts = Array.isArray(dbData.posts) ? [...dbData.posts] : [];
    const { category, tag, search, status, featured, trending, page = '1', limit = '10' } = req.query;

    if (status && status !== 'all') {
      posts = posts.filter((p) => p.status === status);
    } else if (!status) {
      // By default public API shows published posts
      posts = posts.filter((p) => p.status === 'published');
    }

    if (category && category !== 'all') {
      posts = posts.filter(
        (p) => p.categoryId === category || p.categoryName?.toLowerCase() === (category as string).toLowerCase()
      );
    }

    if (tag) {
      posts = posts.filter((p) => (p.tags || []).some((t) => t.toLowerCase() === (tag as string).toLowerCase()));
    }

    if (featured === 'true') {
      posts = posts.filter((p) => p.featured);
    }

    if (trending === 'true') {
      posts = posts.filter((p) => p.trending);
    }

    if (search) {
      const q = (search as string).toLowerCase();
      posts = posts.filter(
        (p) =>
          (p.title || '').toLowerCase().includes(q) ||
          (p.excerpt || '').toLowerCase().includes(q) ||
          (p.content || '').toLowerCase().includes(q) ||
          (p.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort by publishedAt desc
    posts.sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const startIndex = (pageNum - 1) * limitNum;
    const total = posts.length;
    const paginatedPosts = posts.slice(startIndex, startIndex + limitNum);

    res.json({
      posts: paginatedPosts,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    });
  });

  // GET /api/posts/:slug - Get single post by slug & increment views
  app.get('/api/posts/:slug', (req: Request, res: Response) => {
    const slug = req.params.slug;
    if (!Array.isArray(dbData.posts)) dbData.posts = [];
    const postIndex = dbData.posts.findIndex((p) => p.slug === slug || p.id === slug);

    if (postIndex === -1) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment views
    if (typeof dbData.posts[postIndex].viewsCount !== 'number') {
      dbData.posts[postIndex].viewsCount = 0;
    }
    dbData.posts[postIndex].viewsCount += 1;
    saveDB();

    const post = dbData.posts[postIndex];

    // Find related posts in same category or matching tags
    const postTags = post.tags || [];
    const related = dbData.posts
      .filter((p) => p.id !== post.id && p.status === 'published' && (p.categoryId === post.categoryId || (p.tags || []).some(t => postTags.includes(t))))
      .slice(0, 3);

    // Get approved comments
    const comments = (dbData.comments || []).filter((c) => c.postId === post.id && c.status === 'approved');

    res.json({
      post,
      related,
      comments,
    });
  });

  // POST /api/posts - Create post (Admin)
  app.post('/api/posts', (req: Request, res: Response) => {
    const postData: Partial<Post> = req.body;
    if (!postData.title || !postData.content) {
      return res.status(400).json({ error: 'Title and Content are required.' });
    }

    if (!Array.isArray(dbData.categories)) dbData.categories = [];
    const defaultCat = dbData.categories[0] || { id: 'cat-tech', name: 'Technology' };
    const category = (postData.categoryId ? dbData.categories.find((c) => c.id === postData.categoryId) : null) || defaultCat;
    
    let rawSlug = (postData.slug && typeof postData.slug === 'string' && postData.slug.trim()) || postData.title;
    let slug = rawSlug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    if (!slug) slug = 'post-' + Date.now();

    if (!Array.isArray(dbData.posts)) dbData.posts = [];
    let finalSlug = slug;
    let counter = 1;
    while (dbData.posts.some((p) => p.slug === finalSlug)) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    const newPost: Post = {
      id: 'post-' + Date.now(),
      title: postData.title,
      slug: finalSlug,
      content: postData.content,
      excerpt: postData.excerpt || postData.content.replace(/<[^>]*>?/gm, '').slice(0, 160) + '...',
      featuredImage:
        postData.featuredImage ||
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      categoryId: category.id,
      categoryName: category.name,
      tags: Array.isArray(postData.tags) && postData.tags.length > 0 ? postData.tags : ['Technology'],
      author: postData.author || {
        id: 'auth-1',
        name: dbData.settings?.defaultAuthorName || 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        role: 'Chief Editor',
      },
      status: postData.status || 'published',
      featured: Boolean(postData.featured),
      trending: Boolean(postData.trending),
      viewsCount: 0,
      readTimeMinutes: Math.max(1, Math.ceil(postData.content.split(' ').length / 200)),
      seoTitle: postData.seoTitle || postData.title,
      metaDescription: postData.metaDescription || postData.excerpt || postData.title,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dbData.posts.unshift(newPost);
    saveDB();
    res.json({ success: true, post: newPost });
  });

  // PUT /api/posts/:id - Update post (Admin)
  app.put('/api/posts/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    if (!Array.isArray(dbData.posts)) dbData.posts = [];
    const postIndex = dbData.posts.findIndex((p) => p.id === id);

    if (postIndex === -1) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (!Array.isArray(dbData.categories)) dbData.categories = [];
    const defaultCat = dbData.categories[0] || { id: 'cat-tech', name: 'Technology' };
    const category = (req.body.categoryId ? dbData.categories.find((c) => c.id === req.body.categoryId) : null) || defaultCat;

    let newSlug = dbData.posts[postIndex].slug;
    if (req.body.slug && typeof req.body.slug === 'string' && req.body.slug.trim()) {
      let cleaned = req.body.slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      if (cleaned) newSlug = cleaned;
    }

    const updatedPost: Post = {
      ...dbData.posts[postIndex],
      ...req.body,
      slug: newSlug,
      categoryId: category ? category.id : dbData.posts[postIndex].categoryId,
      categoryName: category ? category.name : dbData.posts[postIndex].categoryName,
      tags: Array.isArray(req.body.tags) && req.body.tags.length > 0 ? req.body.tags : dbData.posts[postIndex].tags || ['Technology'],
      readTimeMinutes: req.body.content
        ? Math.max(1, Math.ceil(req.body.content.split(' ').length / 200))
        : dbData.posts[postIndex].readTimeMinutes,
      updatedAt: new Date().toISOString(),
    };

    dbData.posts[postIndex] = updatedPost;
    saveDB();
    res.json({ success: true, post: updatedPost });
  });

  // DELETE /api/posts/:id - Delete post (Admin)
  app.delete('/api/posts/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    dbData.posts = dbData.posts.filter((p) => p.id !== id);
    dbData.comments = dbData.comments.filter((c) => c.postId !== id);
    saveDB();
    res.json({ success: true });
  });

  // GET /api/categories
  app.get('/api/categories', (req: Request, res: Response) => {
    // Dynamically calculate post counts
    const categoriesWithCount = dbData.categories.map((c) => ({
      ...c,
      postCount: dbData.posts.filter((p) => p.categoryId === c.id && p.status === 'published').length,
    }));
    res.json(categoriesWithCount);
  });

  // POST /api/categories - Create category
  app.post('/api/categories', (req: Request, res: Response) => {
    const { name, description, color, icon } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required.' });

    const newCat: Category = {
      id: 'cat-' + Date.now(),
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description || '',
      color: color || '#3B82F6',
      icon: icon || 'Folder',
      postCount: 0,
    };

    dbData.categories.push(newCat);
    saveDB();
    res.json({ success: true, category: newCat });
  });

  // DELETE /api/categories/:id
  app.delete('/api/categories/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    dbData.categories = dbData.categories.filter((c) => c.id !== id);
    saveDB();
    res.json({ success: true });
  });

  // GET & POST /api/comments
  app.get('/api/comments', (req: Request, res: Response) => {
    res.json(dbData.comments);
  });

  app.post('/api/comments', (req: Request, res: Response) => {
    const { postId, authorName, authorEmail, content, parentId } = req.body;
    if (!postId || !authorName || !content) {
      return res.status(400).json({ error: 'Name, email and comment content are required.' });
    }

    const newComment: Comment = {
      id: 'comm-' + Date.now(),
      postId,
      authorName,
      authorEmail: authorEmail || 'anonymous@reader.com',
      authorAvatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(authorName)}`,
      content,
      createdAt: new Date().toISOString(),
      status: dbData.settings.requireCommentApproval ? 'pending' : 'approved',
      parentId: parentId || null,
    };

    dbData.comments.unshift(newComment);
    saveDB();

    res.json({
      success: true,
      comment: newComment,
      message: dbData.settings.requireCommentApproval
        ? 'Your comment has been submitted and is awaiting moderation.'
        : 'Your comment has been published!',
    });
  });

  // PUT /api/comments/:id - Moderate comment
  app.put('/api/comments/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const { status } = req.body;
    const index = dbData.comments.findIndex((c) => c.id === id);

    if (index !== -1) {
      dbData.comments[index].status = status;
      saveDB();
      return res.json({ success: true });
    }
    res.status(404).json({ error: 'Comment not found' });
  });

  // DELETE /api/comments/:id
  app.delete('/api/comments/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    dbData.comments = dbData.comments.filter((c) => c.id !== id);
    saveDB();
    res.json({ success: true });
  });

  // GET & POST /api/subscribers
  app.get('/api/subscribers', (req: Request, res: Response) => {
    res.json(dbData.subscribers);
  });

  app.post('/api/subscribers', (req: Request, res: Response) => {
    const { email, name } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const existing = dbData.subscribers.find((s) => s.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.json({ success: true, message: 'You are already subscribed to our newsletter!' });
    }

    const newSub: Subscriber = {
      id: 'sub-' + Date.now(),
      email,
      name: name || '',
      status: 'active',
      subscribedAt: new Date().toISOString(),
    };

    dbData.subscribers.unshift(newSub);
    saveDB();
    res.json({ success: true, message: 'Thank you for subscribing to Daily News!' });
  });

  // GET & POST /api/contact
  app.get('/api/contact', (req: Request, res: Response) => {
    res.json(dbData.messages);
  });

  app.post('/api/contact', (req: Request, res: Response) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required.' });
    }

    const newMsg: ContactMessage = {
      id: 'msg-' + Date.now(),
      name,
      email,
      subject: subject || 'General Inquiry',
      message,
      createdAt: new Date().toISOString(),
      read: false,
    };

    dbData.messages.unshift(newMsg);
    saveDB();
    res.json({ success: true, message: 'Your message has been sent successfully. We will reply shortly!' });
  });

  // GET & PUT /api/settings
  app.get('/api/settings', (req: Request, res: Response) => {
    res.json(dbData.settings);
  });

  app.put('/api/settings', (req: Request, res: Response) => {
    dbData.settings = { ...dbData.settings, ...req.body };
    saveDB();
    res.json({ success: true, settings: dbData.settings });
  });

  // GET & PUT /api/ads
  app.get('/api/ads', (req: Request, res: Response) => {
    res.json(dbData.ads);
  });

  app.put('/api/ads', (req: Request, res: Response) => {
    dbData.ads = { ...dbData.ads, ...req.body };
    saveDB();
    res.json({ success: true, ads: dbData.ads });
  });

  // GET /api/analytics - Dashboard metrics
  app.get('/api/analytics', (req: Request, res: Response) => {
    const totalPosts = dbData.posts.length;
    const totalViews = dbData.posts.reduce((sum, p) => sum + p.viewsCount, 0);
    const totalComments = dbData.comments.length;
    const totalSubscribers = dbData.subscribers.length;
    const pendingCommentsCount = dbData.comments.filter((c) => c.status === 'pending').length;

    // Simulated earnings based on views ($1.50 RPM)
    const estimatedAdEarnings = Number(((totalViews / 1000) * 1.5).toFixed(2));

    const categoryDistribution = dbData.categories.map((c) => ({
      category: c.name,
      count: dbData.posts.filter((p) => p.categoryId === c.id).length,
    }));

    const topPosts = [...dbData.posts]
      .sort((a, b) => b.viewsCount - a.viewsCount)
      .slice(0, 5)
      .map((p) => ({ title: p.title, views: p.viewsCount, slug: p.slug }));

    res.json({
      totalPosts,
      totalViews,
      totalComments,
      totalSubscribers,
      pendingCommentsCount,
      estimatedAdEarnings,
      dailyTraffic: dbData.analytics.dailyTraffic,
      categoryDistribution,
      topPosts,
    });
  });

  // POST /api/ai/generate - Gemini AI Post Draft & SEO Generator
  app.post('/api/ai/generate', async (req: Request, res: Response) => {
    try {
      const { prompt, type, category } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({ error: 'GEMINI_API_KEY is not configured in environment.' });
      }

      let systemInstruction = '';
      if (type === 'seo') {
        systemInstruction =
          'You are an SEO specialist. Generate an SEO-friendly title (under 60 chars) and meta description (under 160 chars) along with 5 suggested tags as a JSON object: {"seoTitle": "...", "metaDescription": "...", "tags": ["..."]}';
      } else {
        systemInstruction =
          'You are a professional tech journalist writing for Daily News. Generate a complete high quality blog article in clean HTML format with h2 headings, paragraphs, bullet points, and an excerpt. Return JSON: {"title": "...", "excerpt": "...", "content": "...", "seoTitle": "...", "metaDescription": "...", "tags": ["..."]}';
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });

      const text = response.text;
      const parsed = JSON.parse(text || '{}');
      return res.json({ success: true, result: parsed });
    } catch (err: any) {
      console.error('[Gemini API Error]:', err);
      return res.status(500).json({ error: err.message || 'Failed to generate AI content.' });
    }
  });

  // Dynamic /sitemap.xml
  app.get('/sitemap.xml', (req: Request, res: Response) => {
    const baseUrl = dbData.settings.siteUrl || 'https://ais-dev-qx2jgq2mxeklhc7s3hntbs-279455774252.asia-southeast1.run.app';
    const posts = dbData.posts.filter((p) => p.status === 'published');

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    const staticPages = ['', '/about', '/contact', '/privacy-policy', '/terms', '/disclaimer', '/cookie-policy'];
    staticPages.forEach((p) => {
      xml += `  <url>\n    <loc>${baseUrl}${p}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${p === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
    });

    // Categories
    dbData.categories.forEach((cat) => {
      xml += `  <url>\n    <loc>${baseUrl}/category/${cat.slug}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    // Posts
    posts.forEach((post) => {
      xml += `  <url>\n    <loc>${baseUrl}/post/${post.slug}</loc>\n    <lastmod>${new Date(post.updatedAt).toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.send(xml);
  });

  // Dynamic /robots.txt
  app.get('/robots.txt', (req: Request, res: Response) => {
    const baseUrl = dbData.settings.siteUrl || 'https://ais-dev-qx2jgq2mxeklhc7s3hntbs-279455774252.asia-southeast1.run.app';
    const robots = `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${baseUrl}/sitemap.xml`;
    res.setHeader('Content-Type', 'text/plain');
    res.send(robots);
  });

  // GET /api/export/php - Returns complete PHP 8 + MySQL package source strings
  app.get('/api/export/php', (req: Request, res: Response) => {
    const schemaSql = `
-- ==========================================
-- ApexPulse News Platform - MySQL Database Schema
-- Compatible with PHP 8.x + MySQL 8 / MariaDB
-- ==========================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS subscribers;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS admins;
SET FOREIGN_KEY_CHECKS = 1;

-- Categories Table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(20) DEFAULT '#3B82F6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Posts Table
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content LONGTEXT NOT NULL,
    featured_image VARCHAR(500),
    category_id INT,
    tags VARCHAR(500),
    author_name VARCHAR(100) DEFAULT 'Alex Rivera',
    status ENUM('published', 'draft') DEFAULT 'published',
    featured TINYINT(1) DEFAULT 0,
    trending TINYINT(1) DEFAULT 0,
    views_count INT DEFAULT 0,
    read_time INT DEFAULT 5,
    seo_title VARCHAR(255),
    meta_description TEXT,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comments Table
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status ENUM('pending', 'approved', 'spam') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Subscribers Table
CREATE TABLE subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin Users Table
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Admin User (Email: Ps1629305@gmail.com, Pass: admin123)
INSERT INTO admins (email, password_hash) VALUES 
('Ps1629305@gmail.com', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHe1mN14W2J/C4aX5H2uE5iR1.4QdZ9L6m');

-- Seed Categories
INSERT INTO categories (name, slug, description, color) VALUES
('Technology', 'technology', 'Latest innovations, gadgets and tech news.', '#3B82F6'),
('Artificial Intelligence', 'artificial-intelligence', 'LLMs, generative models and machine learning.', '#8B5CF6'),
('Cyber Security', 'cyber-security', 'Data security, privacy and threat intelligence.', '#EF4444');
`;

    const dbPhp = `<?php
// db.php - Database connection helper using PDO prepared statements
$host = 'localhost';
$db   = 'apexpulse_news';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\\PDOException $e) {
     throw new \\PDOException($e->getMessage(), (int)$e->getCode());
}
?>`;

    res.json({
      success: true,
      schemaSql,
      dbPhp,
      instructions: [
        '1. Create a MySQL database named "apexpulse_news" in cPanel / phpMyAdmin.',
        '2. Import the provided schemaSql into phpMyAdmin.',
        '3. Update database credentials in db.php ($host, $db, $user, $pass).',
        '4. Upload frontend bundle or PHP index scripts to public_html.',
        '5. Admin email initialized to Ps1629305@gmail.com.',
      ],
    });
  });

  // Vite Middleware for Dev or Static Files for Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Daily News Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
