import type { AssemblyId, MaterialInfo } from './types';
import { ROOF_INFO } from './info-roof';
import { WALLS_INFO } from './info-walls';
import { OTHER_INFO } from './info-other';

export const INFO: Record<string, MaterialInfo> = { ...ROOF_INFO, ...WALLS_INFO, ...OTHER_INFO };

/** Assembly-level overview notes. General guidance only; no code values or engineered numbers. */
export const ASSEMBLY_NOTES: Record<AssemblyId, { what: string; cold: string[] }> = {
  roof: {
    what: 'The roof sheds water and snow, carries snow and wind loads, and — in a cold-roof assembly — keeps the deck cold and dry. Layers run from the weather surface down to the interior ceiling.',
    cold: [
      'Ice dams form when heat leaking into the roof melts snow that refreezes at the cold eave. Air sealing and insulation below, plus a vented gap above, are the primary defence.',
      'Heated indoor air carries a lot of moisture outward in winter. The vapor and air-control layers keep it from condensing as frost on the cold sheathing.',
      'Snow loads, rafter sizing and snow retention are project-specific: confirm with the local building official and a licensed engineer.',
    ],
  },
  walls: {
    what: 'The exterior wall holds up the roof, resists wind and racking, controls water, air, vapor and heat, and carries the interior and exterior finishes.',
    cold: [
      'Exterior continuous insulation reduces thermal bridging through the studs and keeps the sheathing warmer, which lowers condensation risk.',
      'A ventilated rainscreen gap lets the cladding dry; it also needs insect screening and clear drainage at the bottom.',
      'Air leakage drives most of the moisture and heat loss through walls at -40: tape the air barrier and seal every penetration.',
    ],
  },
  interior: {
    what: 'Non-bearing partitions divide rooms. They are framed with 2x4 studs and gypsum board; sound insulation is optional but common.',
    cold: [
      'Partitions that meet the exterior envelope must not break the air barrier: seal plate-to-subfloor and wall-to-ceiling junctions.',
      'Interior walls stay warm; the main cold-climate concern is where they intersect exterior walls and the ceiling plane.',
    ],
  },
  foundation: {
    what: 'The foundation transfers building loads to the ground and keeps the structure above grade moisture. This model is a generic illustration, not a design.',
    cold: [
      'Interior Alaska has frost-susceptible soils and, in many areas, permafrost. Foundation type, depth and insulation are site-specific and need a geotechnical/structural professional.',
      'Rigid foam on the stem wall reduces heat loss and frost reach; detailing at grade must protect the foam from damage and water.',
    ],
  },
  floor: {
    what: 'The floor system carries occupant and furniture loads and separates the heated space from the crawlspace.',
    cold: [
      'Cold floors over crawlspaces are a comfort and condensation risk; a continuous air barrier under the insulation stops cold-air washing.',
      'Rim joist and sill areas leak the most air: seal them before insulating.',
    ],
  },
  openings: {
    what: 'Windows and doors admit light and access. They are the thermal and air-leakage weak points of the envelope, so flashing and air sealing matter more than the product alone.',
    cold: [
      'Triple glazing and warm-edge spacers reduce edge condensation and frost on glass at extreme cold.',
      'Sill pans and a continuous, taped connection to the air barrier keep water out and cold air from reaching the wall cavity.',
      'Low-temperature limits on tapes, sealants and foams can delay installation to warmer weather: check each manufacturer.',
    ],
  },
  insulation: {
    what: 'A cross-section of every thermal, vapor and air-control layer in the house, plus mechanical ventilation. Explore how they connect around the envelope.',
    cold: [
      'In very cold climates, continuity of the air barrier matters as much as insulation thickness.',
      'A tight house needs controlled ventilation: a heat-recovery ventilator (HRV) exhausts stale air and recovers heat, but its outdoor terminals can frost over.',
      'Required R-values and vapor-control classes depend on the adopted code and the financing program. Confirm with the local building official.',
    ],
  },
  finishes: {
    what: 'The visible exterior: cladding, roof covering, trim, drainage and vents. These are the first line of defence against weather.',
    cold: [
      'Gutters often struggle with ice and snow in Interior Alaska; many homes use no gutters or heated systems. Weigh maintenance and ice risk.',
      'Snow guards on metal roofs control snow-slide release over doors and walkways.',
      'Vent terminals (ridge, soffit, HRV, fans) must stay clear of snow and drifting; frost can block small openings.',
    ],
  },
};
