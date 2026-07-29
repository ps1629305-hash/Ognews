import React, { useState, useEffect } from 'react';
import { Download, Code, Database, Server, Copy, Check, ShieldCheck, Terminal } from 'lucide-react';
import { fetchPHPExport } from '../../lib/api';

export const ExportPHP: React.FC = () => {
  const [data, setData] = useState<{ sqlSchema: string; phpDbCode: string; instructions: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchPHPExport()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return <div className="p-10 text-center text-slate-400 text-xs">Generating PHP 8 & MySQL package...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 rounded-3xl text-white space-y-3 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <Server className="w-5 h-5" />
          <span>PHP 8 + MySQL Shared Hosting Production Deployment</span>
        </div>
        <h2 className="text-2xl font-black tracking-tight">
          Export Full-Stack PHP & MySQL Codebase
        </h2>
        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          Need to deploy ApexPulse on traditional cPanel / Apache / PHP 8 / MySQL web hosting (HostGator, Bluehost, Namecheap)? Download the complete database SQL schema and PDO connector script below.
        </p>

        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={() => handleDownloadFile('schema.sql', data?.sqlSchema || '')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition flex items-center space-x-1.5 shadow-md"
          >
            <Database className="w-4 h-4" />
            <span>Download schema.sql</span>
          </button>

          <button
            onClick={() => handleDownloadFile('db.php', data?.phpDbCode || '')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition flex items-center space-x-1.5 shadow-md"
          >
            <Code className="w-4 h-4" />
            <span>Download db.php</span>
          </button>
        </div>
      </div>

      {/* SQL Schema Preview Card */}
      <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              1. MySQL Database Schema (schema.sql)
            </h3>
          </div>

          <button
            onClick={() => handleCopy('sql', data?.sqlSchema || '')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-amber-500 hover:text-slate-950 transition font-bold text-xs flex items-center space-x-1"
          >
            {copiedKey === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'sql' ? 'Copied SQL' : 'Copy SQL'}</span>
          </button>
        </div>

        <pre className="bg-slate-950 text-amber-300 p-4 rounded-xl text-[11px] font-mono overflow-x-auto max-h-60 leading-relaxed">
          {data?.sqlSchema}
        </pre>
      </div>

      {/* PHP Connector Code */}
      <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              2. PHP PDO Database Connector (db.php)
            </h3>
          </div>

          <button
            onClick={() => handleCopy('php', data?.phpDbCode || '')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white transition font-bold text-xs flex items-center space-x-1"
          >
            {copiedKey === 'php' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'php' ? 'Copied PHP' : 'Copy PHP'}</span>
          </button>
        </div>

        <pre className="bg-slate-950 text-blue-300 p-4 rounded-xl text-[11px] font-mono overflow-x-auto max-h-60 leading-relaxed">
          {data?.phpDbCode}
        </pre>
      </div>

      {/* Setup Instructions */}
      <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <Terminal className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            3. cPanel Shared Hosting Deployment Steps
          </h3>
        </div>

        <div className="prose dark:prose-invert max-w-none text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">
          {data?.instructions}
        </div>
      </div>
    </div>
  );
};
