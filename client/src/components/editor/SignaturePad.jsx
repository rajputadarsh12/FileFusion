import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Type, Image as ImageIcon, RotateCcw, Check, ShieldAlert } from 'lucide-react';

export default function SignaturePad({ onSignatureCapture }) {
  const [mode, setMode] = useState('draw'); // 'draw' | 'type' | 'upload'
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [typedName, setTypedName] = useState('');
  const [signatureData, setSignatureData] = useState(null);
  const [color, setColor] = useState('#0f172a');

  // Canvas drawing handlers
  useEffect(() => {
    if (mode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = color;
    }
  }, [mode, color]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      setIsDrawing(false);
      const dataUrl = canvasRef.current.toDataURL('image/png');
      setSignatureData(dataUrl);
      onSignatureCapture(dataUrl);
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignatureData(null);
      onSignatureCapture(null);
    }
  };

  // Type signature handler
  const handleTypeChange = (e) => {
    const text = e.target.value;
    setTypedName(text);
    if (!text.trim()) {
      setSignatureData(null);
      onSignatureCapture(null);
      return;
    }
    // Render typed text to offscreen canvas
    const offCanvas = document.createElement('canvas');
    offCanvas.width = 400;
    offCanvas.height = 120;
    const ctx = offCanvas.getContext('2d');
    ctx.font = '36px "Brush Script MT", "Caveat", "Dancing Script", cursive';
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(text, 200, 60);
    const dataUrl = offCanvas.toDataURL('image/png');
    setSignatureData(dataUrl);
    onSignatureCapture(dataUrl);
  };

  // Upload image signature handler
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const dataUrl = uploadEvent.target?.result;
        setSignatureData(dataUrl);
        onSignatureCapture(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
      {/* Mode Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 pb-3 gap-2">
        <button
          type="button"
          onClick={() => { setMode('draw'); clearCanvas(); }}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === 'draw'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Draw Signature</span>
        </button>

        <button
          type="button"
          onClick={() => { setMode('type'); setSignatureData(null); }}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === 'type'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Type Name</span>
        </button>

        <button
          type="button"
          onClick={() => { setMode('upload'); setSignatureData(null); }}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === 'upload'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Upload Image</span>
        </button>
      </div>

      {/* Signature Content Area */}
      {mode === 'draw' && (
        <div className="space-y-3">
          <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden">
            <canvas
              ref={canvasRef}
              width={500}
              height={140}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="cursor-crosshair w-full h-[140px] touch-none"
            />
            <div className="absolute bottom-2 left-3 text-[10px] text-slate-400 pointer-events-none">
              Sign above using mouse or touch screen
            </div>
          </div>
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 text-xs">Ink:</span>
              <button
                type="button"
                onClick={() => setColor('#0f172a')}
                className={`w-5 h-5 rounded-full bg-slate-900 border ${color === '#0f172a' ? 'ring-2 ring-brand-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setColor('#0358a1')}
                className={`w-5 h-5 rounded-full bg-blue-700 border ${color === '#0358a1' ? 'ring-2 ring-brand-500' : ''}`}
              />
            </div>
            <button
              type="button"
              onClick={clearCanvas}
              className="flex items-center space-x-1 text-slate-500 hover:text-red-600"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      )}

      {mode === 'type' && (
        <div className="space-y-3">
          <input
            type="text"
            value={typedName}
            onChange={handleTypeChange}
            placeholder="Type your full legal name..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-brand-500"
          />
          {typedName && (
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-center">
              <p
                style={{ fontFamily: '"Brush Script MT", "Caveat", "Dancing Script", cursive' }}
                className="text-3xl text-slate-900 dark:text-white italic"
              >
                {typedName}
              </p>
            </div>
          )}
        </div>
      )}

      {mode === 'upload' && (
        <div className="space-y-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
          />
          {signatureData && (
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-center">
              <img src={signatureData} alt="Signature Preview" className="max-h-24 object-contain" />
            </div>
          )}
        </div>
      )}

      {/* Legal distinction notice */}
      <div className="pt-2 flex items-start space-x-2 text-[11px] text-slate-400">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
        <span>
          Note: This generates a visual electronic signature stamp. Visual signatures are legally binding for most commercial agreements but differ from cryptographic PKI certificate signatures.
        </span>
      </div>
    </div>
  );
}
