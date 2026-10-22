import React, { useState } from 'react';
import { RotateCw, Copy, Trash2, ArrowLeft, ArrowRight, FileText } from 'lucide-react';

export default function PageOrganizer({ onConfigChange }) {
  // Mock 4 default pages if file not yet loaded or initialized
  const [pages, setPages] = useState([
    { id: 1, originalIndex: 0, rotation: 0 },
    { id: 2, originalIndex: 1, rotation: 0 },
    { id: 3, originalIndex: 2, rotation: 0 },
    { id: 4, originalIndex: 3, rotation: 0 },
  ]);

  const updateConfig = (newPages) => {
    setPages(newPages);
    const config = newPages.map((p) => ({
      pageIndex: p.originalIndex,
      rotation: p.rotation,
    }));
    onConfigChange(config);
  };

  const rotatePage = (index) => {
    const updated = [...pages];
    updated[index].rotation = (updated[index].rotation + 90) % 360;
    updateConfig(updated);
  };

  const deletePage = (index) => {
    if (pages.length <= 1) {
      alert('You must retain at least one page in the document.');
      return;
    }
    const updated = pages.filter((_, i) => i !== index);
    updateConfig(updated);
  };

  const duplicatePage = (index) => {
    const target = pages[index];
    const duplicated = {
      id: Date.now(),
      originalIndex: target.originalIndex,
      rotation: target.rotation,
    };
    const updated = [...pages];
    updated.splice(index + 1, 0, duplicated);
    updateConfig(updated);
  };

  const movePage = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= pages.length) return;
    const updated = [...pages];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    updateConfig(updated);
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Page Layout & Organization ({pages.length} Pages)
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Reorder, rotate, duplicate, or remove pages before saving.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
        {pages.map((page, idx) => (
          <div
            key={page.id}
            className="group relative flex flex-col items-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/50 hover:border-brand-500 shadow-sm transition-all"
          >
            {/* Page preview representation with dynamic rotation */}
            <div
              style={{ transform: `rotate(${page.rotation}deg)` }}
              className="w-24 h-32 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center shadow-xs transition-transform duration-200"
            >
              <FileText className="w-8 h-8 text-slate-400 mb-1" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Page {page.originalIndex + 1}
              </span>
              {page.rotation > 0 && (
                <span className="text-[10px] text-brand-600 font-semibold mt-1">
                  {page.rotation}°
                </span>
              )}
            </div>

            <span className="text-xs font-semibold text-slate-500 mt-2">
              Position #{idx + 1}
            </span>

            {/* Controls */}
            <div className="flex items-center space-x-1 mt-2">
              <button
                type="button"
                onClick={() => movePage(idx, idx - 1)}
                disabled={idx === 0}
                className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 rounded"
                title="Move Left"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => rotatePage(idx)}
                className="p-1 text-slate-500 hover:text-brand-600 rounded"
                title="Rotate 90°"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => duplicatePage(idx)}
                className="p-1 text-slate-500 hover:text-emerald-600 rounded"
                title="Duplicate Page"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => deletePage(idx)}
                className="p-1 text-slate-500 hover:text-red-500 rounded"
                title="Delete Page"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => movePage(idx, idx + 1)}
                disabled={idx === pages.length - 1}
                className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 rounded"
                title="Move Right"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
