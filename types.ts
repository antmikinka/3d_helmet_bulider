export interface HelmetMeasurements {
  headCircumference: number;
  headLength: number;
  headWidth: number;
  faceLength: number;
  faceWidth: number;
  neckCircumference: number;
  neckToChin: number;
  eyePosition: number;
  noseWidth: number;
  mouthWidth: number;
  earToEarOverTop: number;
}

export interface GeneratedScript {
  code: string;
  explanation: string;
  timestamp: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export enum HelmetStyle {
  SCI_FI = 'Sci-Fi / Cyberpunk',
  MEDIEVAL = 'Medieval / Fantasy',
  TACTICAL = 'Modern Tactical',
  MINIMALIST = 'Minimalist / Geometric',
  ORGANIC = 'Organic / Alien'
}