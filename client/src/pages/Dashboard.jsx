import React, { useState, useMemo } from 'react';
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
import Dropzone from '../components/common/Dropzone';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { recentToolIds } = useHistory();

  // Filter tools based on query & category
  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.id.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const recentTools = useMemo(() => {
    return recentToolIds.map((id) => getToolById(id)).filter(Boolean);
  }, [recentToolIds]);

  const popularTools = useMemo(() => getPopularTools(), []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* Welcome Banner & Search Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          FileFusion Tool Center
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Search or browse our full collection of 32 document, image, and office utilities.
        </p>
      </div>

      {/* Instant Search & Category Pills */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        totalResults={filteredTools.length}
      />

      {/* Recently Used Tools (if no active search) */}
      {!searchQuery && activeCategory === 'all' && recentTools.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Clock className="w-4 h-4 text-brand-600" />
            <span>Recently Used</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentTools.slice(0, 4).map((tool) => (
              <ToolCard key={`recent-${tool.id}`} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Main Filtered Tools Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <Grid className="w-4 h-4 text-brand-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {activeCategory === 'all' ? 'All Document Tools' : CATEGORIES.find((c) => c.id === activeCategory)?.name}
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {filteredTools.length} tools available
          </span>
        </div>

        {filteredTools.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700/80 p-8">
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">
              No tools matching "{searchQuery}"
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try checking for spelling errors or clear filters.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </section>

      {/* Category Breakdown Sections (if in All Tools mode without query) */}
      {!searchQuery && activeCategory === 'all' && (
        <div className="space-y-12 pt-8">
          {CATEGORIES.filter((c) => c.id !== 'all').map((category) => {
            const catTools = TOOLS.filter((t) => t.category === category.id);
            if (catTools.length === 0) return null;

            return (
              <section key={category.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {category.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {category.description}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveCategory(category.id)}
                    className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-1"
                  >
                    <span>View Category</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {catTools.map((tool) => (
                    <ToolCard key={`cat-${category.id}-${tool.id}`} tool={tool} />
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
