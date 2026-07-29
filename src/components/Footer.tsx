import React from 'react';
import { SiteSettings, Category, AdConfig } from '../types';
import { AdBanner } from './AdBanner';
import { Globe, Shield, Heart, Lock } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
  categories: Category[];
  adsConfig: AdConfig;
  onSelectCategory: (catId: string | null) => void;
  onSelectPage: (page: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  categories,
  adsConfig,
  onSelectCategory,
  onSelectPage,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 dark:bg-slate-950 border-t border-slate-800 pt-10 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        {/* AdSense Footer Banner */}
        <AdBanner type="footer" adsConfig={adsConfig} />

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => onSelectCategory(null)}
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg">
                A
              </div>
              <span className="text-2xl font-black text-white tracking-tight font-display">
                {settings.siteName}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {settings.tagline}. Delivering rigorous tech journalism, artificial intelligence coverage, cyber defense insights, and cutting-edge digital trends.
            </p>

            <div className="pt-2 text-xs text-slate-400 flex items-center space-x-3">
              <span>Admin Contact:</span>
              <a
                href={`mailto:${settings.adminEmail}`}
                className="text-blue-400 font-semibold hover:underline"
              >
                {settings.adminEmail}
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onSelectCategory(null)}
                  className="hover:text-white transition"
                >
                  All News
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.id)}
                    className="hover:text-white transition"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Essential Legal Pages */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Essential Pages
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onSelectPage('about')} className="hover:text-white transition">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onSelectPage('contact')} className="hover:text-white transition">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => onSelectPage('privacy-policy')} className="hover:text-white transition">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onSelectPage('terms')} className="hover:text-white transition">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onSelectPage('disclaimer')} className="hover:text-white transition">
                  Disclaimer
                </button>
              </li>
              <li>
                <button onClick={() => onSelectPage('cookie-policy')} className="hover:text-white transition">
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>

          {/* AdSense Compliance & Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Site Administration
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fully compliant with GDPR Cookie Standards and Core Web Vitals optimization guidelines.
            </p>

            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold transition border border-slate-700"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Panel Login</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
          </p>

          <div className="flex items-center space-x-4">
            <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition">
              XML Sitemap
            </a>
            <span>•</span>
            <a href="/robots.txt" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition">
              Robots.txt
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
