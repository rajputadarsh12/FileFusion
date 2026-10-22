import React from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  UploadCloud, 
  File, 
  FileText, 
  Image as ImageIcon, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { formatBytes } from '../../utils/fileSize';

export default function Dropzone({
  files = [],
  onFilesChange,
  accept,
  multiple = false,
  maxFiles = 20,
  maxSize = 100 * 1024 * 1024, // 100MB
  instructions = 'Drag & drop your files here, or click to browse',
  allowReorder = false,
}) {
  const onDrop = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      const firstError = rejectedFiles[0].errors[0];
      alert(`File upload error: ${firstError?.message || 'Invalid file type or size exceeded.'}`);
    }

    if (acceptedFiles.length > 0) {
      if (multiple) {
        onFilesChange([...files, ...acceptedFiles].slice(0, maxFiles));
      } else {
        onFilesChange([acceptedFiles[0]]);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxSize,
    maxFiles: multiple ? maxFiles : 1,
  });

  const removeFile = (indexToRemove) => {
    onFilesChange(files.filter((_, idx) => idx !== indexToRemove));
  };

  const moveFile = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= files.length) return;
    const newFiles = [...files];
    const [moved] = newFiles.splice(fromIndex, 1);
    newFiles.splice(toIndex, 0, moved);
    onFilesChange(newFiles);
  };

  const getFileIcon = (file) => {
    const name = file.name.toLowerCase();
    if (name.endsWith('.pdf')) return <FileText className="w-6 h-6 text-red-500 flex-shrink-0" />;
    if (name.match(/\.(jpg|jpeg|png|webp|bmp)$/)) return <ImageIcon className="w-6 h-6 text-purple-500 flex-shrink-0" />;
    if (name.match(/\.(docx|doc)$/)) return <FileText className="w-6 h-6 text-blue-500 flex-shrink-0" />;
    if (name.match(/\.(xlsx|xls)$/)) return <FileText className="w-6 h-6 text-emerald-500 flex-shrink-0" />;
    return <File className="w-6 h-6 text-slate-500 flex-shrink-0" />;
  };

  return (
    <div className="space-y-4">
      {/* Drop Area */}
      {files.length === 0 || multiple ? (
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/40 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-navy-900/60 hover:border-brand-400 dark:hover:border-brand-500 hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-inner">
              <UploadCloud className="w-8 h-8 animate-bounce-subtle" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100">
                {isDragActive ? 'Drop your files here!' : instructions}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Supports accepted formats up to {formatBytes(maxSize)} per file
              </p>
            </div>
            <button
              type="button"
              className="mt-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm shadow-sm transition-all"
            >
              Choose {multiple ? 'Files' : 'File'}
            </button>
          </div>
        </div>
      ) : null}

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
            <span>Selected {files.length === 1 ? 'Document' : `Documents (${files.length})`}</span>
            {allowReorder && files.length > 1 && (
              <span className="text-brand-600 dark:text-brand-400">Use arrows to adjust order</span>
            )}
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {files.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <div className="flex items-center space-x-3 min-w-0 pr-2">
                  {getFileIcon(file)}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate max-w-xs sm:max-w-md">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatBytes(file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 flex-shrink-0">
                  {allowReorder && files.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => moveFile(idx, idx - 1)}
                        disabled={idx === 0}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Move up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveFile(idx, idx + 1)}
                        disabled={idx === files.length - 1}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Move down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add more files button if multiple */}
          {multiple && files.length < maxFiles && (
            <div {...getRootProps()} className="pt-1">
              <input {...getInputProps()} />
              <button
                type="button"
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-950/30 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add More Files</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
