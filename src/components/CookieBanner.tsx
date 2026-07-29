import React, { useState, useEffect } from 'react';
import { Cookie, Check, X } from 'lucide-react';

interface CookieBannerProps {
  cookieConsentText: string;
  onAccept: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ cookieConsentText, onAccept }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent_accepted');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent_accepted', 'true');
    setVisible(false);
    onAccept();
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 bg-slate-900 text-white p-5 rounded-2xl shadow-2xl border border-slate-800 space-y-3 animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-start space-x-3">
        <Cookie className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold tracking-tight">Cookie Preferences</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {cookieConsentText ||
              'We use essential cookies to enhance your browsing experience and analyze site traffic.'}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 pt-1">
        <button
          onClick={() => setVisible(false)}
          className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition"
        >
          Decline Optional
        </button>
        <button
          onClick={handleAccept}
          className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center space-x-1"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Accept & Continue</span>
        </button>
      </div>
    </div>
  );
};
