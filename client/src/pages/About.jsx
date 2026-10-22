import React from 'react';
import { ShieldCheck, Cpu, Lock, Sparkles, Server } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About FileFusion
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          One Workspace. Every File Solution. Engineered for privacy, speed, and reliability.
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm sm:text-base space-y-6 leading-relaxed">
        <p>
          <strong>FileFusion</strong> was designed to replace cluttered, fragmented online tools with a clean, unified, and genuine document utility platform. Inspired by the utility of tools like iLovePDF and Smallpdf, FileFusion delivers an original, privacy-first interface where every single operation produces authentic, standards-compliant output.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-brand-600 flex items-center justify-center mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">High-Performance Engines</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Powered by native JavaScript and Node.js engines including <code>pdf-lib</code>, <code>sharp</code>, <code>mammoth</code>, <code>docx</code>, and <code>xlsx</code> for deterministic document processing without heavy external daemons.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">Zero Data Retention</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Uploaded files are processed in isolated sandbox directories with cryptographically unique identifiers and automatically purged within 60 minutes.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4">
          Our Architectural Principles
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>No Mock Downloads:</strong> Every tool executes actual algorithms and returns real documents.</li>
          <li><strong>SSRF & Path Traversal Guards:</strong> Rigorous server-side sanitization prevents malicious URL fetching or filesystem escape.</li>
          <li><strong>Accessibility & Responsiveness:</strong> Smooth user interface designed for high-efficiency desktop workflows and mobile on-the-go scans.</li>
        </ul>
      </div>
    </div>
  );
}
