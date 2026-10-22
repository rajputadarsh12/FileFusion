import React from 'react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function ToolCard({ tool }) {
  // Dynamically resolve icon from Lucide
  const IconComponent = LucideIcons[tool.icon] || LucideIcons.FileText;

  return (
    <Link
      to={`/tool/${tool.id}`}
      className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:border-brand-500/50 dark:hover:border-brand-500/50 transition-all duration-300 hover:-translate-y-1"
    >
      <div>
        {/* Header: Icon & Popular badge */}
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white shadow-md shadow-slate-200 dark:shadow-none group-hover:scale-110 transition-transform duration-300`}
          >
            <IconComponent className="w-6 h-6" />
          </div>

          {tool.popular && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
              <Sparkles className="w-3 h-3" />
              <span>Popular</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
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
