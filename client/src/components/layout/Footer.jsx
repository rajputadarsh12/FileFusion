import React from 'react';
import { Link } from 'react-router-dom';
import { FileStack, ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 text-slate-600 dark:text-slate-400 text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                <FileStack className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                File<span className="text-brand-600 dark:text-brand-400">Fusion</span>
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
              The modern, all-in-one suite for all your PDF, document, image, and office workflow needs. Fast, private, and effortless.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>Files are securely processed and auto-purged within 60 minutes.</span>
            </div>
          </div>

          {/* Column 1: PDF Tools */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-3">PDF Essentials</h3>
            <ul className="space-y-2">
              <li><Link to="/tool/merge-pdf" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Merge PDF</Link></li>
              <li><Link to="/tool/split-pdf" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Split PDF</Link></li>
              <li><Link to="/tool/compress-pdf" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Compress PDF</Link></li>
              <li><Link to="/tool/organize-pdf" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Organize Pages</Link></li>
              <li><Link to="/tool/rotate-pdf" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Rotate PDF</Link></li>
              <li><Link to="/tool/crop-pdf" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Crop Margins</Link></li>
            </ul>
          </div>

          {/* Column 2: Conversions */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-3">Conversions</h3>
            <ul className="space-y-2">
              <li><Link to="/tool/pdf-to-word" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">PDF to Word</Link></li>
              <li><Link to="/tool/word-to-pdf" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Word to PDF</Link></li>
              <li><Link to="/tool/pdf-to-excel" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">PDF to Excel</Link></li>
              <li><Link to="/tool/excel-to-pdf" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Excel to PDF</Link></li>
              <li><Link to="/tool/jpg-to-pdf" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Image to PDF</Link></li>
              <li><Link to="/tool/pdf-to-jpg" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">PDF to JPG</Link></li>
            </ul>
          </div>

          {/* Column 3: Advanced & Security */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-3">Security & AI</h3>
            <ul className="space-y-2">
              <li><Link to="/tool/edit-pdf" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Interactive Editor</Link></li>
              <li><Link to="/tool/sign-pdf" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Sign Document</Link></li>
              <li><Link to="/tool/protect-pdf" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Protect with Password</Link></li>
              <li><Link to="/tool/ocr-pdf" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">OCR Text Extraction</Link></li>
              <li><Link to="/tool/ai-summarizer" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">AI Summarizer</Link></li>
              <li><Link to="/tool/translate-pdf" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Translate PDF</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} FileFusion Inc. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link to="/privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">About & Security</Link>
            <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
