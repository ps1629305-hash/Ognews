import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle, AlertCircle, CornerDownRight, ShieldCheck } from 'lucide-react';
import { Comment } from '../types';
import { submitComment } from '../lib/api';

interface CommentsSectionProps {
  postId: string;
  comments: Comment[];
  allowComments: boolean;
  onCommentSubmitted: () => void;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  postId,
  comments,
  allowComments,
  onCommentSubmitted,
}) => {
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [content, setContent] = useState('');
  const [replyParentId, setReplyParentId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !content) return;

    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await submitComment({
        postId,
        authorName,
        authorEmail,
        content,
        parentId: replyParentId,
      });

      setFeedback({ message: res.message, isError: false });
      setContent('');
      setReplyParentId(null);
      onCommentSubmitted();
    } catch (err: any) {
      setFeedback({ message: err.message || 'Failed to submit comment.', isError: true });
    } finally {
      setSubmitting(false);
    }
  };

  if (!allowComments) {
    return (
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 text-center">
        Comments are turned off for this post.
      </div>
    );
  }

  return (
    <section className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center space-x-2">
        <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Community Comments ({comments.length})
        </h3>
      </div>

      {/* Submit Comment Form */}
      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">
          {replyParentId ? 'Leave a Reply' : 'Join the Discussion'}
        </h4>

        {replyParentId && (
          <div className="mb-3 flex items-center justify-between bg-blue-50 dark:bg-blue-950/60 p-2 rounded-lg text-xs text-blue-700 dark:text-blue-300">
            <span>Replying to comment #{replyParentId.slice(-4)}</span>
            <button
              onClick={() => setReplyParentId(null)}
              className="text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold"
            >
              Cancel Reply
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. John Doe"
                required
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Email Address (Will not be published)
              </label>
              <input
                type="email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                placeholder="e.g. john@example.com"
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Comment *
            </label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts on this article..."
              required
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-400 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Protected against spam & policy violation</span>
            </span>

            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : 'Post Comment'}</span>
            </button>
          </div>
        </form>

        {feedback && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs flex items-center space-x-2 ${
              feedback.isError
                ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
            }`}
          >
            {feedback.isError ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}
      </div>

      {/* Approved Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic py-4 text-center">
            No comments yet. Be the first to share your opinion!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={comment.authorAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${comment.authorName}`}
                    alt={comment.authorName}
                    className="w-7 h-7 rounded-full bg-slate-100"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {comment.authorName}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setReplyParentId(comment.id)}
                  className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                >
                  <CornerDownRight className="w-3 h-3" />
                  <span>Reply</span>
                </button>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-9">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
