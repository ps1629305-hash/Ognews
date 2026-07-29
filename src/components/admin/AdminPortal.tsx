import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Image,
  DollarSign,
  Settings,
  Users,
  Download,
  LogOut,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { Post, Category, AdConfig, SiteSettings } from '../../types';
import { AdminDashboard } from './AdminDashboard';
import { PostList } from './PostList';
import { PostEditor } from './PostEditor';
import { CategoryManager } from './CategoryManager';
import { MediaLibrary } from './MediaLibrary';
import { AdSenseManager } from './AdSenseManager';
import { SettingsManager } from './SettingsManager';
import { SubscriberManager } from './SubscriberManager';
import { ExportPHP } from './ExportPHP';

interface AdminPortalProps {
  categories: Category[];
  adsConfig: AdConfig;
  settings: SiteSettings;
  onRefreshData: () => void;
  onLogout: () => void;
  onBackToSite: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  categories,
  adsConfig,
  settings,
  onRefreshData,
  onLogout,
  onBackToSite,
}) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsCreatingNew(false);
    setActiveTab('editor');
  };

  const handleNewPost = () => {
    setEditingPost(null);
    setIsCreatingNew(true);
    setActiveTab('editor');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'posts', label: 'Manage Posts', icon: FileText },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'media', label: 'Media Library', icon: Image },
    { id: 'adsense', label: 'Google AdSense', icon: DollarSign },
    { id: 'subscribers', label: 'Subscribers', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'export-php', label: 'Export PHP / MySQL', icon: Download },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Admin Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
            AP
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight block">
              {settings.siteName} CMS Panel
            </span>
            <span className="text-[10px] text-amber-400 font-mono block">
              Administrator: {settings.adminEmail}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToSite}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition flex items-center space-x-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Live Site</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600 hover:text-white transition text-xs font-bold flex items-center space-x-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Panel Content */}
      <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Nav (3 cols) */}
        <nav className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-1 h-fit shadow-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'posts') {
                    setEditingPost(null);
                    setIsCreatingNew(false);
                  }
                  setActiveTab(item.id);
                }}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Dynamic Tab Body (9 cols) */}
        <main className="lg:col-span-9">
          {activeTab === 'dashboard' && (
            <AdminDashboard
              onNavigateTab={(tab) => setActiveTab(tab)}
              onNewPost={handleNewPost}
            />
          )}

          {activeTab === 'posts' && (
            <PostList
              categories={categories}
              onEditPost={handleEditPost}
              onNewPost={handleNewPost}
            />
          )}

          {activeTab === 'editor' && (
            <PostEditor
              postToEdit={isCreatingNew ? null : editingPost}
              categories={categories}
              onSaveSuccess={() => {
                onRefreshData();
                setActiveTab('posts');
              }}
              onCancel={() => setActiveTab('posts')}
            />
          )}

          {activeTab === 'categories' && (
            <CategoryManager categories={categories} onRefresh={onRefreshData} />
          )}

          {activeTab === 'media' && <MediaLibrary />}

          {activeTab === 'adsense' && (
            <AdSenseManager adsConfig={adsConfig} onSaved={onRefreshData} />
          )}

          {activeTab === 'subscribers' && <SubscriberManager />}

          {activeTab === 'settings' && (
            <SettingsManager settings={settings} onSaved={onRefreshData} />
          )}

          {activeTab === 'export-php' && <ExportPHP />}
        </main>
      </div>
    </div>
  );
};
