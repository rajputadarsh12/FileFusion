import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Trash2, CheckCircle2, Sliders, Image as ImageIcon } from 'lucide-react';

export default function CameraScanner({ onScansChange }) {
  const videoRef = useRef(null);
  const [streamActive, setStreamActive] = useState(false);
  const [scannedPages, setScannedPages] = useState([]);
  const [filter, setFilter] = useState('contrast'); // 'contrast' | 'bw' | 'color'
  const [errorMsg, setErrorMsg] = useState(null);

  const startCamera = async () => {
    try {
      setErrorMsg(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreamActive(true);
      }
    } catch (err) {
      setErrorMsg('Camera access was blocked or is unavailable on this device. You can upload photos below.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setStreamActive(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const captureFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `scan-page-${scannedPages.length + 1}.jpg`, { type: 'image/jpeg' });
        const updated = [...scannedPages, { file, previewUrl: URL.createObjectURL(blob) }];
        setScannedPages(updated);
        onScansChange(updated.map((item) => item.file));
      }
    }, 'image/jpeg', 0.92);
  };

  const removePage = (idx) => {
    const updated = scannedPages.filter((_, i) => i !== idx);
    setScannedPages(updated);
    onScansChange(updated.map((item) => item.file));
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Document Camera Scanner
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Capture pages using your webcam or mobile camera.
          </p>
        </div>

        {/* Filter selection */}
        <div className="flex items-center space-x-1 text-xs">
          <span className="text-slate-400 mr-1 hidden sm:inline">Enhancement:</span>
          <button
            type="button"
            onClick={() => setFilter('contrast')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              filter === 'contrast' ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            Sharp Contrast
          </button>
          <button
            type="button"
            onClick={() => setFilter('bw')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              filter === 'bw' ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            Black & White
          </button>
        </div>
      </div>

      {/* Video Viewport */}
      <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${streamActive ? 'block' : 'hidden'}`}
        />

        {!streamActive && (
          <div className="text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center mx-auto">
              <Camera className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-400 max-w-xs">
              {errorMsg || 'Camera is currently inactive. Click below to start scanning.'}
            </p>
            <button
              type="button"
              onClick={startCamera}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs shadow-sm"
            >
              Start Camera
            </button>
          </div>
        )}

        {streamActive && (
          <div className="absolute bottom-4 inset-x-0 flex items-center justify-center space-x-4">
            <button
              type="button"
              onClick={captureFrame}
              className="px-6 py-2.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg flex items-center space-x-2 border-2 border-white/20 active:scale-95 transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>Capture Page</span>
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="p-2.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 text-xs"
              title="Stop Camera"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Scanned Pages Preview */}
      {scannedPages.length > 0 && (
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Scanned Pages ({scannedPages.length})
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {scannedPages.map((page, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-[3/4] bg-slate-100">
                <img src={page.previewUrl} alt={`Scan ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePage(idx)}
                  className="absolute top-1 right-1 p-1 rounded-md bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove page"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                  #{idx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
