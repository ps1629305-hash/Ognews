import React, { useState, useEffect } from 'react';
import {
  Clock,
  Eye,
  Calendar,
  Share2,
  Bookmark,
  Check,
  ArrowLeft,
  Tag,
  List,
  Sparkles,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { Post, AdConfig } from '../types';
import { AdBanner } from './AdBanner';
import { CommentsSection } from './CommentsSection';

interface PostDetailProps {
  post: Post;
  relatedPosts: Post[];
  comments: any[];
  adsConfig: AdConfig;
  onBack: () => void;
  onSelectPost: (slug: string) => void;
  onSelectCategory: (catId: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (post: Post) => void;
  onCommentSubmitted: () => void;
}

export const PostDetail: React.FC<PostDetailProps> = ({
  post,
  relatedPosts,
  comments,
  adsConfig,
  onBack,
  onSelectPost,
  onSelectCategory,
  isBookmarked,
  onToggleBookmark,
  onCommentSubmitted,
}) => {
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="max-w-4xl mx-auto space-y-8">
      {/* Top Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-blue-600 z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </button>

        <div className="hidden sm:flex items-center space-x-1">
          <button onClick={onBack} className="hover:underline">Home</button>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <button onClick={() => onSelectCategory(post.categoryId)} className="hover:underline font-semibold text-blue-600 dark:text-blue-400">
            {post.categoryName}
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="truncate max-w-[200px]">{post.title}</span>
        </div>
      </div>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onSelectCategory(post.categoryId)}
            className="bg-blue-600 text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider"
          >
            {post.categoryName}
          </button>

          {post.trending && (
            <span className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 font-bold text-xs px-2.5 py-1 rounded-full">
              🔥 Trending Story
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight font-display">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          {post.excerpt}
        </p>

        {/* Author & Meta Bar */}
        <div className="flex flex-wrap items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 gap-4">
          <div className="flex items-center space-x-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/30"
            />
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white block">
                {post.author.name}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">
                {post.author.role || 'Senior Journalist'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTimeMinutes} min read</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{post.viewsCount.toLocaleString()} views</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleBookmark(post)}
              className={`p-2 rounded-xl border transition ${
                isBookmarked
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:border-blue-500'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Save Article'}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:border-blue-500 transition"
              title="Copy URL"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* In-Article Top AdSense Banner */}
      <AdBanner type="inArticleTop" adsConfig={adsConfig} />

      {/* Article Content */}
      <div className="prose dark:prose-invert max-w-none prose-slate prose-lg leading-relaxed dark:text-slate-200">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {/* Tags Chips */}
      {post.tags && post.tags.length > 0 && (
        <div className="pt-4 flex flex-wrap items-center gap-2 border-t border-slate-200 dark:border-slate-800">
          <Tag className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tags:</span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* In-Article Bottom AdSense Banner */}
      <AdBanner type="inArticleBottom" adsConfig={adsConfig} />

      {/* Author Bio Box */}
      {post.author && (
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex items-start space-x-4">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-14 h-14 rounded-full object-cover shrink-0 ring-2 ring-blue-500"
          />
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Written By
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {post.author.name}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {post.author.bio || 'Senior Tech Journalist specializing in cloud infrastructure, AI models, and enterprise software architecture.'}
            </p>
          </div>
        </div>
      )}

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Related Stories You Might Like
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedPosts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectPost(rel.slug)}
                className="group bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition shadow-sm cursor-pointer space-y-2"
              >
                <div className="aspect-video w-full rounded-lg overflow-hidden">
                  <img
                    src={rel.featuredImage}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                  {rel.categoryName}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition line-clamp-2">
                  {rel.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments System */}
      <CommentsSection
        postId={post.id}
        comments={comments}
        allowComments={true}
        onCommentSubmitted={onCommentSubmitted}
      />
    </article>
  );
};
