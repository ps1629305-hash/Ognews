import React from 'react';
import { AdConfig } from '../types';

interface AdBannerProps {
  type: 'header' | 'inArticleTop' | 'inArticleBottom' | 'sidebar' | 'footer';
  adsConfig: AdConfig;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ type, adsConfig, className = '' }) => {
  if (!adsConfig || !adsConfig.enabled) return null;

  let unitConfig: { enabled: boolean; slotId: string; customCode?: string } | null = null;
  let label = 'Advertisement';
  let aspectClasses = '';

  switch (type) {
    case 'header':
      unitConfig = adsConfig.headerBanner;
      aspectClasses = 'w-full max-w-4xl min-h-[90px] py-2';
      break;
    case 'inArticleTop':
      unitConfig = adsConfig.inArticleTop;
      aspectClasses = 'w-full min-h-[120px] my-6';
      break;
    case 'inArticleBottom':
      unitConfig = adsConfig.inArticleBottom;
      aspectClasses = 'w-full min-h-[120px] my-6';
      break;
    case 'sidebar':
      unitConfig = adsConfig.sidebarBanner;
      aspectClasses = 'w-full min-h-[250px] my-4';
      break;
    case 'footer':
      unitConfig = adsConfig.footerBanner;
      aspectClasses = 'w-full max-w-5xl min-h-[90px] py-4';
      break;
  }

  if (!unitConfig || !unitConfig.enabled) return null;

  return (
    <div className={`mx-auto flex flex-col items-center justify-center ${className}`}>
      {adsConfig.showAdLabels && (
        <span className="text-[10px] tracking-wider uppercase text-slate-400 dark:text-slate-500 font-medium mb-1">
          {label}
        </span>
      )}

      {unitConfig.customCode ? (
        <div
          className="w-full flex justify-center"
          dangerouslySetInnerHTML={{ __html: unitConfig.customCode }}
        />
      ) : (
        <div
          className={`${aspectClasses} border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/50 rounded-lg p-3 flex flex-col items-center justify-center text-center transition-all hover:border-blue-400 dark:hover:border-blue-500 group relative overflow-hidden`}
        >
          {/* Decorative Google AdSense styling */}
          <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-70">
            <span className="text-[9px] bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded font-mono font-semibold">
              AdSense Ready
            </span>
          </div>

          <div className="flex items-center space-x-2 mb-1">
            <svg
              className="w-5 h-5 text-blue-600 dark:text-blue-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              Google AdSense Placement ({type.toUpperCase()})
            </span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-md">
            Slot ID: <code className="font-mono text-blue-600 dark:text-blue-400">{unitConfig.slotId}</code> | Client: <code className="font-mono text-slate-600 dark:text-slate-300">{adsConfig.googleAdSenseClientId}</code>
          </p>

          <span className="mt-2 text-[10px] text-slate-400 dark:text-slate-500">
            Responsive Ad Unit • Auto-formatted for optimal CTR & Core Web Vitals
          </span>
        </div>
      )}
    </div>
  );
};
