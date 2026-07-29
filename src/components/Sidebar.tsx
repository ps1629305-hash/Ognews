import React, { useState } from 'react';
import { Flame, Clock, Mail, Folder, Check, AlertCircle, TrendingUp } from 'lucide-react';
import { Post, Category, AdConfig } from '../types';
import { subscribeNewsletter } from '../lib/api';
import { AdBanner } from './AdBanner';

interface SidebarProps {
  posts: Post[];
  categories: Category[];
  adsConfig: AdConfig;
  onSelectPost: (slug: string) => void;
  onSelectCategory: (catId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  posts = [],
  categories = [],
  adsConfig,
  onSelectPost,
  onSelectCategory,
}) => {
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<{ loading: boolean; message: string; isError: boolean } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubStatus({ loading: true, message: '', isError: false });
    try {
      const res = await subscribeNewsletter(email);
      setSubStatus({ loading: false, message: res.message, isError: false });
      setEmail('');
    } catch (err: any) {
      setSubStatus({ loading: false, message: err.message || 'Subscription failed', isError: true });
    }
  };

  const safePosts = posts || [];
  const trendingPosts = [...safePosts]
    .sort((a, b) => b.viewsCount - a.viewsCount)
    .slice(0, 5);

  const recentPosts = [...safePosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 4);

  return (
    <aside className="space-y-8">
      {/* Newsletter Widget */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl" />

        <div className="flex items-center space-x-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
          <Mail className="w-4 h-4" />
          <span>Daily Tech Pulse</span>
        </div>

        <h3 className="text-xl font-bold tracking-tight mb-2">
          Stay Ahead of Tech Trends
        </h3>

        <p className="text-xs text-blue-100/80 mb-4 leading-relaxed">
          Get handpicked breaking tech news, AI developments, and security deep-dives delivered straight to your inbox daily.
        </p>

        <form onSubmit={handleSubscribe} className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address..."
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-blue-200/60 text-xs focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            type="submit"
            disabled={subStatus?.loading}
            className="w-full py-2.5 rounded-xl bg-white text-blue-900 font-bold text-xs hover:bg-blue-50 transition shadow-md flex items-center justify-center space-x-1"
          >
            {subStatus?.loading ? 'Subscribing...' : 'Subscribe Free'}
          </button>
        </form>

        {subStatus?.message && (
          <div
            className={`mt-3 p-2 rounded-lg text-xs flex items-center space-x-2 ${
              subStatus.isError ? 'bg-red-500/20 text-red-200' : 'bg-emerald-500/20 text-emerald-200'
            }`}
          >
            {subStatus.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
            <span>{subStatus.message}</span>
          </div>
        )}
      </div>

      {/* AdSense Sidebar Banner */}
      <AdBanner type="sidebar" adsConfig={adsConfig} />

      {/* Numbered Trending Posts Rank Widget */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-2 mb-5 pb-3 border-b border-slate-100 dark:border-slate-700">
          <Flame className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Most Popular Stories
          </h3>
        </div>

        <div className="space-y-4">
          {trendingPosts.map((post, index) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post.slug)}
              className="group flex items-start space-x-3 cursor-pointer"
            >
              <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-extrabold text-sm flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                {index + 1}
              </span>

              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {post.categoryName}
                </span>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-2 leading-snug">
                  {post.title}
                </h4>
                <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-1">
                  <span>{post.viewsCount.toLocaleString()} views</span>
                  <span>•</span>
                  <span>{post.readTimeMinutes} min read</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explore Categories Widget */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-700">
          <Folder className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Popular Categories
          </h3>
        </div>

        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/60 transition group text-left"
            >
              <div className="flex items-center space-x-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: cat.color || '#3B82F6' }}
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {cat.name}
                </span>
              </div>

              {cat.postCount !== undefined && (
                <span className="text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                  {cat.postCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
