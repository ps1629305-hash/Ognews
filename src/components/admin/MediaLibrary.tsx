import React, { useState } from 'react';
import { Image, Copy, Check, Upload, Plus } from 'lucide-react';

const PRESET_MEDIA = [
  { id: '1', name: 'AI Server Rack', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' },
  { id: '2', name: 'Cyber Security Grid', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80' },
  { id: '3', name: 'Code Editor Monitor', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80' },
  { id: '4', name: 'Quantum Processor', url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80' },
  { id: '5', name: 'Smartphone Microchip', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80' },
  { id: '6', name: 'Cloud Infrastructure', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80' },
];

export const MediaLibrary: React.FC = () => {
  const [mediaList, setMediaList] = useState(PRESET_MEDIA);
  const [customUrl, setCustomUrl] = useState('');
  const [customName, setCustomName] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl) return;

    setMediaList([
      { id: Date.now().toString(), name: customName || 'Custom Image', url: customUrl },
      ...mediaList,
    ]);
    setCustomUrl('');
    setCustomName('');
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <Image className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Media Library & Image Manager
          </h3>
        </div>

        <form onSubmit={handleAddMedia} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Image label / title..."
            className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
          />
          <input
            type="url"
            required
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Image URL (e.g. Unsplash or CDN URL)..."
            className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
          />
          <button
            type="submit"
            className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Media Library</span>
          </button>
        </form>
      </div>

      {/* Grid of Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {mediaList.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 group"
          >
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100">
              <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                {item.name}
              </span>

              <button
                onClick={() => handleCopy(item.id, item.url)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white transition font-bold text-[11px] flex items-center space-x-1"
              >
                {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === item.id ? 'Copied!' : 'Copy URL'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
