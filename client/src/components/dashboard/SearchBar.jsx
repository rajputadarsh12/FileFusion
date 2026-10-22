import React from 'react';
import { Search, X } from 'lucide-react';
import { CATEGORIES } from '../../tools/registry';

export default function SearchBar({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  totalResults,
}) {
  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search 30+ tools (e.g. compress, merge, word, sign, ocr, translate)..."
          className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent shadow-sm transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30 scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Count Indicator */}
      <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>Showing {totalResults} available tools</span>
        {searchQuery && (
          <button
            onClick={() => {
              onSearchChange('');
              onCategoryChange('all');
            }}
            className="text-brand-600 dark:text-brand-400 hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
