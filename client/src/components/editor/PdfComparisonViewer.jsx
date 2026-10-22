import React from 'react';
import { FileDiff, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function PdfComparisonViewer({ comparisonData }) {
  if (!comparisonData) return null;

  const { file1, file2, text1Preview, text2Preview, differencesCount } = comparisonData;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <FileDiff className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Document Comparison Analysis
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {differencesCount === 0
                ? 'Both documents are structurally identical'
                : `Detected approximately ${differencesCount} word variations between versions`}
            </p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          differencesCount === 0
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
            : 'bg-amber-50 text-amber-600 border border-amber-200'
        }`}>
          {differencesCount === 0 ? 'Match 100%' : 'Variations Found'}
        </span>
      </div>

      {/* Side-by-side Viewports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Version A */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50/60 dark:bg-slate-900/40 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Version A: {file1?.name}</span>
            <span className="text-slate-400">{file1?.pages} pages | {file1?.wordCount} words</span>
          </div>
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-600 dark:text-slate-300 max-h-64 overflow-y-auto whitespace-pre-wrap leading-relaxed">
            {text1Preview || 'No text extracted from document 1.'}
          </div>
        </div>

        {/* Version B */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50/60 dark:bg-slate-900/40 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Version B: {file2?.name}</span>
            <span className="text-slate-400">{file2?.pages} pages | {file2?.wordCount} words</span>
          </div>
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-600 dark:text-slate-300 max-h-64 overflow-y-auto whitespace-pre-wrap leading-relaxed">
            {text2Preview || 'No text extracted from document 2.'}
          </div>
        </div>
      </div>
    </div>
  );
}
