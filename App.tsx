import React, { useState, useRef } from 'react';
import { 
  DEFAULT_MEASUREMENTS, 
  MEASUREMENT_LABELS, 
  MEASUREMENT_DESCRIPTIONS,
  STYLE_OPTIONS 
} from './constants';
import { HelmetMeasurements, AppStatus, HelmetStyle } from './types';
import { generateFusionScript } from './services/geminiService';
import { MeasurementInput } from './components/MeasurementInput';
import { HeadDiagram } from './components/HeadDiagram';
import { ScriptViewer } from './components/ScriptViewer';
import { Cpu, Box, Code2, AlertCircle, Loader2, Sparkles, Wand2, ShieldCheck, Ruler, Layers } from 'lucide-react';

const App: React.FC = () => {
  const [measurements, setMeasurements] = useState<HelmetMeasurements>(DEFAULT_MEASUREMENTS);
  const [activeField, setActiveField] = useState<keyof HelmetMeasurements | null>(null);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<HelmetStyle>(HelmetStyle.SCI_FI);
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [enableStabilization, setEnableStabilization] = useState<boolean>(false);
  const [standOffHeight, setStandOffHeight] = useState<number>(2.0);
  const [shellThickness, setShellThickness] = useState<number>(5.0);
  
  // Ref to scroll to results
  const resultRef = useRef<HTMLDivElement>(null);

  const handleMeasurementChange = (key: keyof HelmetMeasurements, value: number) => {
    setMeasurements(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleGenerate = async () => {
    if (!process.env.API_KEY) {
      alert("Please set the React App API_KEY environment variable.");
      return;
    }

    setStatus(AppStatus.GENERATING);
    try {
      const code = await generateFusionScript(
        measurements, 
        selectedStyle, 
        additionalNotes, 
        enableStabilization,
        standOffHeight,
        shellThickness
      );
      setGeneratedCode(code);
      setStatus(AppStatus.SUCCESS);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (e) {
      setStatus(AppStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-tech-dark text-slate-200 font-sans selection:bg-tech-accent selection:text-white pb-20">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-tech-dark/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-tech-accent/10 rounded-lg">
              <Cpu className="text-tech-accent w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Fusion 360 Helmet Architect</h1>
              <p className="text-xs text-slate-400 font-mono">AI-POWERED PARAMETRIC GENERATOR</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs font-mono text-slate-500">
             <span>V.1.3.2 (STABILITY FIX)</span>
             <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></span>
             <span>SYSTEM READY</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Intro Banner */}
        <div className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-blueprint-900 to-tech-panel border border-slate-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Box size={120} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Initialize Fabrication Parameters</h2>
          <p className="text-slate-300 max-w-2xl">
            Review the biometrics below. These measurements are critical for the generative algorithm to produce a perfectly fitted base mesh in Fusion 360.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Inputs */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-tech-panel border border-slate-700 rounded-xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-6 text-tech-accent">
                <Code2 size={20} />
                <h3 className="font-bold uppercase tracking-wider text-sm">Design Configuration</h3>
              </div>

              {/* Style Selector */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Esthetic Style</label>
                <select 
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value as HelmetStyle)}
                  className="w-full bg-slate-900 text-white border border-slate-700 rounded-lg p-3 focus:border-tech-accent focus:ring-1 focus:ring-tech-accent outline-none"
                >
                  {STYLE_OPTIONS.map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>

              {/* Shell Thickness Slider */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                   <div className="flex items-center gap-2">
                     <Layers size={14} className="text-slate-400" />
                     <label className="text-xs font-bold text-slate-400 uppercase">Shell Thickness</label>
                   </div>
                   <span className="text-white font-mono text-xs">{shellThickness} mm</span>
                </div>
                <input 
                  type="range" 
                  min="1.0" 
                  max="15.0" 
                  step="0.5" 
                  value={shellThickness}
                  onChange={(e) => setShellThickness(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-tech-accent"
                />
              </div>

              {/* Stabilization Feature */}
              <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <ShieldCheck className={`w-5 h-5 ${enableStabilization ? 'text-tech-accent' : 'text-slate-500'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-bold text-slate-200 cursor-pointer select-none" htmlFor="stabilization-toggle">
                        Internal Stabilization Poles
                      </label>
                      <button 
                        id="stabilization-toggle"
                        onClick={() => setEnableStabilization(!enableStabilization)}
                        className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${enableStabilization ? 'bg-tech-accent' : 'bg-slate-600'}`}
                      >
                        <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform duration-200 ${enableStabilization ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Generates separate internal stand-off bodies. Useful for stabilization, airflow, or mounting points.
                    </p>
                    
                    {/* Stand-off Height Slider */}
                    {enableStabilization && (
                      <div className="mt-4 pt-4 border-t border-slate-700 animate-in slide-in-from-top-2">
                        <div className="flex justify-between text-xs mb-2">
                           <span className="text-tech-accent font-bold uppercase">Stand-off Lift</span>
                           <span className="text-white font-mono">{standOffHeight} cm</span>
                        </div>
                        <input 
                          type="range" 
                          min="0.5" 
                          max="5.0" 
                          step="0.1" 
                          value={standOffHeight}
                          onChange={(e) => setStandOffHeight(parseFloat(e.target.value))}
                          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-tech-accent"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                          <span>0.5 CM</span>
                          <span>5.0 CM</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                 <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Additional Specifications</label>
                 <textarea 
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Describe specific features you want to be able to edit later (e.g., 'Make the jawline separate', 'Add a camera mount sketch')..."
                    className="w-full bg-slate-900 text-slate-300 border border-slate-700 rounded-lg p-3 text-sm h-24 focus:border-tech-accent outline-none resize-none"
                 />
              </div>

              <div className="h-px bg-slate-700 my-6" />

              <div className="flex items-center gap-2 mb-4 text-tech-accent">
                <Ruler size={20} />
                <h3 className="font-bold uppercase tracking-wider text-sm">Cranial Biometrics</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {(Object.keys(DEFAULT_MEASUREMENTS) as Array<keyof HelmetMeasurements>).map((key) => (
                  <div key={key} className={['headCircumference', 'neckCircumference'].includes(key) ? 'col-span-2' : ''}>
                    <MeasurementInput
                      label={MEASUREMENT_LABELS[key]}
                      value={measurements[key]}
                      unit={key.includes('Width') && !key.includes('head') ? 'mm' : 'cm'}
                      description={MEASUREMENT_DESCRIPTIONS[key]}
                      onChange={(val) => handleMeasurementChange(key, val)}
                      onFocus={() => setActiveField(key)}
                      isActive={activeField === key}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Generate Button (Sticky on mobile, relative on desktop) */}
            <div className="sticky bottom-6 z-40 lg:relative lg:bottom-0">
              <button
                onClick={handleGenerate}
                disabled={status === AppStatus.GENERATING}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg transition-all duration-300
                  ${status === AppStatus.GENERATING 
                    ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                    : 'bg-tech-accent hover:bg-sky-400 text-slate-900 hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                  }`}
              >
                {status === AppStatus.GENERATING ? (
                  <>
                    <Loader2 className="animate-spin" />
                    GENERATING SCRIPT...
                  </>
                ) : (
                  <>
                    <Wand2 />
                    GENERATE FUSION 360 SCRIPT
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Visualizer & Results */}
          <div className="lg:col-span-7 space-y-8 flex flex-col">
            
            {/* Diagram */}
            <div className="bg-tech-panel rounded-xl border border-slate-700 shadow-xl overflow-hidden min-h-[400px] flex-1 flex flex-col">
               <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Visual Reference</h3>
                  <span className="text-xs font-mono text-slate-500">INTERACTIVE</span>
               </div>
               <div className="flex-1 p-4 bg-[#0B1221]">
                 <HeadDiagram activeField={activeField} />
               </div>
            </div>

            {/* Code Result Section */}
            {(status === AppStatus.SUCCESS || status === AppStatus.GENERATING) && (
              <div ref={resultRef} className="animate-in fade-in slide-in-from-bottom-10 duration-500">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="text-green-400" size={20} />
                  <h2 className="text-xl font-bold text-white">Generated Output</h2>
                </div>
                
                {status === AppStatus.GENERATING ? (
                   <div className="h-[400px] bg-tech-panel rounded-xl border border-slate-700 flex items-center justify-center flex-col gap-4">
                      <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-t-tech-accent animate-spin"></div>
                      </div>
                      <p className="text-slate-400 font-mono text-sm animate-pulse">Constructing parametric timeline...</p>
                   </div>
                ) : (
                   <div className="h-[500px]">
                      <ScriptViewer code={generatedCode} />
                      <div className="mt-4 p-4 bg-slate-800/50 border border-yellow-500/20 rounded-lg flex gap-3">
                        <AlertCircle className="text-yellow-500 flex-shrink-0" />
                        <div className="text-sm text-slate-300">
                          <p className="font-bold text-yellow-500 mb-1">How to avoid "Failed to add script" errors:</p>
                          <ol className="list-decimal list-inside space-y-1 text-slate-400">
                            <li>Download <strong>both</strong> the .py and .manifest files.</li>
                            <li>Create a folder named exactly <code>HelmetGen</code> in your Fusion 360 Scripts folder.</li>
                            <li>Place both files inside this folder.</li>
                            <li>Alternatively: Copy/Paste the code into a <strong>new</strong> script created via the Fusion UI.</li>
                          </ol>
                        </div>
                      </div>
                   </div>
                )}
              </div>
            )}
            
            {status === AppStatus.ERROR && (
               <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200 flex items-center gap-3">
                 <AlertCircle />
                 <p>Failed to generate script. Please verify your API Key and try again.</p>
               </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;