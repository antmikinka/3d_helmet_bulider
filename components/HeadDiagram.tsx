import React from 'react';
import { HelmetMeasurements } from '../types';

interface HeadDiagramProps {
  activeField: keyof HelmetMeasurements | null;
}

export const HeadDiagram: React.FC<HeadDiagramProps> = ({ activeField }) => {
  // Helper to determine stroke color based on active state
  const getStroke = (field: keyof HelmetMeasurements) => {
    return activeField === field ? "#38bdf8" : "#475569";
  };
  
  const getStrokeWidth = (field: keyof HelmetMeasurements) => {
    return activeField === field ? 3 : 1;
  };
  
  const getOpacity = (field: keyof HelmetMeasurements) => {
    return activeField === field ? 1 : 0.5;
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-tech-panel rounded-xl border border-slate-700 p-8 overflow-hidden">
      <div className="absolute top-4 left-4 text-xs font-mono text-slate-500">SCHEMATIC: FRONT / SIDE</div>
      
      <svg viewBox="0 0 500 400" className="w-full h-full max-h-[500px]" fill="none" strokeLinecap="round" strokeLinejoin="round">
        
        {/* --- FRONT VIEW (Left Side) --- */}
        <g transform="translate(50, 50)">
          {/* Head Outline */}
          <path d="M75,0 C35,0 10,40 10,100 C10,160 30,220 75,240 C120,220 140,160 140,100 C140,40 115,0 75,0 Z" stroke="#64748b" strokeWidth="2" />
          
          {/* Face Width */}
          <line x1="20" y1="120" x2="130" y2="120" stroke={getStroke('faceWidth')} strokeWidth={getStrokeWidth('faceWidth')} opacity={getOpacity('faceWidth')} />
          
          {/* Head Width */}
          <line x1="10" y1="80" x2="140" y2="80" stroke={getStroke('headWidth')} strokeWidth={getStrokeWidth('headWidth')} opacity={getOpacity('headWidth')} />
          
          {/* Eye Position (Height line) */}
          <line x1="75" y1="30" x2="75" y2="110" stroke={getStroke('eyePosition')} strokeWidth={getStrokeWidth('eyePosition')} opacity={getOpacity('eyePosition')} strokeDasharray="4 4" />
          
          {/* Nose Width */}
          <line x1="65" y1="140" x2="85" y2="140" stroke={getStroke('noseWidth')} strokeWidth={getStrokeWidth('noseWidth')} opacity={getOpacity('noseWidth')} />
          
          {/* Mouth Width */}
          <line x1="60" y1="170" x2="90" y2="170" stroke={getStroke('mouthWidth')} strokeWidth={getStrokeWidth('mouthWidth')} opacity={getOpacity('mouthWidth')} />
          
          {/* Neck Circumference (Represented as width here) */}
          <path d="M45,230 Q75,250 105,230" stroke={getStroke('neckCircumference')} strokeWidth={getStrokeWidth('neckCircumference')} opacity={getOpacity('neckCircumference')} />
        </g>

        {/* --- SIDE VIEW (Right Side) --- */}
        <g transform="translate(250, 50)">
           {/* Head Outline Side */}
          <path d="M80,0 C30,0 0,50 0,110 C0,180 20,230 60,240 L60,280 L120,280 L120,220 C140,200 150,150 150,100 C150,40 120,0 80,0 Z" stroke="#64748b" strokeWidth="2" />

          {/* Head Length */}
          <line x1="0" y1="60" x2="150" y2="60" stroke={getStroke('headLength')} strokeWidth={getStrokeWidth('headLength')} opacity={getOpacity('headLength')} />

          {/* Face Length */}
          <line x1="10" y1="30" x2="35" y2="240" stroke={getStroke('faceLength')} strokeWidth={getStrokeWidth('faceLength')} opacity={getOpacity('faceLength')} />
          
          {/* Head Circumference (Ring representation) */}
          <ellipse cx="80" cy="90" rx="70" ry="25" stroke={getStroke('headCircumference')} strokeWidth={getStrokeWidth('headCircumference')} opacity={getOpacity('headCircumference')} fill="none" />
          
          {/* Neck to Chin */}
          <line x1="60" y1="240" x2="60" y2="280" stroke={getStroke('neckToChin')} strokeWidth={getStrokeWidth('neckToChin')} opacity={getOpacity('neckToChin')} />

          {/* Ear to Ear Over Top */}
          <path d="M70,140 C70,140 70,-20 80,-20" stroke={getStroke('earToEarOverTop')} strokeWidth={getStrokeWidth('earToEarOverTop')} opacity={getOpacity('earToEarOverTop')} strokeDasharray="5 5" />
          
        </g>

        {/* Labels Overlay */}
        <text x="250" y="380" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="monospace">
          {activeField ? activeField.replace(/([A-Z])/g, ' $1').toUpperCase() : 'SELECT A FIELD TO VISUALIZE'}
        </text>

      </svg>
    </div>
  );
};