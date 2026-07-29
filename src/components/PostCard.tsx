import React, { useState } from 'react';
import { Clock, Eye, Bookmark, Share2, Check, ArrowUpRight } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onSelectPost: (slug: string) => void;
  onSelectCategory: (catId: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (post: Post) => void;
  layout?: 'grid' | 'list';
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onSelectPost,
  onSelectCategory,
  isBookmarked,
  onToggleBookmark,
  layout = 'grid',
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/post/${post.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (layout === 'list') {
    return (
      <article
        onClick={() => onSelectPost(post.slug)}
        className="group bg-white dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition shadow-sm hover:shadow-md cursor-pointer flex flex-col sm:flex-row gap-5"
      >
        <div className="sm:w-1/3 aspect-video sm:aspect-square rounded-xl overflow-hidden relative shrink-0">
          <img
            src={post.featuredImage}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectCategory(post.categoryId);
            }}
            className="absolute top-2 left-2 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md tracking-wider uppercase shadow-sm"
          >
            {post.categoryName || 'Tech'}
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-between space-y-2">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{post.readTimeMinutes} min read</span>
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug">
              {post.title}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1.5">
              {post.excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/60 text-xs">
            <div className="flex items-center space-x-2">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="text-slate-700 dark:text-slate-300 font-medium">{post.author.name}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                title="Copy Article Link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(post);
                }}
                className={`p-1.5 rounded-lg transition ${
                  isBookmarked
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80'
                    : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                title={isBookmarked ? 'Remove Bookmark' : 'Save Bookmark'}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Default Grid Layout
  return (
    <article
      onClick={() => onSelectPost(post.slug)}
      className="group bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition shadow-sm hover:shadow-lg cursor-pointer flex flex-col justify-between overflow-hidden"
    >
      <div>
        {/* Featured Image */}
        <div className="aspect-[16/9] w-full overflow-hidden relative bg-slate-100 dark:bg-slate-900">
          <img
            src={post.featuredImage}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectCategory(post.categoryId);
            }}
            className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider uppercase shadow-sm"
          >
            {post.categoryName || 'General'}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(post);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${
              isBookmarked
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-900/60 text-white hover:bg-blue-600'
            }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Post'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{post.readTimeMinutes} min read</span>
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug line-clamp-2">
            {post.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
          />
          <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[100px]">
            {post.author.name}
          </span>
        </div>

        <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-400">
          <span className="flex items-center space-x-1 text-[11px]">
            <Eye className="w-3.5 h-3.5" />
            <span>{post.viewsCount.toLocaleString()}</span>
          </span>

          <button
            onClick={handleShare}
            className="p-1 hover:text-blue-600 dark:hover:text-blue-400 transition"
            title="Share URL"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </article>
  );
};
