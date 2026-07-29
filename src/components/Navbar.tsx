import React, { useState, useEffect } from 'react';
import {
  Search,
  Sun,
  Moon,
  Shield,
  Menu,
  X,
  TrendingUp,
  Bookmark,
  Globe,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Category, Post, SiteSettings } from '../types';

interface NavbarProps {
  settings: SiteSettings;
  categories: Category[];
  posts: Post[];
  activeCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
  onSelectPage: (page: string) => void;
  bookmarkedPostsCount: number;
  onOpenBookmarks: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  categories = [],
  posts = [],
  activeCategory = null,
  selectedCategory,
  onSelectCategory,
  onOpenSearch,
  onOpenAdmin,
  onSelectPage = () => {},
  bookmarkedPostsCount = 0,
  onOpenBookmarks = () => {},
  darkMode = false,
  isDarkMode,
  setDarkMode,
  onToggleDarkMode,
}) => {
  const currentActiveCategory = selectedCategory !== undefined ? selectedCategory : activeCategory;
  const isDark = isDarkMode !== undefined ? isDarkMode : darkMode;
  const toggleDark = onToggleDarkMode || (() => setDarkMode && setDarkMode(!isDark));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const safePosts = posts || [];
  const breakingPosts = safePosts.filter((p) => p.trending || p.featured).slice(0, 3);
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors shadow-sm">
      {/* Top Bar (Date, Ticker, Utility links) */}
      <div className="bg-slate-900 text-slate-300 dark:bg-slate-950 text-xs py-1.5 px-4 hidden md:block border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-slate-400 font-medium">{currentDate}</span>
            <span className="text-slate-600">|</span>

            {/* Breaking News Ticker */}
            <div className="flex items-center space-x-2 overflow-hidden max-w-xl">
              <span className="bg-red-600 text-white font-bold text-[10px] uppercase px-1.5 py-0.5 rounded flex items-center space-x-1 shrink-0 animate-pulse">
                <TrendingUp className="w-3 h-3" />
                <span>Breaking</span>
              </span>
              <div className="truncate text-slate-200 hover:text-blue-400 transition cursor-pointer">
                {breakingPosts.length > 0 ? (
                  <span onClick={() => onSelectPage(`post/${breakingPosts[0].slug}`)}>
                    {breakingPosts[0].title}
                  </span>
                ) : (
                  <span>Welcome to {settings.siteName} - Your Trusted Tech & News Source</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => onSelectPage('about')}
              className="hover:text-white transition"
            >
              About
            </button>
            <button
              onClick={() => onSelectPage('contact')}
              className="hover:text-white transition"
            >
              Contact
            </button>
            <button
              onClick={() => onSelectPage('privacy-policy')}
              className="hover:text-white transition"
            >
              Privacy Policy
            </button>

            <span className="text-slate-700">|</span>

            <button
              onClick={onOpenAdmin}
              className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 transition font-semibold"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Panel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectCategory(null)}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-extrabold text-xl tracking-tight">
            {settings.logoText ? settings.logoText.charAt(0) : 'D'}
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-display">
              {settings.siteName}
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block -mt-1">
              {settings.tagline}
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
            title="Search posts"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Bookmarks Counter */}
          <button
            onClick={onOpenBookmarks}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition relative"
            title="Saved Bookmarks"
          >
            <Bookmark className="w-5 h-5" />
            {bookmarkedPostsCount > 0 && (
              <span className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {bookmarkedPostsCount}
              </span>
            )}
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleDark}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Mobile Admin Link */}
          <button
            onClick={onOpenAdmin}
            className="md:hidden p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400"
            title="Admin Panel"
          >
            <Shield className="w-5 h-5" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Categories Navigation Bar */}
      <nav className="border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-1 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => onSelectCategory(null)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              currentActiveCategory === null
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            Home / All
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center space-x-1.5 ${
                currentActiveCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <span>{cat.name}</span>
              {cat.postCount !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    currentActiveCategory === cat.id
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {cat.postCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-2">
              Categories
            </span>
            <button
              onClick={() => {
                onSelectCategory(null);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg ${
                activeCategory === null ? 'bg-blue-600 text-white' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              All Topics
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg ${
                  activeCategory === cat.id ? 'bg-blue-600 text-white' : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-2">
            <button
              onClick={() => {
                onSelectPage('about');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400"
            >
              About Us
            </button>
            <button
              onClick={() => {
                onSelectPage('contact');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400"
            >
              Contact Us
            </button>
            <button
              onClick={() => {
                onSelectPage('privacy-policy');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>Admin Panel Login</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
