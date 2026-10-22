import React from 'react';
import { Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ProcessingStatus({ progress = 0, statusText = 'Processing file...' }) {
  const getStage = (p) => {
    if (p < 40) return 'Uploading file to secure sandbox...';
    if (p < 85) return 'Processing transformations & encoding...';
    if (p < 100) return 'Generating final output document...';
    return 'Complete! Preparing download...';
  };

  return (
    <div className="p-8 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm text-center max-w-lg mx-auto space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto shadow-inner">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>

      <div>
        <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          {statusText}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {getStage(progress)}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-brand-600 h-2.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
          <span>Processing</span>
          <span className="text-brand-600 dark:text-brand-400">{progress}%</span>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-center space-x-2 text-[11px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>End-to-end sandbox isolation with auto-cleanup</span>
      </div>
    </div>
  );
}
