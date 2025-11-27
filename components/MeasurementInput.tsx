import React from 'react';

interface MeasurementInputProps {
  label: string;
  value: number;
  unit: string;
  onChange: (value: number) => void;
  onFocus: () => void;
  description: string;
  isActive: boolean;
}

export const MeasurementInput: React.FC<MeasurementInputProps> = ({
  label,
  value,
  unit,
  onChange,
  onFocus,
  description,
  isActive
}) => {
  return (
    <div 
      className={`relative group transition-all duration-300 p-3 rounded-lg border ${isActive ? 'bg-slate-800/50 border-tech-accent shadow-[0_0_15px_rgba(56,189,248,0.2)]' : 'bg-transparent border-slate-700 hover:border-slate-500'}`}
    >
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          onFocus={onFocus}
          step="0.1"
          className="w-full bg-slate-900 text-white font-mono text-lg p-2 rounded border border-slate-700 focus:outline-none focus:border-tech-accent focus:ring-1 focus:ring-tech-accent transition-colors"
        />
        <span className="text-slate-500 font-mono text-sm w-8">{unit}</span>
      </div>
      
      {/* Tooltip/Description shown when active */}
      <div className={`mt-2 text-xs text-tech-accent overflow-hidden transition-all duration-300 ${isActive ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
        {description}
      </div>
    </div>
  );
};