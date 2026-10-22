import React from 'react';
import { ShieldCheck, Lock, Trash2, EyeOff } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Security & Privacy First</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Privacy Policy & Security Standards
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
          Last updated: October 2026. How we protect your files and data.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Trash2 className="w-4 h-4 text-brand-600" />
            <span>1. Automatic Temporary Storage & Deletion</span>
          </h2>
          <p>
            When you upload a file to FileFusion, it is temporarily placed into an isolated server directory with a randomized, cryptographically generated UUID. Files are held exclusively for the duration necessary to process your requested conversion or operation. An automated scheduled worker purges all temporary files within 60 minutes.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <EyeOff className="w-4 h-4 text-emerald-600" />
            <span>2. Zero Content Inspection & No AI Model Training</span>
          </h2>
          <p>
            FileFusion never inspects, indexes, catalogs, or shares your document content. Files are never used to train public machine learning or artificial intelligence models. Processing occurs strictly via sandboxed programmatic libraries.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Lock className="w-4 h-4 text-purple-600" />
            <span>3. Passwords & Cryptographic Protection</span>
          </h2>
          <p>
            When you use the Protect PDF utility, your password is processed in memory solely to compute the standard PDF encryption dictionaries. Passwords are never logged, stored in persistent databases, or transmitted outside the encryption lifecycle.
          </p>
        </div>
      </div>
    </div>
  );
}
