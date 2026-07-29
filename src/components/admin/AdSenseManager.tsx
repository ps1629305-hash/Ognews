import React, { useState } from 'react';
import { DollarSign, Save, ShieldCheck, CheckCircle, AlertCircle, Code, FileText } from 'lucide-react';
import { AdConfig } from '../../types';
import { updateAdConfig } from '../../lib/api';

interface AdSenseManagerProps {
  adsConfig: AdConfig;
  onSaved: () => void;
}

export const AdSenseManager: React.FC<AdSenseManagerProps> = ({ adsConfig, onSaved }) => {
  const [config, setConfig] = useState<AdConfig>(adsConfig);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      await updateAdConfig(config);
      setFeedback({ message: 'Google AdSense settings updated successfully!', isError: false });
      onSaved();
    } catch (err: any) {
      setFeedback({ message: err.message || 'Failed to update AdSense config.', isError: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* AdSense Overview Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 rounded-3xl text-white space-y-2 border border-emerald-800 shadow-md">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
          <DollarSign className="w-5 h-5" />
          <span>Google AdSense Monetization Hub</span>
        </div>
        <h2 className="text-2xl font-black tracking-tight">
          AdSense & Ad Slot Configuration
        </h2>
        <p className="text-xs text-emerald-100/80 max-w-2xl leading-relaxed">
          Configure your Google AdSense Publisher ID, manage inline and sidebar ad unit slots, auto-ads scripts, and ads.txt files for maximum RPM revenue.
        </p>
      </div>

      {/* Global Master Switch */}
      <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Enable Monetization / Ad Units
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Turn on or off all AdSense ad banners across the website instantly.
          </p>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:after:border-slate-600 peer-checked:bg-emerald-600"></div>
        </label>
      </div>

      {/* Publisher ID & Slots */}
      <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
          Publisher Credentials & Auto Ads
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Google AdSense Publisher ID *
            </label>
            <input
              type="text"
              required
              value={config.publisherId}
              onChange={(e) => setConfig({ ...config, publisherId: e.target.value })}
              placeholder="pub-1234567890123456"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono"
            />
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={config.autoAds}
                onChange={(e) => setConfig({ ...config, autoAds: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600"
              />
              <span>Enable Google AdSense Auto Ads (Automated In-page placement)</span>
            </label>
          </div>
        </div>

        {/* Individual Ad Slots */}
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-4">
          Ad Unit Slots Placement
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Header Banner */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Header Banner Unit</span>
              <input
                type="checkbox"
                checked={config.headerBanner.enabled}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    headerBanner: { ...config.headerBanner, enabled: e.target.checked },
                  })
                }
              />
            </div>
            <input
              type="text"
              value={config.headerBanner.slotId}
              onChange={(e) =>
                setConfig({
                  ...config,
                  headerBanner: { ...config.headerBanner, slotId: e.target.value },
                })
              }
              placeholder="Header Slot ID (e.g. 1234567890)"
              className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border text-xs font-mono"
            />
          </div>

          {/* In-Article Top Banner */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">In-Article Top Unit</span>
              <input
                type="checkbox"
                checked={config.inArticleTop.enabled}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    inArticleTop: { ...config.inArticleTop, enabled: e.target.checked },
                  })
                }
              />
            </div>
            <input
              type="text"
              value={config.inArticleTop.slotId}
              onChange={(e) =>
                setConfig({
                  ...config,
                  inArticleTop: { ...config.inArticleTop, slotId: e.target.value },
                })
              }
              placeholder="In-Article Top Slot ID"
              className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border text-xs font-mono"
            />
          </div>

          {/* Sidebar Banner */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Sidebar Unit (300x250)</span>
              <input
                type="checkbox"
                checked={config.sidebarBanner.enabled}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    sidebarBanner: { ...config.sidebarBanner, enabled: e.target.checked },
                  })
                }
              />
            </div>
            <input
              type="text"
              value={config.sidebarBanner.slotId}
              onChange={(e) =>
                setConfig({
                  ...config,
                  sidebarBanner: { ...config.sidebarBanner, slotId: e.target.value },
                })
              }
              placeholder="Sidebar Slot ID"
              className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border text-xs font-mono"
            />
          </div>

          {/* Footer Banner */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Footer Banner Unit</span>
              <input
                type="checkbox"
                checked={config.footerBanner.enabled}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    footerBanner: { ...config.footerBanner, enabled: e.target.checked },
                  })
                }
              />
            </div>
            <input
              type="text"
              value={config.footerBanner.slotId}
              onChange={(e) =>
                setConfig({
                  ...config,
                  footerBanner: { ...config.footerBanner, slotId: e.target.value },
                })
              }
              placeholder="Footer Slot ID"
              className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border text-xs font-mono"
            />
          </div>
        </div>

        {/* Ads.txt Content Editor */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <label className="text-xs font-bold text-slate-900 dark:text-white">
              Ads.txt Compliance Specification
            </label>
          </div>
          <textarea
            rows={2}
            value={config.adsTxtContent}
            onChange={(e) => setConfig({ ...config, adsTxtContent: e.target.value })}
            placeholder="google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0"
            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono resize-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition flex items-center space-x-1.5 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save AdSense Settings'}</span>
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
  );
};
