import React from 'react';
import { 
  Download, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  ArrowDownRight, 
  FileCheck,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { formatBytes } from '../../utils/fileSize';

export default function DownloadResult({
  result,
  onDownload,
  onReset,
  tool,
}) {
  const hasStats = result.originalSize && result.compressedSize;

  return (
    <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xl max-w-2xl mx-auto space-y-6 text-center animate-fade-in">
      
      {/* Success Badge */}
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
        <CheckCircle2 className="w-9 h-9" />
      </div>

      <div>
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Ready for Download!
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Your document was successfully processed and formatted.
        </p>
      </div>

      {/* Before / After Stats Card */}
      {hasStats && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 grid grid-cols-3 gap-2 items-center text-center">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Original</span>
            <span className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300">
              {formatBytes(result.originalSize)}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full inline-flex items-center space-x-0.5">
              <ArrowDownRight className="w-3 h-3" />
              <span>{result.percentage}% Saved</span>
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">({formatBytes(result.savedBytes)} reduced)</span>
          </div>

          <div>
            <span className="text-xs text-slate-400 block font-medium">Compressed</span>
            <span className="text-sm sm:text-base font-extrabold text-brand-600 dark:text-brand-400">
              {formatBytes(result.compressedSize)}
            </span>
          </div>
        </div>
      )}

      {/* Excel Table Extraction Preview */}
      {result.previewData && (
        <div className="text-left rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="bg-slate-100 dark:bg-slate-700/60 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            Extracted Table Preview (First {result.previewData.length} Rows)
          </div>
          <div className="overflow-x-auto max-h-48 text-xs">
            <table className="w-full divide-y divide-slate-200 dark:divide-slate-700">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {result.previewData.map((row, rIdx) => (
                  <tr key={rIdx} className={rIdx === 0 ? 'bg-slate-50 dark:bg-slate-800 font-semibold' : ''}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-1.5 whitespace-nowrap text-slate-600 dark:text-slate-300">
                        {String(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Summary Preview */}
      {result.summary && (
        <div className="text-left p-4 rounded-2xl bg-violet-50/70 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-violet-700 dark:text-violet-300">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{result.title || 'Summary Insights'}</span>
            </span>
            <span className="text-[10px] opacity-80">{result.engine}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
            {result.summary}
          </p>
        </div>
      )}

      {/* Notice / Warning Message */}
      {(result.notice || result.warning) && (
        <div className="flex items-center space-x-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-4 py-2.5 rounded-xl text-left">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{result.notice || result.warning}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        {result.downloadUrl && (
          <button
            onClick={onDownload}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold text-sm shadow-md shadow-brand-600/30 transition-all hover:scale-[1.02]"
          >
            <Download className="w-4 h-4" />
            <span>Download {result.isZip ? 'Archive (.zip)' : 'Result'}</span>
          </button>
        )}

        <button
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Process Another File</span>
        </button>
      </div>

      <div className="text-[11px] text-slate-400">
        Temporary file will be permanently deleted from servers within 60 minutes.
      </div>
    </div>
  );
}
