import React, { useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  LayoutGrid, 
  Grid3X3, 
  List, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { CATEGORIES, TOOLS } from '../../tools/registry';

export default function SearchBar({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  viewMode = 'grid',
  onViewModeChange,
  sortBy = 'featured',
  onSortByChange,
  totalResults,
}) {
  const scrollRef = useRef(null);

  // Compute tool counts per category
  const categoryCounts = useMemo(() => {
    const counts = { all: TOOLS.length };
    TOOLS.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, []);

  const scrollCategories = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Search Input Bar */}
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search 32 tools (e.g. compress, merge, pdf to word, sign, ocr, translate)..."
          className="w-full pl-11 pr-10 py-3 sm:py-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent shadow-xs transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}
      </div>

      {/* Horizontal Scrollable Category Filter Pills with Scroll Arrows */}
      <div className="relative max-w-full">
        {/* Left Arrow (Desktop / Wide screen aid) */}
        <button
          onClick={() => scrollCategories('left')}
          aria-label="Scroll categories left"
          className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all opacity-90 hover:opacity-100"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Categories Strip */}
        <div
          ref={scrollRef}
          className="flex items-center space-x-2 overflow-x-auto pb-1.5 scrollbar-none px-1 sm:px-4 scroll-smooth"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`inline-flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30 scale-[1.02]'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200/90 dark:border-slate-700/80'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive
                      ? 'bg-brand-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Arrow (Desktop / Wide screen aid) */}
        <button
          onClick={() => scrollCategories('right')}
          aria-label="Scroll categories right"
          className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all opacity-90 hover:opacity-100"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Screen Controls & Layout Adjuster Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-200/60 dark:border-slate-800/60 px-1">
        
        {/* Results Counter & Active Filters */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {totalResults} {totalResults === 1 ? 'tool' : 'tools'} available
          </span>
          {(searchQuery || activeCategory !== 'all') && (
            <>
              <span>•</span>
              <button
                onClick={() => {
                  onSearchChange('');
                  onCategoryChange('all');
                }}
                className="text-brand-600 dark:text-brand-400 hover:underline font-medium"
              >
                Reset filters
              </button>
            </>
          )}
        </div>

        {/* View Mode & Sort Controls */}
        <div className="flex items-center justify-between sm:justify-end space-x-3">
          {/* Sort Selector */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-400 hidden xs:inline flex items-center">
              <ArrowUpDown className="w-3.5 h-3.5 mr-1" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="featured">Recommended</option>
              <option value="popular">Most Popular</option>
              <option value="alpha-asc">Alphabetical (A - Z)</option>
              <option value="alpha-desc">Alphabetical (Z - A)</option>
            </select>
          </div>

          {/* Density & Layout Switcher (Grid, Compact, List) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onViewModeChange('grid')}
              title="Standard Grid View"
              aria-label="Standard Grid View"
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('compact')}
              title="Compact Dense View"
              aria-label="Compact Dense View"
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'compact'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              title="Detailed List View"
              aria-label="Detailed List View"
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
