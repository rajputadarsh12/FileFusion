import React from 'react';
import { FileText, ShieldAlert } from 'lucide-react';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
          Guidelines and terms for using FileFusion document utilities.
        </p>
      </div>

      <div className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 space-y-6 leading-relaxed">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          1. Acceptable Use Policy
        </h2>
        <p>
          You agree to use FileFusion in compliance with all applicable local, national, and international laws. You must not upload or process files containing malware, viruses, ransomware, unauthorized personal identification information, or content that infringes upon copyright or intellectual property rights.
        </p>

        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          2. Password Recovery & Decryption
        </h2>
        <p>
          The Unlock PDF utility is intended strictly for authorized document owners who possess legitimate access permissions. FileFusion does not facilitate bypassing encryption on unauthorized third-party documents.
        </p>

        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          3. Service Availability & Performance
        </h2>
        <p>
          FileFusion is provided "as is" and "as available". While we maintain continuous uptime and high reliability, processing throughput is subject to temporary server load and network conditions.
        </p>
      </div>
    </div>
  );
}
