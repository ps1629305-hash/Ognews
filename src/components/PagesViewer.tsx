import React, { useState } from 'react';
import {
  Send,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Building,
  Mail,
  MapPin,
  Globe,
  FileText,
  Lock,
  Cookie,
} from 'lucide-react';
import { SiteSettings } from '../types';
import { sendContactMessage } from '../lib/api';

interface PagesViewerProps {
  page: string;
  settings: SiteSettings;
  onBackToHome: () => void;
}

export const PagesViewer: React.FC<PagesViewerProps> = ({ page, settings, onBackToHome }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await sendContactMessage(formData);
      setFeedback({ message: res.message, isError: false });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setFeedback({ message: err.message || 'Failed to send message.', isError: true });
    } finally {
      setSubmitting(false);
    }
  };

  const renderContent = () => {
    switch (page) {
      case 'about':
        return (
          <div className="space-y-6">
            <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Who We Are
              </span>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                About {settings.siteName}
              </h1>
            </div>

            <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-4">
              <p className="text-base font-medium leading-relaxed">
                Welcome to <strong>{settings.siteName}</strong>, your premier destination for independent, authoritative tech news, artificial intelligence intelligence, cybersecurity breakthroughs, and cloud engineering analysis.
              </p>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-2">Our Mission</h2>
              <p>
                Our mission is to empower developers, system architects, technology executives, and tech enthusiasts with accurate, timely, and actionable insights into the fast-evolving global technology landscape.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700">
                  <span className="text-2xl font-black text-blue-600 block mb-1">100%</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Independent Editorial</span>
                  <p className="text-[11px] text-slate-500 mt-1">Unbiased tech journalism and objective benchmarks.</p>
                </div>

                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700">
                  <span className="text-2xl font-black text-indigo-600 block mb-1">24/7</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Real-time Coverage</span>
                  <p className="text-[11px] text-slate-500 mt-1">Breaking updates across AI, Security, and Web Dev.</p>
                </div>

                <div className="p-4 rounded-xl bg-violet-50 dark:bg-slate-800 border border-violet-100 dark:border-slate-700">
                  <span className="text-2xl font-black text-violet-600 block mb-1">Strict</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">AdSense Compliance</span>
                  <p className="text-[11px] text-slate-500 mt-1">Transparent advertising with clear privacy standards.</p>
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-2">Editorial Team</h2>
              <p>
                Headquartered in San Francisco with remote contributors globally, our editorial team consists of veteran technology reporters, certified CISSP cybersecurity engineers, and full-stack software architects.
              </p>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Get in Touch
              </span>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                Contact Our Editorial Team
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Have a press release, news tip, guest article proposal, or advertising inquiry? Reach out directly.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Contact Form */}
              <div className="lg:col-span-8 bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Press Release Inquiry"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Message *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we help you?"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Sending Message...' : 'Send Message'}</span>
                  </button>
                </form>

                {feedback && (
                  <div
                    className={`mt-4 p-3 rounded-xl text-xs flex items-center space-x-2 ${
                      feedback.isError
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
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

              {/* Direct Info */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-400">
                    <Mail className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Direct Admin Email
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                    {settings.adminEmail}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-400">
                    <Building className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Editorial Desk
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    ApexPulse Media Corp<br />
                    100 Pine Street, Suite 2400<br />
                    San Francisco, CA 94111, USA
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy-policy':
        return (
          <div className="space-y-6">
            <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Legal & Compliance
              </span>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                Privacy Policy
              </h1>
              <p className="text-xs text-slate-400">
                Last updated: July 2026 • Compliant with Google AdSense, GDPR & CCPA
              </p>
            </div>

            <div className="prose dark:prose-invert max-w-none text-xs text-slate-700 dark:text-slate-300 space-y-4 leading-relaxed">
              <p>
                At <strong>{settings.siteName}</strong> (accessible from {settings.siteUrl}), one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by {settings.siteName} and how we use it.
              </p>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2">
                1. Google AdSense & DoubleClick DART Cookie
              </h3>
              <p>
                Google is a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer" className="text-blue-600 underline">https://policies.google.com/technologies/ads</a>
              </p>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2">
                2. Information We Collect
              </h3>
              <p>
                When you subscribe to our newsletter, leave comments, or use our contact form, we collect personal information such as your name and email address. We use this data solely to communicate with you and improve our content.
              </p>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2">
                3. Log Files & Analytics
              </h3>
              <p>
                {settings.siteName} follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as a part of hosting services' analytics. The information collected includes IP addresses, browser type, ISP, date and time stamp, referring/exit pages, and number of clicks.
              </p>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2">
                4. GDPR & CCPA Data Protection Rights
              </h3>
              <p>
                Under GDPR and CCPA, users have the right to request access, rectification, erasure, or restriction of processing of personal data. To exercise these rights, please contact our administrator at <code>{settings.adminEmail}</code>.
              </p>
            </div>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-6">
            <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Terms of Service
              </span>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                Terms & Conditions
              </h1>
            </div>

            <div className="prose dark:prose-invert max-w-none text-xs text-slate-700 dark:text-slate-300 space-y-4 leading-relaxed">
              <p>
                Welcome to <strong>{settings.siteName}</strong>! By accessing this website, you agree to comply with and be bound by the following terms and conditions of use.
              </p>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2">
                1. Intellectual Property Rights
              </h3>
              <p>
                Unless otherwise stated, {settings.siteName} and/or its licensors own the intellectual property rights for all material on the website. All intellectual property rights are reserved.
              </p>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2">
                2. User Comments & Moderation
              </h3>
              <p>
                {settings.siteName} reserves the right to monitor all comments and to remove any comments which can be considered inappropriate, offensive, policy-violating, or spam.
              </p>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2">
                3. Disclaimer of Liability
              </h3>
              <p>
                The information provided on this website is for general informational purposes only. While we strive to keep information accurate and up to date, we make no representations or warranties of any kind.
              </p>
            </div>
          </div>
        );

      case 'disclaimer':
        return (
          <div className="space-y-6">
            <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Legal Notice
              </span>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                Website Disclaimer
              </h1>
            </div>

            <div className="prose dark:prose-invert max-w-none text-xs text-slate-700 dark:text-slate-300 space-y-4 leading-relaxed">
              <p>
                All content published on <strong>{settings.siteName}</strong> is published in good faith and for general information purpose only.
              </p>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2">
                External Links Disclaimer
              </h3>
              <p>
                From our website, you can visit other websites by following hyperlinks to such external sites. While we strive to provide only quality links to useful and ethical websites, we have no control over the content and nature of these sites.
              </p>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2">
                Advertising Disclaimer
              </h3>
              <p>
                This site contains advertisements served by Google AdSense and third-party advertising partners. The presence of an ad does not constitute an endorsement or recommendation of the advertised product or service.
              </p>
            </div>
          </div>
        );

      case 'cookie-policy':
        return (
          <div className="space-y-6">
            <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Privacy Settings
              </span>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                Cookie Policy
              </h1>
            </div>

            <div className="prose dark:prose-invert max-w-none text-xs text-slate-700 dark:text-slate-300 space-y-4 leading-relaxed">
              <p>
                This is the Cookie Policy for <strong>{settings.siteName}</strong>. Cookies are small files downloaded to your computer to improve your experience.
              </p>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-2">
                How We Use Cookies
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Session & Authentication Cookies:</strong> To remember user preferences and dark mode toggles.</li>
                <li><strong>AdSense Advertising Cookies:</strong> To serve relevant ads and prevent duplicate ad display.</li>
                <li><strong>Analytics Cookies:</strong> To measure page load speeds and visitor counts.</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
      {renderContent()}
    </div>
  );
};
