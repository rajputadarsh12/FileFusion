import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Lock, 
  Download, 
  FileStack, 
  Layers 
} from 'lucide-react';
import { getToolById, getRelatedTools } from '../../tools/registry';
import { executeToolJob, downloadFile } from '../../services/api';
import { useHistory } from '../../context/HistoryContext';
import Breadcrumbs from '../common/Breadcrumbs';
import Dropzone from '../common/Dropzone';
import ProcessingStatus from './ProcessingStatus';
import DownloadResult from './DownloadResult';
import ToolCard from '../dashboard/ToolCard';

// Specialized interactive viewers
import SignaturePad from '../editor/SignaturePad';
import InteractiveCanvas from '../editor/InteractiveCanvas';
import PageOrganizer from '../editor/PageOrganizer';
import CameraScanner from '../editor/CameraScanner';
import PdfComparisonViewer from '../editor/PdfComparisonViewer';

export default function ReusableToolPage() {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const { recordToolUsage } = useHistory();

  const tool = getToolById(toolId);

  // States
  const [files, setFiles] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [settings, setSettings] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Custom viewer state payloads
  const [signatureData, setSignatureData] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [pageConfig, setPageConfig] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);

  // Initialize tool settings when tool changes
  useEffect(() => {
    if (tool) {
      recordToolUsage(tool.id);
      // Reset state
      setFiles([]);
      setTextInput('');
      setResult(null);
      setError(null);
      setProgress(0);
      setIsProcessing(false);
      setSignatureData(null);
      setAnnotations([]);
      setComparisonData(null);

      // Set defaults for settings
      const initialSettings = {};
      (tool.settings || []).forEach((setting) => {
        if (setting.default !== undefined) {
          initialSettings[setting.id] = setting.default;
        }
      });
      setSettings(initialSettings);
    }
  }, [toolId]);

  if (!tool) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Tool Not Found</h2>
        <p className="text-slate-500 mt-2">The requested utility does not exist or has been moved.</p>
        <Link to="/tools" className="mt-4 inline-block px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold">
          Browse All Tools
        </Link>
      </div>
    );
  }

  const IconComponent = LucideIcons[tool.icon] || LucideIcons.FileText;
  const relatedTools = getRelatedTools(tool.id, 4);

  // Handle setting updates
  const handleSettingChange = (settingId, value) => {
    setSettings((prev) => ({ ...prev, [settingId]: value }));
  };

  // Execute processing job
  const handleProcess = async () => {
    if (files.length === 0 && !textInput && tool.id !== 'scan-to-pdf') {
      setError('Please select or upload at least one file to proceed.');
      return;
    }

    // Validation for tools requiring 2 files
    if (tool.id === 'merge-pdf' && files.length < 2) {
      setError('Merge PDF requires at least 2 PDF files. Click "Add More Files" to include another PDF.');
      return;
    }
    if (tool.id === 'compare-pdf' && files.length < 2) {
      setError('Compare PDF requires exactly 2 PDF versions to inspect.');
      return;
    }

    // Password validation for protect
    if (tool.id === 'protect-pdf') {
      if (!settings.userPassword) {
        setError('Please enter a password to protect the document.');
        return;
      }
      if (settings.userPassword !== settings.confirmPassword) {
        setError('Passwords do not match. Please verify your password.');
        return;
      }
    }

    setError(null);
    setIsProcessing(true);
    setProgress(15);

    try {
      const mergedSettings = { ...settings };
      if (signatureData) mergedSettings.signatureDataUrl = signatureData;
      if (annotations.length > 0) mergedSettings.annotations = annotations;
      if (pageConfig) mergedSettings.operations = pageConfig;

      const response = await executeToolJob({
        endpoint: tool.endpoint,
        files,
        settings: mergedSettings,
        textInput,
        onProgress: (p) => setProgress(p),
      });

      if (tool.id === 'compare-pdf') {
        setComparisonData(response);
      }

      setResult(response);
    } catch (err) {
      setError(err.message || 'Processing failed. Please check your document and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (result && result.downloadUrl) {
      try {
        await downloadFile(result.downloadUrl, result.filename);
      } catch (err) {
        setError('Download failed: ' + err.message);
      }
    }
  };

  const handleReset = () => {
    setFiles([]);
    setTextInput('');
    setResult(null);
    setError(null);
    setProgress(0);
    setComparisonData(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: 'All Tools', to: '/tools' },
          { label: tool.title, to: `/tool/${tool.id}` },
        ]}
      />

      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div className="flex items-center space-x-4">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white shadow-md shadow-brand-500/10 flex-shrink-0`}
          >
            <IconComponent className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {tool.title}
              </h1>
              {tool.popular && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  Popular
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {tool.description}
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start space-x-3 text-red-700 dark:text-red-300 text-sm animate-shake">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{error}</div>
        </div>
      )}

      {/* Processing State View */}
      {isProcessing && (
        <ProcessingStatus progress={progress} statusText={`Processing ${tool.title}...`} />
      )}

      {/* Result Download View */}
      {!isProcessing && result && (
        <div className="space-y-6">
          <DownloadResult
            result={result}
            onDownload={handleDownload}
            onReset={handleReset}
            tool={tool}
          />
          {comparisonData && <PdfComparisonViewer comparisonData={comparisonData} />}
        </div>
      )}

      {/* Main Working Interface (Upload + Custom Viewers + Settings) */}
      {!isProcessing && !result && (
        <div className="space-y-8">
          
          {/* Custom Interactive Viewers */}
          {tool.id === 'organize-pdf' && (
            <PageOrganizer onConfigChange={setPageConfig} />
          )}

          {tool.id === 'edit-pdf' && (
            <InteractiveCanvas onAnnotationsChange={setAnnotations} />
          )}

          {tool.id === 'sign-pdf' && (
            <SignaturePad onSignatureCapture={setSignatureData} />
          )}

          {tool.id === 'scan-to-pdf' && (
            <CameraScanner onScansChange={setFiles} />
          )}

          {/* Standard Dropzone */}
          <Dropzone
            files={files}
            onFilesChange={setFiles}
            accept={tool.accept}
            multiple={tool.multiple}
            maxFiles={tool.maxFiles || 20}
            instructions={tool.instructions}
            allowReorder={tool.hasOrderReorder}
          />

          {/* Text Input for HTML or AI Summarizer */}
          {tool.allowTextInput && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Direct Text / URL Input (Optional)
              </label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={tool.textInputPlaceholder}
                rows={4}
                className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-brand-500"
              />
            </div>
          )}

          {/* Tool Settings Panel */}
          {tool.settings && tool.settings.length > 0 && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700/60 pb-2">
                Tool Configuration & Preferences
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {tool.settings.map((setting) => {
                  // Handle conditional showIf
                  if (setting.showIf) {
                    const [reqKey, reqVal] = Object.entries(setting.showIf)[0];
                    if (settings[reqKey] !== reqVal) return null;
                  }

                  return (
                    <div key={setting.id} className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {setting.label}
                      </label>

                      {setting.type === 'select' && (
                        <select
                          value={settings[setting.id] || setting.default}
                          onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500"
                        >
                          {setting.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      )}

                      {setting.type === 'text' && (
                        <input
                          type="text"
                          value={settings[setting.id] || ''}
                          onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                          placeholder={setting.placeholder}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500"
                        />
                      )}

                      {setting.type === 'password' && (
                        <input
                          type="password"
                          value={settings[setting.id] || ''}
                          onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                          placeholder={setting.placeholder}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500"
                        />
                      )}

                      {setting.type === 'number' && (
                        <input
                          type="number"
                          value={settings[setting.id] ?? setting.default}
                          onChange={(e) => handleSettingChange(setting.id, Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500"
                        />
                      )}

                      {setting.type === 'range' && (
                        <div className="flex items-center space-x-3 pt-1">
                          <input
                            type="range"
                            min={setting.min}
                            max={setting.max}
                            value={settings[setting.id] ?? setting.default}
                            onChange={(e) => handleSettingChange(setting.id, Number(e.target.value))}
                            className="flex-1 accent-brand-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                          />
                          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 w-10 text-right">
                            {settings[setting.id] ?? setting.default}%
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Primary Action Button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleProcess}
              disabled={files.length === 0 && !textInput && tool.id !== 'scan-to-pdf'}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base shadow-lg shadow-brand-600/30 transition-all hover:scale-[1.01]"
            >
              <span>{tool.actionText || 'Process Document'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Related Tools Section */}
      {relatedTools.length > 0 && (
        <div className="border-t border-slate-200 dark:border-slate-800/80 pt-10 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Related Utilities
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Other popular tools for your workflow
              </p>
            </div>
            <Link
              to="/tools"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-1"
            >
              <span>View All 32 Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedTools.map((relTool) => (
              <ToolCard key={relTool.id} tool={relTool} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
