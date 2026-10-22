import React, { useState } from 'react';
import { Type, Square, Plus, Trash2 } from 'lucide-react';

export default function InteractiveCanvas({ onAnnotationsChange }) {
  const [annotations, setAnnotations] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const [fontSize, setFontSize] = useState(14);
  const [color, setColor] = useState('#ef4444');

  const addTextAnnotation = () => {
    if (!currentText.trim()) return;
    const newAnn = {
      id: Date.now(),
      type: 'text',
      text: currentText,
      x: 60,
      y: 700 - annotations.length * 30,
      fontSize: Number(fontSize) || 14,
      color,
      pageIndex: 0,
    };
    const updated = [...annotations, newAnn];
    setAnnotations(updated);
    onAnnotationsChange(updated);
    setCurrentText('');
  };

  const addBoxAnnotation = () => {
    const newAnn = {
      id: Date.now(),
      type: 'rectangle',
      x: 50,
      y: 650 - annotations.length * 40,
      width: 140,
      height: 40,
      borderWidth: 2,
      color,
      pageIndex: 0,
    };
    const updated = [...annotations, newAnn];
    setAnnotations(updated);
    onAnnotationsChange(updated);
  };

  const removeAnnotation = (id) => {
    const updated = annotations.filter((a) => a.id !== id);
    setAnnotations(updated);
    onAnnotationsChange(updated);
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Annotations & Overlay Elements
        </h4>
        <span className="text-xs text-brand-600 dark:text-brand-400">
          {annotations.length} items added
        </span>
      </div>

      {/* Add Text Controls */}
      <div className="flex gap-2">
        <input
          type="text"
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          placeholder="Enter text annotation to add..."
          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-brand-500"
          onKeyDown={(e) => e.key === 'Enter' && addTextAnnotation()}
        />
        <select
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="px-2 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs"
        >
          <option value="#ef4444">Red</option>
          <option value="#0284c7">Blue</option>
          <option value="#10b981">Green</option>
          <option value="#0f172a">Black</option>
        </select>
        <button
          type="button"
          onClick={addTextAnnotation}
          className="flex items-center space-x-1 px-3 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold hover:bg-brand-700"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Text</span>
        </button>
        <button
          type="button"
          onClick={addBoxAnnotation}
          className="flex items-center space-x-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700"
          title="Add Rectangle Outline"
        >
          <Square className="w-3.5 h-3.5" />
          <span>Add Box</span>
        </button>
      </div>

      {/* Added Elements List */}
      {annotations.length > 0 && (
        <div className="space-y-1.5 pt-2">
          {annotations.map((ann) => (
            <div
              key={ann.id}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 text-xs border border-slate-200/60 dark:border-slate-700/60"
            >
              <div className="flex items-center space-x-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: ann.color }}
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {ann.type === 'text' ? `Text: "${ann.text}"` : 'Rectangle Box'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeAnnotation(ann.id)}
                className="text-slate-400 hover:text-red-500"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
