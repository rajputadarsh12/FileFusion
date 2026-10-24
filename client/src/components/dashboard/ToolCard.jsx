import React from 'react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function ToolCard({ tool, viewMode = 'grid' }) {
  // Dynamically resolve icon from Lucide
  const IconComponent = LucideIcons[tool.icon] || LucideIcons.FileText;

  // List View (Horizontal row layout)
  if (viewMode === 'list') {
    return (
      <Link
        to={`/tool/${tool.id}`}
        className="group relative flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-brand-500/50 dark:hover:border-brand-500/50 transition-all duration-200 hover:-translate-y-0.5"
      >
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1 pr-2">
          <div
            className={`shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200`}
          >
            <IconComponent className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                {tool.title}
              </h3>
              {tool.popular && (
                <span className="hidden xs:inline-flex items-center space-x-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 shrink-0">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Popular</span>
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
              {tool.description}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center space-x-2">
          <span className="hidden sm:inline-block px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 group-hover:bg-brand-600 group-hover:text-white transition-all">
            Use Tool
          </span>
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-all">
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </Link>
    );
  }

  // Compact View (Dense grid card)
  if (viewMode === 'compact') {
    return (
      <Link
        to={`/tool/${tool.id}`}
        className="group relative flex flex-col justify-between p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-lg hover:border-brand-500/50 dark:hover:border-brand-500/50 transition-all duration-200 hover:-translate-y-0.5"
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <div
              className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform duration-200`}
            >
              <IconComponent className="w-4.5 h-4.5" />
            </div>
            {tool.popular && (
              <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                <Sparkles className="w-2.5 h-2.5" />
                <span className="hidden xs:inline">Popular</span>
              </span>
            )}
          </div>

          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
            {tool.title}
          </h3>
          <p className="mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-1 leading-snug">
            {tool.description}
          </p>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-semibold text-brand-600 dark:text-brand-400">
          <span>Use Tool</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    );
  }

  // Standard Grid View (Fluid & responsive)
  return (
    <Link
      to={`/tool/${tool.id}`}
      className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:border-brand-500/50 dark:hover:border-brand-500/50 transition-all duration-300 hover:-translate-y-1"
    >
      <div>
        {/* Header: Icon & Popular badge */}
        <div className="flex items-center justify-between mb-3.5 sm:mb-4">
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white shadow-md shadow-slate-200 dark:shadow-none group-hover:scale-110 transition-transform duration-300`}
          >
            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          {tool.popular && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
              <Sparkles className="w-3 h-3" />
              <span>Popular</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {tool.title}
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Footer link arrow */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-brand-600 dark:text-brand-400">
        <span>Use Tool</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
