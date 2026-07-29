import React, { useEffect, useState } from 'react';
import {
  FileText,
  Eye,
  MessageSquare,
  Users,
  DollarSign,
  TrendingUp,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { AnalyticsSummary, Comment } from '../../types';
import { fetchAnalytics, fetchComments, moderateComment, deleteComment } from '../../lib/api';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
  onNewPost: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab, onNewPost }) => {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ana, comms] = await Promise.all([fetchAnalytics(), fetchComments()]);
      setAnalytics(ana);
      setComments(comms);
    } catch (err) {
      console.error('Failed loading dashboard analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleModerate = async (id: string, status: 'approved' | 'spam') => {
    await moderateComment(id, status);
    loadData();
  };

  const handleDeleteComm = async (id: string) => {
    await deleteComment(id);
    loadData();
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 text-sm">
        Loading analytics engine...
      </div>
    );
  }

  const pendingComments = (comments || []).filter((c) => c.status === 'pending');

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-lg">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Admin CMS Dashboard</h2>
          <p className="text-xs text-slate-400 mt-1">
            Overview of article performance, AdSense revenue, and moderation queues.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onNewPost}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs shadow-md transition flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Post</span>
          </button>

          <button
            onClick={() => onNavigateTab('export-php')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs border border-slate-700 transition flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export PHP & MySQL</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Posts */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-blue-600">
            <FileText className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded text-blue-600">
              Posts
            </span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block">
            {analytics?.totalPosts || 0}
          </span>
          <span className="text-[11px] text-slate-500">Published articles</span>
        </div>

        {/* Total Pageviews */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-indigo-600">
            <Eye className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded text-indigo-600">
              Traffic
            </span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block">
            {(analytics?.totalViews || 0).toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-500">Total lifetime views</span>
        </div>

        {/* Pending Comments */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-500">
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded text-amber-600">
              Moderation
            </span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block">
            {analytics?.pendingCommentsCount || 0}
          </span>
          <span className="text-[11px] text-slate-500">Comments pending</span>
        </div>

        {/* Subscribers */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded text-emerald-600">
              Subscribers
            </span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block">
            {analytics?.totalSubscribers || 0}
          </span>
          <span className="text-[11px] text-slate-500">Newsletter audience</span>
        </div>

        {/* Estimated Ad Earnings */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-violet-600">
            <DollarSign className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase bg-violet-50 dark:bg-violet-950 px-2 py-0.5 rounded text-violet-600">
              AdSense RPM
            </span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block">
            ${analytics?.estimatedAdEarnings || 0}
          </span>
          <span className="text-[11px] text-slate-500">Est. Ad earnings</span>
        </div>
      </div>

      {/* Recharts Analytics Traffic Chart */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Traffic & Visitor Analytics
            </h3>
            <p className="text-xs text-slate-400">Daily pageviews and unique visitors over the past 7 days</p>
          </div>
          <span className="text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 px-3 py-1 rounded-full">
            RPM ~ $1.50
          </span>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics?.dailyTraffic || []}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" name="Pageviews" />
              <Area type="monotone" dataKey="visitors" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorVisitors)" name="Unique Visitors" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pending Moderation Queue */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Pending Comments Queue ({pendingComments.length})
            </h3>
          </div>

          <button
            onClick={() => onNavigateTab('posts')}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Manage All Posts
          </button>
        </div>

        {pendingComments.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-4">
            No pending comments awaiting approval. All clean!
          </p>
        ) : (
          <div className="space-y-3">
            {pendingComments.map((comm) => (
              <div
                key={comm.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {comm.authorName}
                    </span>
                    <span className="text-[10px] text-slate-400">({comm.authorEmail})</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    "{comm.content}"
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleModerate(comm.id, 'approved')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>

                  <button
                    onClick={() => handleModerate(comm.id, 'spam')}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-500 transition flex items-center space-x-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Mark Spam</span>
                  </button>

                  <button
                    onClick={() => handleDeleteComm(comm.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-red-600 hover:text-white transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
