export type Confidence = 'VERIFIED' | 'LIKELY' | 'UNVERIFIED';

export interface CodeRef {
  ref: string;
  note: string;
  confidence: Confidence;
}

export interface MaterialInfo {
  description: string;
  purpose: string;
  thickness: string;
  dimensions: string;
  installSequence: string[];
  fastening: string;
  compatible: string[];
  commonErrors: string[];
  moisture: string;
  thermal: string;
  coldClimate: string;
  codeRefs: CodeRef[];
}

export type AssemblyId =
  | 'roof' | 'walls' | 'interior' | 'foundation'
  | 'floor' | 'openings' | 'insulation' | 'finishes';

export type RoofConfigId = 'standing-seam' | 'exposed-fastener' | 'shingles' | 'epdm' | 'mod-bit';

export interface LayerMeta {
  id: string;
  name: string;
  home: AssemblyId;
  summary: string;
}
