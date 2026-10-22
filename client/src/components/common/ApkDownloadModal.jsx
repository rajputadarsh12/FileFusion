import React from 'react';
import { Download, Smartphone, X, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ApkDownloadModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Android Badge */}
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-inner">
            <Smartphone className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              FileFusion for Android
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Download the official standalone Android APK (v1.0.0)
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>All 32 PDF, Word, Excel, and image utilities on your phone</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Built-in mobile camera scanner with auto-contrast</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Fast, secure, and privacy-protected sandbox</span>
          </div>
        </div>

        {/* Direct Download Button */}
        <div className="space-y-3">
          <a
            href="/downloads/FileFusion.apk"
            download="FileFusion.apk"
            onClick={() => setTimeout(onClose, 1000)}
            className="w-full inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
          >
            <Download className="w-5 h-5" />
            <span>Download FileFusion.apk</span>
          </a>

          <div className="text-[11px] text-center text-slate-400">
            Compatible with Android 8.0 (Oreo) and newer • Size: ~4.4 MB (Native Android App)
          </div>
        </div>

        {/* Simple 3-step Installation Guide */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2 text-xs">
          <p className="font-bold text-slate-800 dark:text-slate-200">
            How to Install:
          </p>
          <ol className="list-decimal pl-4 space-y-1 text-slate-500 dark:text-slate-400">
            <li>Click <strong>Download FileFusion.apk</strong> above.</li>
            <li>Tap the downloaded notification or open it in your Files app.</li>
            <li>If prompted, enable <em>"Allow from this source"</em> to install.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
