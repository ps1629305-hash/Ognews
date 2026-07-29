import React from 'react';
import { Clock, Eye, Flame, ArrowRight, User } from 'lucide-react';
import { Post } from '../types';

interface HeroSectionProps {
  posts: Post[];
  onSelectPost: (slug: string) => void;
  onSelectCategory: (catId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  posts = [],
  onSelectPost,
  onSelectCategory,
}) => {
  const safePosts = posts || [];
  const featuredPosts = safePosts.filter((p) => p.featured || p.trending);
  const mainPost = featuredPosts[0] || safePosts[0];
  const sidePosts = safePosts.filter((p) => p.id !== mainPost?.id).slice(0, 2);

  if (!mainPost) return null;

  return (
    <section className="mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Hero Card (8 Cols) */}
        <div className="lg:col-span-8 group relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 bg-slate-900 min-h-[420px] lg:min-h-[480px] flex flex-col justify-end">
          {/* Background Image */}
          <img
            src={mainPost.featuredImage}
            alt={mainPost.title}
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-80"
          />

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Content Box */}
          <div className="relative p-6 sm:p-8 z-10 space-y-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCategory(mainPost.categoryId);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide uppercase transition"
              >
                {mainPost.categoryName || 'Top Story'}
              </button>

              {mainPost.trending && (
                <span className="bg-amber-500/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1">
                  <Flame className="w-3 h-3" />
                  <span>Trending</span>
                </span>
              )}
            </div>

            <h1
              onClick={() => onSelectPost(mainPost.slug)}
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight hover:text-blue-300 transition cursor-pointer font-display"
            >
              {mainPost.title}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base line-clamp-2 max-w-2xl">
              {mainPost.excerpt}
            </p>

            <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400 gap-2">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <img
                    src={mainPost.author.avatar}
                    alt={mainPost.author.name}
                    className="w-6 h-6 rounded-full object-cover ring-2 ring-blue-500/50"
                  />
                  <span className="text-slate-200 font-medium">{mainPost.author.name}</span>
                </div>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{mainPost.readTimeMinutes} min read</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>{mainPost.viewsCount.toLocaleString()} views</span>
                </span>
              </div>

              <button
                onClick={() => onSelectPost(mainPost.slug)}
                className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 font-semibold transition group-hover:translate-x-1"
              >
                <span>Read Full Story</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Side Breaking Stories (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span>Breaking Highlights</span>
            </h2>
          </div>

          {sidePosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post.slug)}
              className="group bg-white dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between flex-1"
            >
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded">
                    {post.categoryName}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-2 leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1.5">
                  {post.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.readTimeMinutes} min</span>
                </span>
                <span className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-0.5 transition">
                  <span>Read Article</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
