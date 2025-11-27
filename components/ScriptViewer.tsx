import React from 'react';
import { Copy, Check, Download, FileJson } from 'lucide-react';

interface ScriptViewerProps {
  code: string;
}

export const ScriptViewer: React.FC<ScriptViewerProps> = ({ code }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPy = () => {
    const blob = new Blob([code], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Naming matters for Fusion 360 if put in a folder
    a.download = 'HelmetGen.py'; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadManifest = () => {
    const manifestContent = JSON.stringify({
      "autodeskProduct": "Fusion360",
      "type": "script",
      "author": "AI Architect",
      "description": {
        "": "Generates a parametric helmet based on measurements."
      },
      "supportedOS": "windows|mac",
      "editEnabled": true
    }, null, 2);

    const blob = new Blob([manifestContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'HelmetGen.manifest';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-tech-dark rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
      <div className="bg-tech-panel px-4 py-3 border-b border-slate-700 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-2 text-sm font-mono text-slate-300">HelmetGen.py</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          
          <button 
            onClick={handleDownloadManifest}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
            title="Required for 'Add Script' functionality in Fusion 360"
          >
            <FileJson size={14} className="text-yellow-500" />
            .manifest
          </button>

          <button 
            onClick={handleDownloadPy}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-tech-accent hover:bg-sky-400 rounded transition-colors"
          >
            <Download size={14} />
            Download .py
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 bg-[#0d1117]">
        <pre className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
          <code>{code}</code>
        </pre>
      </div>
      <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 text-[10px] text-slate-500 font-mono text-center">
        If geometry is missing, check Fusion 360 Timeline for suppressed features.
      </div>
    </div>
  );
};