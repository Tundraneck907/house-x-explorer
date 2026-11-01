import type { AssemblyId, LayerMeta, RoofConfigId } from './types';

const L = (id: string, name: string, home: AssemblyId, summary: string): LayerMeta => ({ id, name, home, summary });

export const LAYERS: LayerMeta[] = [
  // ---------------- ROOF ----------------
  L('roof-ss-panels', 'Standing-seam metal panels', 'roof', 'Concealed-fastener metal roofing with raised seams'),
  L('roof-ef-panels', 'Exposed-fastener metal panels', 'roof', 'Ribbed (R-panel type) metal screwed through the face'),
  L('roof-shingles', 'Asphalt shingles', 'roof', 'Laminated asphalt shingle courses'),
  L('roof-epdm', 'EPDM membrane', 'roof', 'Single-ply rubber membrane for low-slope roofs'),
  L('roof-mb-cap', 'Modified-bitumen cap sheet', 'roof', 'Granulated top ply of a built-up bitumen system'),
  L('roof-mb-base', 'Modified-bitumen base sheet', 'roof', 'Base ply under the cap sheet'),
  L('roof-ss-clips', 'Concealed clips & fasteners', 'roof', 'Sliding clips that hold standing-seam panels'),
  L('roof-ef-screws', 'Exposed screws with washers', 'roof', 'Self-drilling screws with sealing washers'),
  L('roof-shingle-nails', 'Roofing nails', 'roof', 'Corrosion-resistant nails for shingles'),
  L('roof-epdm-adhesive', 'Bonding adhesive (EPDM)', 'roof', 'Contact adhesive for a fully adhered membrane'),
  L('roof-cover-board', 'Cover board', 'roof', 'Rigid board under membrane roofing'),
  L('roof-underlayment', 'Synthetic underlayment', 'roof', 'Secondary water barrier over sheathing'),
  L('roof-ice-water', 'Ice-and-water membrane', 'roof', 'Self-adhered rubberized-asphalt membrane'),
  L('roof-sheathing', 'Roof sheathing', 'roof', 'Structural OSB/plywood deck'),
  L('roof-vent-channels', 'Ventilation channels', 'roof', 'Baffled air channels from soffit to ridge'),
  L('roof-rafters', 'Rafters & ridge board', 'roof', 'Engineered rafters carrying the roof load'),
  L('roof-insulation', 'Roof insulation', 'roof', 'Insulation filling the rafter bays'),
  L('roof-vapor', 'Vapor-control layer', 'roof', 'Controls vapor diffusion into the roof assembly'),
  L('roof-air', 'Air-control layer', 'roof', 'Continuous, taped air barrier at the ceiling plane'),
  L('roof-ceiling', 'Interior ceiling finish', 'roof', 'Gypsum board ceiling'),

  // ---------------- EXTERIOR WALLS ----------------
  L('wall-siding', 'Exterior siding', 'walls', 'Fiber-cement lap siding'),
  L('wall-furring', 'Rainscreen furring strips', 'walls', 'Vented, drained cavity behind the siding'),
  L('wall-ext-insulation', 'Continuous exterior insulation', 'walls', 'Mineral-wool boards outside the sheathing'),
  L('wall-wrb', 'Water-resistive / air barrier', 'walls', 'Taped weather barrier over the sheathing'),
  L('wall-sheathing', 'Wall sheathing', 'walls', 'Structural OSB/plywood bracing layer'),
  L('wall-studs', 'Structural framing', 'walls', '2x6 studs, plates and window/door headers'),
  L('wall-insulation', 'Cavity insulation', 'walls', 'Insulation between the studs'),
  L('wall-vapor', 'Interior vapor / air control', 'walls', 'Interior-side vapor and air control layer'),
  L('wall-drywall', 'Interior gypsum board', 'walls', 'Interior wall finish'),

  // ---------------- INTERIOR WALLS ----------------
  L('int-drywall-a', 'Gypsum board (face A)', 'interior', 'Drywall on one side of the partition'),
  L('int-framing', 'Partition framing', 'interior', '2x4 studs, plates and door headers'),
  L('int-insulation', 'Sound-attenuation insulation', 'interior', 'Batts in partition cavities'),
  L('int-drywall-b', 'Gypsum board (face B)', 'interior', 'Drywall on the opposite side'),

  // ---------------- FOUNDATION ----------------
  L('fnd-gravel', 'Compacted gravel pad', 'foundation', 'Drained, non-frost-susceptible base'),
  L('fnd-footing', 'Concrete footings', 'foundation', 'Spread footings under the stem wall'),
  L('fnd-stem', 'Concrete stem walls', 'foundation', 'Foundation walls carrying the floor'),
  L('fnd-rebar', 'Rebar & anchor bolts', 'foundation', 'Reinforcement and sill anchorage'),
  L('fnd-damp', 'Damp-proofing & drainage membrane', 'foundation', 'Below-grade moisture protection'),
  L('fnd-insulation', 'Foundation insulation', 'foundation', 'Rigid foam on the stem wall'),
  L('fnd-ground-vapor', 'Crawlspace ground vapor retarder', 'foundation', 'Poly sheet over the crawlspace soil'),

  // ---------------- FLOOR ----------------
  L('floor-finish', 'Finish flooring', 'floor', 'Interior walking surface'),
  L('floor-underlayment', 'Floor underlayment', 'floor', 'Smooth, sound-damping base for finish flooring'),
  L('floor-subfloor', 'Subfloor', 'floor', 'Tongue-and-groove structural panel deck'),
  L('floor-joists', 'Floor joists & rim board', 'floor', 'I-joists and rim board'),
  L('floor-insulation', 'Floor insulation', 'floor', 'Insulation between the joists'),
  L('floor-underside', 'Underside air barrier', 'floor', 'Belly barrier enclosing the insulation'),
  L('floor-sill', 'Sill plate & sill sealer', 'floor', 'Treated plate bedded on the stem wall'),

  // ---------------- WINDOWS & DOORS ----------------
  L('open-window-frames', 'Window frames & sashes', 'openings', 'Fiberglass/vinyl window frames'),
  L('open-glazing', 'Insulated glazing units', 'openings', 'Triple-pane low-e glass'),
  L('open-flashing', 'Flashing & rough-opening air seal', 'openings', 'Sill pan, tapes and foam around openings'),
  L('open-ext-doors', 'Exterior doors', 'openings', 'Insulated entry door units'),
  L('open-int-doors', 'Interior doors', 'openings', 'Interior slabs and jambs'),

  // ---------------- INSULATION & AIR SEALING (extra layers) ----------------
  L('air-seal-details', 'Air-sealing details', 'insulation', 'Gaskets, tapes and sealant at critical joints'),
  L('vent-hrv', 'HRV & ventilation ducts', 'insulation', 'Heat-recovery ventilator with ducting and wall hoods'),

  // ---------------- EXTERIOR FINISHES (extra layers) ----------------
  L('fin-trim', 'Exterior trim & corner boards', 'finishes', 'Trim at corners, openings and rakes'),
  L('fin-soffit-fascia', 'Soffit, fascia & drip edge', 'finishes', 'Vented soffit, fascia board and eave metal'),
  L('fin-gutters', 'Gutters & downspouts', 'finishes', 'Roof drainage'),
  L('fin-ridge-vent', 'Ridge vent & cap', 'finishes', 'Exhaust vent at the ridge'),
  L('fin-vent-terminals', 'Vent stacks & wall terminals', 'finishes', 'Plumbing vent, bath fan and HRV terminals'),
  L('fin-snow-guards', 'Snow retention', 'finishes', 'Snow guards on the metal roof'),
];

export const LAYER_BY_ID: Record<string, LayerMeta> = Object.fromEntries(LAYERS.map((l) => [l.id, l]));

export interface AssemblyMeta {
  id: AssemblyId;
  letter: string;
  name: string;
  blurb: string;
  layers: string[]; // outermost -> innermost (explode order); cross-listed layers allowed
}

export const ROOF_CONFIGS: { id: RoofConfigId; name: string; blurb: string; layers: string[] }[] = [
  {
    id: 'standing-seam', name: 'Standing-seam metal',
    blurb: 'Concealed-clip metal panels. Common on Interior Alaska homes because snow sheds cleanly and there are no exposed penetrations.',
    layers: ['roof-ss-panels', 'roof-ss-clips', 'roof-underlayment', 'roof-ice-water'],
  },
  {
    id: 'exposed-fastener', name: 'Exposed-fastener metal',
    blurb: 'Ribbed metal panels screwed through the face. Lower cost, but the screw washers need periodic maintenance.',
    layers: ['roof-ef-panels', 'roof-ef-screws', 'roof-underlayment', 'roof-ice-water'],
  },
  {
    id: 'shingles', name: 'Asphalt shingles',
    blurb: 'Laminated asphalt shingles over synthetic underlayment. Lowest first cost; shows ice-dam and cold-weather limitations.',
    layers: ['roof-shingles', 'roof-shingle-nails', 'roof-underlayment', 'roof-ice-water'],
  },
  {
    id: 'epdm', name: 'EPDM membrane',
    blurb: 'Single-ply rubber membrane, fully adhered. Designed for low-slope roofs; shown on this 6:12 geometry for comparison only.',
    layers: ['roof-epdm', 'roof-epdm-adhesive', 'roof-cover-board'],
  },
  {
    id: 'mod-bit',
    name: 'Modified bitumen',
    blurb: 'Two-ply bitumen system. Designed for low-slope roofs; shown on this 6:12 geometry for comparison only.',
    layers: ['roof-mb-cap', 'roof-mb-base', 'roof-cover-board'],
  },
];

const ROOF_COMMON = ['roof-sheathing', 'roof-vent-channels', 'roof-rafters', 'roof-insulation', 'roof-vapor', 'roof-air', 'roof-ceiling'];
export const roofLayersFor = (c: RoofConfigId): string[] =>
  [...ROOF_CONFIGS.find((r) => r.id === c)!.layers, ...ROOF_COMMON];

export const ROOF_FINISH_LAYERS = ['roof-ss-panels', 'roof-ef-panels', 'roof-shingles', 'roof-epdm', 'roof-mb-cap'];

export const WALL_LAYERS = [
  'wall-siding', 'wall-furring', 'wall-ext-insulation', 'wall-wrb', 'wall-sheathing',
  'wall-studs', 'wall-insulation', 'wall-vapor', 'wall-drywall',
];

export const ASSEMBLIES: AssemblyMeta[] = [
  { id: 'roof', letter: 'A', name: 'Roofing', blurb: 'Complete roof assembly from finish to ceiling, with five switchable roofing configurations.', layers: [] },
  { id: 'walls', letter: 'B', name: 'Exterior walls', blurb: 'Rainscreen cladding, exterior insulation, sheathing, 2x6 framing and interior finish.', layers: WALL_LAYERS },
  { id: 'interior', letter: 'C', name: 'Interior walls', blurb: 'Non-bearing 2x4 partitions with door openings.', layers: ['int-drywall-a', 'int-framing', 'int-insulation', 'int-drywall-b'] },
  { id: 'foundation', letter: 'D', name: 'Foundation', blurb: 'Insulated stem walls on footings and a gravel pad, with a crawlspace.', layers: ['fnd-insulation', 'fnd-damp', 'fnd-stem', 'fnd-rebar', 'fnd-footing', 'fnd-gravel', 'fnd-ground-vapor'] },
  { id: 'floor', letter: 'E', name: 'Floor system', blurb: 'Framed, insulated floor over a ventilated crawlspace.', layers: ['floor-finish', 'floor-underlayment', 'floor-subfloor', 'floor-joists', 'floor-insulation', 'floor-underside', 'floor-sill'] },
  { id: 'openings', letter: 'F', name: 'Windows & doors', blurb: 'Windows, exterior doors and interior doors, with their flashing.', layers: ['open-window-frames', 'open-glazing', 'open-flashing', 'open-ext-doors', 'open-int-doors'] },
  {
    id: 'insulation', letter: 'G', name: 'Insulation & air sealing',
    blurb: 'The thermal and air-control layers pulled out of every assembly, plus ventilation.',
    layers: ['roof-insulation', 'roof-vapor', 'roof-air', 'wall-ext-insulation', 'wall-wrb', 'wall-insulation', 'wall-vapor', 'floor-insulation', 'floor-underside', 'fnd-insulation', 'air-seal-details', 'vent-hrv'],
  },
  {
    id: 'finishes', letter: 'H', name: 'Exterior finishes',
    blurb: 'Everything visible from outside: cladding, roof covering, trim, drainage and vents.',
    layers: ['wall-siding', 'fin-trim', 'fin-soffit-fascia', 'fin-gutters', 'fin-ridge-vent', 'fin-vent-terminals', 'fin-snow-guards'],
  },
];
export const ASSEMBLY_BY_ID = Object.fromEntries(ASSEMBLIES.map((a) => [a.id, a])) as Record<AssemblyId, AssemblyMeta>;

export const ROOF_CONFIG_FINISH: Record<RoofConfigId, string> = {
  'standing-seam': 'roof-ss-panels', 'exposed-fastener': 'roof-ef-panels', shingles: 'roof-shingles', epdm: 'roof-epdm', 'mod-bit': 'roof-mb-cap',
};

/** Layers shown for an assembly, outermost first, resolving roof-configuration dependent entries. */
export function layersOf(a: AssemblyId, cfg: RoofConfigId): string[] {
  if (a === 'roof') return roofLayersFor(cfg);
  if (a === 'finishes') {
    const base = ASSEMBLY_BY_ID.finishes.layers.filter((id) => id !== 'fin-snow-guards' || cfg === 'standing-seam' || cfg === 'exposed-fastener');
    return [ROOF_CONFIG_FINISH[cfg], ...base];
  }
  return ASSEMBLY_BY_ID[a].layers;
}
