import React, { useState, useEffect } from 'react';
import { Post, Category, AdConfig, SiteSettings, Comment } from './types';
import {
  fetchPosts,
  fetchPostBySlug,
  fetchCategories,
  fetchAdConfig,
  fetchSettings,
  fetchComments,
} from './lib/api';

import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PostCard } from './components/PostCard';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { AdBanner } from './components/AdBanner';
import { PostDetail } from './components/PostDetail';
import { PagesViewer } from './components/PagesViewer';
import { SearchFilterModal } from './components/SearchFilterModal';
import { CookieBanner } from './components/CookieBanner';
import { SEOMeta } from './components/SEOMeta';

import { AdminLogin } from './components/admin/AdminLogin';
import { AdminPortal } from './components/admin/AdminPortal';
import { Bookmark, RefreshCw, Flame, Sparkles, Filter } from 'lucide-react';

export function App() {
  // Global Data State
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [adsConfig, setAdsConfig] = useState<AdConfig | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Navigation / View State
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPostSlug, setSelectedPostSlug] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [postComments, setPostComments] = useState<Comment[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);

  // Theme & Modals
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('apexpulse_theme') === 'dark';
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('apexpulse_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  // Admin CMS State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('apexpulse_admin_token');
  });

  // Load initial global site data
  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [postsRes, catsRes, adsRes, setRes] = await Promise.all([
        fetchPosts({ limit: 30 }),
        fetchCategories(),
        fetchAdConfig(),
        fetchSettings(),
      ]);

      setPosts(postsRes.posts);
      setCategories(catsRes);
      setAdsConfig(adsRes);
      setSettings(setRes);
    } catch (err: any) {
      console.error('Error initializing site data:', err);
      setError(err.message || 'Failed to connect to backend service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Handle Dark Mode CSS Class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('apexpulse_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('apexpulse_theme', 'light');
    }
  }, [isDarkMode]);

  // Load Post Detail when slug changes
  useEffect(() => {
    if (selectedPostSlug) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      fetchPostBySlug(selectedPostSlug)
        .then(async (data) => {
          if (data && data.post) {
            setCurrentPost(data.post);
            setPostComments(data.comments || []);
            if (data.related && data.related.length > 0) {
              setRelatedPosts(data.related);
            } else if (data.post.categoryId) {
              const rels = await fetchPosts({ category: data.post.categoryId, limit: 4 });
              setRelatedPosts(rels.posts.filter((r) => r.id !== data.post.id).slice(0, 3));
            } else {
              setRelatedPosts([]);
            }
          }
        })
        .catch((err) => console.error(err));
    } else {
      setCurrentPost(null);
    }
  }, [selectedPostSlug]);

  const handleRefreshPostComments = () => {
    if (currentPost) {
      fetchComments(currentPost.id).then((comms) => setPostComments(comms));
    }
  };

  // Toggle Bookmark
  const handleToggleBookmark = (post: Post) => {
    const exists = bookmarkedPosts.some((b) => b.id === post.id);
    let updated: Post[];
    if (exists) {
      updated = bookmarkedPosts.filter((b) => b.id !== post.id);
    } else {
      updated = [...bookmarkedPosts, post];
    }
    setBookmarkedPosts(updated);
    localStorage.setItem('apexpulse_bookmarks', JSON.stringify(updated));
  };

  // Select Category Reset
  const handleSelectCategory = (catId: string | null) => {
    setSelectedCategory(catId);
    setSelectedPostSlug(null);
    setSelectedPage(null);
    setShowBookmarksOnly(false);
    setActiveTagFilter(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPost = (slug: string) => {
    setSelectedPostSlug(slug);
    setSelectedPage(null);
  };

  const handleSelectPage = (pageName: string) => {
    setSelectedPage(pageName);
    setSelectedPostSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSuccess = (token: string) => {
    setAdminToken(token);
    localStorage.setItem('apexpulse_admin_token', token);
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('apexpulse_admin_token');
    setIsAdminOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <h1 className="text-xl font-black font-display tracking-tight">Daily News</h1>
        <p className="text-xs text-slate-400">Loading daily news engine...</p>
      </div>
    );
  }

  if (error || !settings || !adsConfig) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm max-w-md">
          {error || 'Unable to load application configuration.'}
        </div>
        <button
          onClick={loadInitialData}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  // Admin CMS Portal Active Mode
  if (isAdminOpen) {
    if (!adminToken) {
      return (
        <div className="min-h-screen bg-slate-950">
          <AdminLogin
            onLoginSuccess={handleAdminLoginSuccess}
            onBackToSite={() => setIsAdminOpen(false)}
          />
        </div>
      );
    }

    return (
      <AdminPortal
        categories={categories}
        adsConfig={adsConfig}
        settings={settings}
        onRefreshData={loadInitialData}
        onLogout={handleAdminLogout}
        onBackToSite={() => setIsAdminOpen(false)}
      />
    );
  }

  // Filtered Posts Logic
  let displayPosts = [...posts];

  if (selectedCategory) {
    displayPosts = displayPosts.filter((p) => p.categoryId === selectedCategory);
  }

  if (activeTagFilter) {
    displayPosts = displayPosts.filter((p) =>
      (p.tags || []).some((t) => t.toLowerCase() === activeTagFilter.toLowerCase())
    );
  }

  if (showBookmarksOnly) {
    displayPosts = bookmarkedPosts;
  }

  const currentCategoryObj = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Inject SEO Structured Data & Dynamic Title */}
      <SEOMeta post={currentPost} settings={settings} />

      {/* Main Navbar */}
      <Navbar
        settings={settings}
        categories={categories}
        posts={posts}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onOpenSearch={() => setIsSearchOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onSelectPage={handleSelectPage}
        bookmarkedPostsCount={bookmarkedPosts.length}
        onOpenBookmarks={() => setShowBookmarksOnly(true)}
      />

      {/* Main Page Layout Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 flex-1 space-y-8">
        {/* Detail View Mode */}
        {currentPost ? (
          <PostDetail
            post={currentPost}
            relatedPosts={relatedPosts}
            comments={postComments}
            adsConfig={adsConfig}
            onBack={() => setSelectedPostSlug(null)}
            onSelectPost={handleSelectPost}
            onSelectCategory={handleSelectCategory}
            isBookmarked={bookmarkedPosts.some((b) => b.id === currentPost.id)}
            onToggleBookmark={handleToggleBookmark}
            onCommentSubmitted={handleRefreshPostComments}
          />
        ) : selectedPage ? (
          /* Essential Pages Viewer (About, Contact, Privacy, Terms) */
          <PagesViewer
            page={selectedPage}
            settings={settings}
            onBackToHome={() => setSelectedPage(null)}
          />
        ) : (
          /* Main Feed View */
          <>
            {/* Header Leaderboard AdSense Banner */}
            <AdBanner type="header" adsConfig={adsConfig} />

            {/* Hero Section (Shown on All/Home View) */}
            {!selectedCategory && !showBookmarksOnly && !activeTagFilter && (
              <HeroSection
                posts={posts}
                onSelectPost={handleSelectPost}
                onSelectCategory={handleSelectCategory}
              />
            )}

            {/* Main Content & Sidebar Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Primary Feed Column (8 Cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Category Header or Saved Filter Bar */}
                <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-2">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                      {showBookmarksOnly
                        ? 'Saved Bookmarks'
                        : currentCategoryObj
                        ? `${currentCategoryObj.name} Articles`
                        : activeTagFilter
                        ? `Tagged: #${activeTagFilter}`
                        : 'Latest Tech & AI Feed'}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {showBookmarksOnly
                        ? `You have saved ${bookmarkedPosts.length} story for quick offline access.`
                        : currentCategoryObj?.description ||
                          'Real-time intelligence from trusted technology reporters.'}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border ${
                        showBookmarksOnly
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-500'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Bookmarks ({bookmarkedPosts.length})</span>
                    </button>

                    {(selectedCategory || showBookmarksOnly || activeTagFilter) && (
                      <button
                        onClick={() => handleSelectCategory(null)}
                        className="text-xs text-blue-600 font-bold hover:underline"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>

                {/* Post Cards Grid */}
                {displayPosts.length === 0 ? (
                  <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
                    <h3 className="text-base font-bold">No articles found</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      There are currently no published articles in this view. Check back shortly for new updates.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {displayPosts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onSelectPost={handleSelectPost}
                        onSelectCategory={handleSelectCategory}
                        isBookmarked={bookmarkedPosts.some((b) => b.id === post.id)}
                        onToggleBookmark={handleToggleBookmark}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar Column (4 Cols) */}
              <div className="lg:col-span-4">
                <Sidebar
                  posts={posts}
                  categories={categories}
                  adsConfig={adsConfig}
                  onSelectPost={handleSelectPost}
                  onSelectCategory={handleSelectCategory}
                />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer Component */}
      <Footer
        settings={settings}
        categories={categories}
        adsConfig={adsConfig}
        onSelectCategory={handleSelectCategory}
        onSelectPage={handleSelectPage}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Search & Filter Modal */}
      <SearchFilterModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        categories={categories}
        posts={posts}
        onSelectPost={handleSelectPost}
      />

      {/* GDPR & AdSense Cookie Consent Banner */}
      <CookieBanner
        cookieConsentText={settings.cookieConsentText}
        onAccept={() => console.log('Cookie consent accepted')}
      />
    </div>
  );
}

export default App;
