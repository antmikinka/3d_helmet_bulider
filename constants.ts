import { HelmetMeasurements, HelmetStyle } from './types';

// Default values extracted from the user's prompt
export const DEFAULT_MEASUREMENTS: HelmetMeasurements = {
  headCircumference: 62, // Derived from "31 cm X2"
  headLength: 33,
  headWidth: 31,
  faceLength: 21,
  faceWidth: 28,
  neckCircumference: 41, // Derived from "4| cm" which looks like a typo for 41
  neckToChin: 8,
  eyePosition: 9,
  noseWidth: 39.70, // mm, will handle conversion in UI or prompt
  mouthWidth: 53.12, // mm
  earToEarOverTop: 42
};

export const MEASUREMENT_LABELS: Record<keyof HelmetMeasurements, string> = {
  headCircumference: 'Head Circumference',
  headLength: 'Head Length',
  headWidth: 'Head Width',
  faceLength: 'Face Length',
  faceWidth: 'Face Width',
  neckCircumference: 'Neck Circumference',
  neckToChin: 'Neck to Chin',
  eyePosition: 'Eye Position',
  noseWidth: 'Nose Width (mm)',
  mouthWidth: 'Mouth Width (mm)',
  earToEarOverTop: 'Ear to Ear (Over Top)'
};

export const MEASUREMENT_DESCRIPTIONS: Record<keyof HelmetMeasurements, string> = {
  headCircumference: 'Widest part, just above eyebrows and around back.',
  headLength: 'Middle of forehead (hairline) to back of skull.',
  headWidth: 'Distance from one temple to the other.',
  faceLength: 'Middle of forehead (hairline) to bottom of chin.',
  faceWidth: 'Distance cheekbone to cheekbone (widest part).',
  neckCircumference: 'Around the base of the neck.',
  neckToChin: 'Base of neck (front) to bottom of chin.',
  eyePosition: 'Middle of forehead (hairline) to center of eyes.',
  noseWidth: 'Widest part of the nose (millimeters).',
  mouthWidth: 'Widest part of the mouth (millimeters).',
  earToEarOverTop: 'From one ear, over top of head, to other ear.'
};

export const STYLE_OPTIONS = [
  HelmetStyle.SCI_FI,
  HelmetStyle.MEDIEVAL,
  HelmetStyle.TACTICAL,
  HelmetStyle.MINIMALIST,
  HelmetStyle.ORGANIC
];