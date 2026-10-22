import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Award, 
  Lock, 
  FileText, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  UploadCloud,
  Layers,
  FileCheck2,
  CheckCircle2,
  Smartphone
} from 'lucide-react';
import { getPopularTools, getQuickActionTools, CATEGORIES, getToolsByCategory } from '../tools/registry';
import ToolCard from '../components/dashboard/ToolCard';
import ApkDownloadModal from '../components/common/ApkDownloadModal';

export default function Landing() {
  const navigate = useNavigate();
  const [apkModalOpen, setApkModalOpen] = useState(false);
  const popularTools = getPopularTools();
  const quickActions = getQuickActionTools();
  const [openFaq, setOpenFaq] = useState(0);

  // Quick drag drop on landing
  const handleLandingFileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer?.files || e.target?.files;
    if (files && files.length > 0) {
      const file = files[0];
      const name = file.name.toLowerCase();
      if (name.endsWith('.pdf')) {
        navigate('/tool/compress-pdf');
      } else if (name.match(/\.(docx|doc)$/)) {
        navigate('/tool/word-to-pdf');
      } else if (name.match(/\.(xlsx|xls)$/)) {
        navigate('/tool/excel-to-pdf');
      } else if (name.match(/\.(jpg|jpeg|png|webp)$/)) {
        navigate('/tool/jpg-to-pdf');
      } else {
        navigate('/tools');
      }
    }
  };

  const faqs = [
    {
      q: 'Are my uploaded files safe and private?',
      a: 'Yes, absolutely. FileFusion implements strict end-to-end sandbox isolation. Your documents are never used for machine learning training, and all temporary files are automatically and permanently purged within 60 minutes.',
    },
    {
      q: 'Do I need to install any software or plugins?',
      a: 'No installation is needed. All 32 tools run directly inside your modern web browser and our cloud-optimized processing engines. It works seamlessly across Windows, Mac, Linux, iOS, and Android.',
    },
    {
      q: 'What is the maximum file size supported?',
      a: 'You can upload documents and image bundles up to 100 MB per processing session. High compression algorithms and chunked streaming ensure swift performance even with heavy presentations and large spreadsheets.',
    },
    {
      q: 'Can I convert scanned PDF documents into editable Word or Excel files?',
      a: 'Yes! FileFusion includes built-in OCR (Optical Character Recognition) supporting multiple languages including English, Spanish, French, German, and Hindi to extract text from scanned documents with over 98% accuracy.',
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-20 overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Glow backdrop decorative */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/10 dark:bg-brand-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 text-xs font-bold shadow-xs mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>32 Professional Utilities. Zero Installation.</span>
        </div>

        {/* Heading & Subtitle */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-[1.12]">
          Every File Tool You Need.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600">
            All in One Place.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Compress, convert, edit, organize, and secure your documents with a simple and powerful workspace.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/tools"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-base shadow-xl shadow-brand-600/30 transition-all hover:scale-105"
          >
            <span>Explore All Tools</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <button
            type="button"
            onClick={() => setApkModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-base shadow-xl shadow-emerald-600/25 transition-all hover:scale-105"
          >
            <Smartphone className="w-5 h-5" />
            <span>Download Android APK</span>
          </button>

          <Link
            to="/tools"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-base hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-sm transition-all"
          >
            <span>Start Using Free Tools</span>
          </Link>
        </div>

        {/* Interactive Drag & Drop Box */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleLandingFileDrop}
          className="mt-12 max-w-3xl mx-auto p-8 rounded-3xl border-2 border-dashed border-brand-400/80 dark:border-brand-500/60 bg-white/80 dark:bg-slate-800/60 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all"
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Drop any document here to automatically open the right tool
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Drop PDF, DOCX, XLSX, PPTX, or JPG images to start instantly
              </p>
            </div>
            <label className="cursor-pointer px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity">
              <span>Select File</span>
              <input type="file" onChange={handleLandingFileDrop} className="hidden" />
            </label>
          </div>
        </div>

        {/* Quick Action Cards */}
        <div className="mt-12 max-w-5xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
            Instant Quick Actions
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {quickActions.map((tool) => (
              <Link
                key={tool.id}
                to={`/tool/${tool.id}`}
                className="flex flex-col items-center p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-brand-500 shadow-xs hover:shadow-md transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 text-center">
                  {tool.title}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Modern Illustration Badge Section */}
        <div className="mt-16 pt-8 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-500 dark:text-slate-400">
          <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900/40">
            <span>PDF</span>
          </span>
          <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40">
            <span>DOCX</span>
          </span>
          <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
            <span>XLSX</span>
          </span>
          <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400 border border-orange-200 dark:border-orange-900/40">
            <span>PPTX</span>
          </span>
          <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-900/40">
            <span>JPG / PNG</span>
          </span>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Most Used by Millions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Popular Document Tools
            </h2>
          </div>
          <Link
            to="/tools"
            className="inline-flex items-center space-x-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            <span>View All 32 Tools</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularTools.slice(0, 8).map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section id="features" className="bg-white dark:bg-navy-950 border-y border-slate-200 dark:border-slate-800 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Built for Modern Productivity
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
              A high-precision document engine that balances lightning speed, pixel perfection, and enterprise-grade privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Blazing Speed</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Hardware-accelerated processing ensures conversions, merges, and compressions complete in seconds.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Total Privacy</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Files are strictly isolated in sandboxes and permanently deleted automatically within 60 minutes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Flawless Quality</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Preserve headings, tables, vectors, slide layouts, and embedded imagery without distortion.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">100% Functional</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                No simulated or fake downloads. Every tool produces real, compliant, and downloadable outputs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Everything you need to know about FileFusion security, limits, and file formats.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-slate-900 dark:text-white hover:text-brand-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-brand-600 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* APK Download Modal */}
      <ApkDownloadModal isOpen={apkModalOpen} onClose={() => setApkModalOpen(false)} />
    </div>
  );
}
