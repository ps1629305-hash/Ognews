import React, { useState } from 'react';
import {
  Save,
  Sparkles,
  Image,
  Tag,
  Eye,
  Edit,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Wand2,
} from 'lucide-react';
import { Post, Category } from '../../types';
import { createPost, updatePost, generateAIArticle } from '../../lib/api';

interface PostEditorProps {
  postToEdit?: Post | null;
  categories: Category[];
  onSaveSuccess: () => void;
  onCancel: () => void;
}

export const PostEditor: React.FC<PostEditorProps> = ({
  postToEdit,
  categories,
  onSaveSuccess,
  onCancel,
}) => {
  const [title, setTitle] = useState(postToEdit?.title || '');
  const [slug, setSlug] = useState(postToEdit?.slug || '');
  const [excerpt, setExcerpt] = useState(postToEdit?.excerpt || '');
  const [content, setContent] = useState(postToEdit?.content || '');
  const [featuredImage, setFeaturedImage] = useState(
    postToEdit?.featuredImage ||
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
  );
  const [categoryId, setCategoryId] = useState(postToEdit?.categoryId || categories[0]?.id || '');
  const [tagsInput, setTagsInput] = useState(postToEdit?.tags ? postToEdit.tags.join(', ') : 'Tech, AI, News');
  const [status, setStatus] = useState<'published' | 'draft'>(postToEdit?.status || 'published');
  const [featured, setFeatured] = useState(postToEdit?.featured || false);
  const [trending, setTrending] = useState(postToEdit?.trending || false);
  const [seoTitle, setSeoTitle] = useState(postToEdit?.seoTitle || '');
  const [metaDescription, setMetaDescription] = useState(postToEdit?.metaDescription || '');

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!postToEdit) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleAIGenerate = async (type: 'article' | 'seo') => {
    if (!aiPrompt && type === 'article') {
      setFeedback({ message: 'Please enter a topic prompt for AI generation.', isError: true });
      return;
    }

    setAiGenerating(true);
    setFeedback(null);

    try {
      const targetPrompt =
        type === 'seo'
          ? `Generate SEO title, meta description and tags for this article titled: "${title}". Content snippet: ${excerpt}`
          : aiPrompt;

      const res = await generateAIArticle(targetPrompt, type, categoryId);

      if (res.result) {
        if (type === 'article') {
          if (res.result.title) handleTitleChange(res.result.title);
          if (res.result.excerpt) setExcerpt(res.result.excerpt);
          if (res.result.content) setContent(res.result.content);
          if (res.result.seoTitle) setSeoTitle(res.result.seoTitle);
          if (res.result.metaDescription) setMetaDescription(res.result.metaDescription);
          if (res.result.tags && Array.isArray(res.result.tags)) setTagsInput(res.result.tags.join(', '));
          setFeedback({ message: 'AI draft article generated successfully!', isError: false });
        } else {
          if (res.result.seoTitle) setSeoTitle(res.result.seoTitle);
          if (res.result.metaDescription) setMetaDescription(res.result.metaDescription);
          if (res.result.tags && Array.isArray(res.result.tags)) setTagsInput(res.result.tags.join(', '));
          setFeedback({ message: 'SEO Metadata generated with Gemini AI!', isError: false });
        }
      }
    } catch (err: any) {
      setFeedback({ message: err.message || 'AI generation failed.', isError: true });
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setFeedback({ message: 'Title and content are required.', isError: true });
      return;
    }

    setSaving(true);
    setFeedback(null);

    const tagsArr = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const postPayload: Partial<Post> = {
      title: title.trim(),
      slug: slug.trim() ? slug.trim() : undefined,
      excerpt: excerpt.trim(),
      content,
      featuredImage: featuredImage.trim() || undefined,
      categoryId: categoryId || (categories[0]?.id || 'cat-tech'),
      tags: tagsArr,
      status,
      featured,
      trending,
      seoTitle: (seoTitle || title).trim(),
      metaDescription: (metaDescription || excerpt).trim(),
    };

    try {
      if (postToEdit) {
        await updatePost(postToEdit.id, postPayload);
      } else {
        await createPost(postPayload);
      }
      onSaveSuccess();
    } catch (err: any) {
      setFeedback({ message: err.message || 'Failed to save post.', isError: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <button
          onClick={onCancel}
          className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Post List</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
              activeTab === 'editor'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
              activeTab === 'preview'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {activeTab === 'preview' ? (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <h1 className="text-3xl font-bold">{title || 'Untitled Post'}</h1>
          {featuredImage && (
            <img src={featuredImage} alt="Featured" className="w-full max-h-96 object-cover rounded-2xl" />
          )}
          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* AI Generator Bar */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-5 rounded-2xl text-white space-y-3 shadow-md border border-blue-800">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Gemini AI Content & SEO Generator</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Topic prompt e.g. Write an article on Quantum Computing cryptography standards in 2026..."
                className="flex-1 w-full px-3.5 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />

              <button
                type="button"
                disabled={aiGenerating}
                onClick={() => handleAIGenerate('article')}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition shrink-0 flex items-center justify-center space-x-1.5 disabled:opacity-50"
              >
                <Wand2 className="w-4 h-4" />
                <span>{aiGenerating ? 'Generating...' : 'Generate Full Draft'}</span>
              </button>
            </div>
          </div>

          {/* Main Article Inputs */}
          <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter a compelling news headline..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="url-friendly-post-slug"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Tech, AI, Cybersecurity"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Featured Image URL
                </label>
                <input
                  type="text"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Excerpt (Short Summary)
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A brief 2-sentence summary for card previews..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Article Body Content (HTML or Markdown supported) *
              </label>
              <textarea
                rows={12}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="<p>Write your detailed article content here...</p>"
                className="w-full px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* SEO Metadata Box */}
          <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                SEO & Meta Tags
              </h3>

              <button
                type="button"
                onClick={() => handleAIGenerate('seo')}
                disabled={aiGenerating}
                className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-xs hover:bg-blue-100 transition flex items-center space-x-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Generate SEO Metadata with AI</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Optimized headline under 60 chars"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Meta Description
                </label>
                <input
                  type="text"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Search engine snippet under 160 chars"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Publishing Controls */}
          <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span>Set as Featured Story</span>
              </label>

              <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={trending}
                  onChange={(e) => setTrending(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500"
                />
                <span>Set as Trending</span>
              </label>

              <div className="flex items-center space-x-2 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Status:</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border text-xs font-bold"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Post...' : postToEdit ? 'Update Post' : 'Publish Article'}</span>
            </button>
          </div>

          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                feedback.isError ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              {feedback.isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              <span>{feedback.message}</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
};
