import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Clock, 
  Grid, 
  Layers, 
  Search, 
  Filter, 
  ArrowRight, 
  UploadCloud 
} from 'lucide-react';
import { TOOLS, CATEGORIES, getToolById, getPopularTools } from '../tools/registry';
import { useHistory } from '../context/HistoryContext';
import SearchBar from '../components/dashboard/SearchBar';
import ToolCard from '../components/dashboard/ToolCard';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('filefusion-tools-viewmode') || 'grid';
    } catch {
      return 'grid';
    }
  });

  const { recentToolIds } = useHistory();

  // Persist view mode preference
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('filefusion-tools-viewmode', mode);
    } catch (e) {
      // Ignore localStorage errors
    }
  };

  // Filter & Sort tools
  const filteredTools = useMemo(() => {
    let list = TOOLS.filter((tool) => {
      const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.id.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });

    // Sorting
    if (sortBy === 'popular') {
      list = [...list].sort((a, b) => {
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        return a.title.localeCompare(b.title);
      });
    } else if (sortBy === 'alpha-asc') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'alpha-desc') {
      list = [...list].sort((a, b) => b.title.localeCompare(a.title));
    }

    return list;
  }, [searchQuery, activeCategory, sortBy]);

  const recentTools = useMemo(() => {
    return recentToolIds.map((id) => getToolById(id)).filter(Boolean);
  }, [recentToolIds]);

  // Responsive grid layout classes according to view mode & screen
  const getGridClasses = () => {
    if (viewMode === 'list') {
      return 'grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-3';
    }
    if (viewMode === 'compact') {
      return 'grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-2.5 sm:gap-3';
    }
    // Standard Grid view
    return 'grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5';
  };

  return (
    <div className="max-w-[1700px] w-full mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-10 space-y-8 sm:space-y-12">
      
      {/* Welcome Banner & Search Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          FileFusion Tool Center
        </h1>
        <p className="text-xs sm:text-base text-slate-500 dark:text-slate-400">
          Search or browse our full collection of 32 document, image, and office utilities.
        </p>
      </div>

      {/* Instant Search, Filter Pills & View Layout Controls */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        totalResults={filteredTools.length}
      />

      {/* Recently Used Tools (if no active search & in all view) */}
      {!searchQuery && activeCategory === 'all' && recentTools.length > 0 && (
        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Clock className="w-4 h-4 text-brand-600" />
            <span>Recently Used</span>
          </div>
          <div className={getGridClasses()}>
            {recentTools.slice(0, 4).map((tool) => (
              <ToolCard key={`recent-${tool.id}`} tool={tool} viewMode={viewMode} />
            ))}
          </div>
        </section>
      )}

      {/* Main Filtered Tools Grid */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <Grid className="w-4 h-4 text-brand-600" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {activeCategory === 'all' ? 'All Document Tools' : CATEGORIES.find((c) => c.id === activeCategory)?.name}
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {filteredTools.length} tools available
          </span>
        </div>

        {filteredTools.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700/80 p-8">
            <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
              No tools matching "{searchQuery}"
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try checking for spelling errors or clear filters.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold hover:bg-brand-700 transition-colors"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className={getGridClasses()}>
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} viewMode={viewMode} />
            ))}
          </div>
        )}
      </section>

      {/* Category Breakdown Sections (if in All Tools mode without query) */}
      {!searchQuery && activeCategory === 'all' && (
        <div className="space-y-10 sm:space-y-12 pt-6 sm:pt-8 border-t border-slate-200/60 dark:border-slate-800/60">
          {CATEGORIES.filter((c) => c.id !== 'all').map((category) => {
            const catTools = TOOLS.filter((t) => t.category === category.id);
            if (catTools.length === 0) return null;

            return (
              <section key={category.id} className="space-y-3 sm:space-y-4">
                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {category.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {category.description}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveCategory(category.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="self-start xs:self-center text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-1"
                  >
                    <span>View Category ({catTools.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className={getGridClasses()}>
                  {catTools.map((tool) => (
                    <ToolCard key={`cat-${category.id}-${tool.id}`} tool={tool} viewMode={viewMode} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
