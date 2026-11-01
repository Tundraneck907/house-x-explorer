import type { CodeRef, MaterialInfo } from './types';

// General educational guidance only. Adopted code edition, ground snow load, and all
// structural design must be confirmed with the local building official and a licensed engineer.

const R806_VENT: CodeRef = {
  ref: 'IRC R806.1 / R806.2',
  note: 'Enclosed rafter spaces with ceilings applied to the rafters need ventilation; minimum net free vent area is a ratio of the ventilated area (a reduced ratio is allowed only if listed conditions are met). Section text is edition-dependent; confirm adopted edition.',
  confidence: 'VERIFIED',
};
const R806_CLEAR: CodeRef = {
  ref: 'IRC R806.3',
  note: 'Insulation must not block free airflow at the eave vent; a minimum clear air space is required between insulation and roof sheathing. Edition-dependent; check adopted edition for the exact dimension.',
  confidence: 'VERIFIED',
};
const R806_UNVENTED: CodeRef = {
  ref: 'IRC R806.5',
  note: 'Unvented attic/rafter assemblies are a separate code path with their own insulation and vapor requirements. This model is a VENTED assembly, so R806.5 does not describe it. Edition-dependent.',
  confidence: 'VERIFIED',
};
const R905_GEN: CodeRef = {
  ref: 'IRC R905 (roof coverings)',
  note: 'Roof coverings must be installed per the code and the manufacturer instructions; each covering type has its own subsection, slope limits and underlayment rules. Edition-dependent.',
  confidence: 'LIKELY',
};
const R905_ICE: CodeRef = {
  ref: 'IRC R905.1.2 (ice barrier) and Table R301.2(1)',
  note: 'Where the jurisdiction lists a history of ice forming along eaves, an ice barrier is required from the eave up past the exterior wall line. Whether it applies, and the exact distance, depends on local adoption and edition; confirm with the building official.',
  confidence: 'LIKELY',
};
const R905_UNDERLAY: CodeRef = {
  ref: 'IRC R905.1.1',
  note: 'Underlayment requirements for shingles and other coverings (type, laps, attachment). Edition-dependent.',
  confidence: 'VERIFIED',
};
const R702_VAPOR: CodeRef = {
  ref: 'IRC R702.7 (vapor retarders)',
  note: 'Covers vapor retarder classes and where they are required; the roof-specific rule for cold climates should be checked against the adopted IRC/IECC edition. Section number is edition-dependent.',
  confidence: 'LIKELY',
};
const SNOW: CodeRef = {
  ref: 'Ground snow load / roof structural design',
  note: 'Design snow load comes from the adopted code and local ground-snow-load data; Interior Alaska values can be high and site-specific. Rafter, deck and fastener sizing needs a licensed engineer. No value is given here.',
  confidence: 'UNVERIFIED',
};
const MFR: CodeRef = {
  ref: 'Manufacturer installation instructions',
  note: 'Codes require installation per manufacturer instructions; product approvals, ratings and warranty terms must be checked with the manufacturer. No ratings are stated here.',
  confidence: 'LIKELY',
};
const LOWSLOPE_NOTE =
  'Shown on a 6:12 roof for comparison only; this is a low-slope system and is normally not used on a 6:12 gable.';

export const ROOF_INFO: Record<string, MaterialInfo> = {
  'roof-ss-panels': {
    description:
      'Roll-formed steel or aluminum panels with raised interlocking seams. Fasteners are hidden under the seams, so the weather surface has no screw holes.',
    purpose:
      'Sheds water and snow, and lets the roof slide snow off. It is the outermost weather layer on this configuration.',
    thickness: 'Typically 24 or 26 gauge steel (about 0.022-0.028 in / 0.55-0.7 mm); seam height commonly 1-2 in (25-50 mm). Verify with manufacturer.',
    dimensions: 'Panel coverage commonly 12-18 in (300-450 mm) wide; formed to length from coil, often up to roughly 40 ft (12 m) or more depending on the roll former and shipping.',
    installSequence: [
      'Confirm deck, underlayment and ice membrane are dry, flat and complete.',
      'Install eave trim, drip edge and gable trim.',
      'Square and set the first panel; fasten with clips along the seam.',
      'Snap or seam each next panel over the previous clip flange.',
      'Install ridge cap, snow guards (if designed) and flashings at penetrations.',
    ],
    fastening:
      'Panel is held by sliding clips fastened to the deck; the panel itself is not screwed through its face. Clip type and spacing come from the manufacturer and wind/snow design.',
    compatible: ['Synthetic underlayment rated for high temperature', 'Self-adhered ice-and-water membrane', 'Concealed sliding clips', 'Vented cold-roof assembly'],
    commonErrors: [
      'Using a fixed (non-sliding) clip where panels need to move with temperature changes.',
      'Panels pinned at both ends so they buckle or oil-can.',
      'Using an underlayment not rated for heat under metal.',
      'No snow retention above doors, walkways or lower roofs, so sliding snow becomes a hazard.',
      'Dissimilar metals touching, causing corrosion.',
    ],
    moisture:
      'Metal is a non-absorbing shell; condensation can form on its underside in cold weather, so an underlayment and a vented gap below matter.',
    thermal:
      'Metal conducts heat, so it adds no insulation value; it expands and contracts noticeably with temperature swings, which is why clips must slide.',
    coldClimate:
      'Slick metal sheds snow suddenly, so snow guards and eave protection need planning. Metal sheds meltwater fast but can still form ice dams if the roof leaks heat. Panels are rolled and handled cold; check manufacturer low-temperature handling limits for coatings and sealants.',
    codeRefs: [R905_GEN, MFR, SNOW],
  },

  'roof-ef-panels': {
    description:
      'Ribbed metal panels (R-panel or similar) that are screwed through the flat of the panel into the deck or purlins. Screw heads and washers are visible.',
    purpose:
      'Low-cost, durable weather surface that sheds water and snow.',
    thickness: 'Commonly 26 or 29 gauge steel (about 0.018-0.022 in / 0.45-0.55 mm). Verify with manufacturer.',
    dimensions: 'Typical coverage about 36 in (915 mm) per panel; cut to length, commonly up to about 40 ft (12 m). Verify with supplier.',
    installSequence: [
      'Verify the deck, underlayment and ice membrane are dry and complete.',
      'Install eave trim and drip edge.',
      'Set the first panel square to the eave and rake; screw it down.',
      'Overlap each next panel at the rib and fasten in the flat per manufacturer pattern.',
      'Install ridge cap, closures and flashings.',
    ],
    fastening:
      'Self-drilling screws with sealing washers, driven through the panel into the deck. Pattern and screw type come from the manufacturer; do not overdrive.',
    compatible: ['Exposed screws with neoprene washers', 'Synthetic underlayment', 'Ice-and-water membrane', 'Foam closure strips'],
    commonErrors: [
      'Overdriving screws and crushing the washer, which leaks.',
      'Underdriving screws so the washer does not seal.',
      'Fastening in the rib instead of the flat when the manufacturer calls for the flat.',
      'Crooked first panel that wanders up the roof.',
      'Not planning for screw back-out and re-tightening over time.',
    ],
    moisture:
      'Every screw hole is a potential leak path; washers age and need periodic checks. Condensation can form on the underside.',
    thermal:
      'No insulation value. Screws are small thermal bridges to the deck, but the panel is the main thermal exposure.',
    coldClimate:
      'Large temperature swings make panels move and gradually loosen screw holes and washers; plan for periodic inspection. Check washer and sealant low-temperature installation limits. Snow slides off all at once, so plan snow retention.',
    codeRefs: [R905_GEN, MFR, SNOW],
  },

  'roof-shingles': {
    description:
      'Laminated (architectural) asphalt shingles installed in overlapping courses from eave to ridge, with a sealant strip that bonds each course.',
    purpose:
      'Sheds water by overlap; the visible weather surface for the shingle configuration.',
    thickness: 'About 1/8-1/4 in (3-6 mm) per shingle; layered coverage is thicker where courses overlap. Verify with manufacturer.',
    dimensions: 'Common US shingle about 13-1/4 in x 39-3/8 in (337 x 1000 mm), roughly 3 bundles per roofing square (100 sq ft / 9.3 m2). Verify with manufacturer.',
    installSequence: [
      'Install drip edge, ice membrane and underlayment.',
      'Start with a starter course at the eave.',
      'Lay full courses upward, keeping the nail line and offsets per the wrapper instructions.',
      'Install flashing at walls, valleys and penetrations as you reach them.',
      'Finish with ridge cap shingles, then ridge vent if specified.',
    ],
    fastening:
      'Corrosion-resistant roofing nails, normally 4-6 per shingle in the nailing zone as the manufacturer states; nail length must clear the deck.',
    compatible: ['Synthetic underlayment', 'Ice-and-water membrane', 'Roofing nails', 'Vented roof deck', 'Ridge vent'],
    commonErrors: [
      'High nailing, above the nail line, which weakens wind resistance.',
      'Overdriven or crooked nails.',
      'Installing in cold weather without hand-sealing, so the seal strips never bond.',
      'Stacking seams or joints over each other from course to course.',
      'Skipping starter course or drip edge.',
    ],
    moisture:
      'Shingles shed water but do not stop vapor or meltwater backed up behind ice; the underlayment and ice membrane are the backup.',
    thermal:
      'Dark shingles absorb sun and can warm the roof in sunny winter; they offer no meaningful insulation.',
    coldClimate:
      'Seal strips need warmth and sun to bond; manufacturers set minimum installation temperatures, so check the wrapper. Cold shingles are brittle and can crack when bent. Short season makes it tempting to install in the cold, which risks poor sealing and blow-offs. Sealed snow sitting on shingles can feed ice dams if the roof leaks heat.',
    codeRefs: [R905_GEN, R905_UNDERLAY, R905_ICE, MFR],
  },

  'roof-epdm': {
    description:
      'A single-ply synthetic rubber sheet bonded or ballasted over a rigid base. ' + LOWSLOPE_NOTE,
    purpose:
      'Waterproofs a low-slope roof as one continuous membrane with taped or glued seams.',
    thickness: 'Commonly 0.045 in or 0.060 in (45-60 mil, about 1.1-1.5 mm). Verify with manufacturer.',
    dimensions: 'Rolls commonly 10 ft wide up to about 50 ft long; wider sheets up to about 50 ft are also made. Verify with supplier.',
    installSequence: [
      'Verify the deck and cover board are dry, clean and smooth.',
      'Unroll the sheet, relax it, and fold it back half way.',
      'Apply bonding adhesive to both the substrate and the sheet, let it flash off to tacky.',
      'Roll the sheet into the adhesive, brush out wrinkles, and repeat on the other half.',
      'Seam with splice tape or adhesive and install flashings and edge metal.',
    ],
    fastening:
      'Fully adhered with bonding adhesive in this model; other systems use mechanical fasteners with plates, or ballast. Follow manufacturer.',
    compatible: ['Manufacturer bonding adhesive', 'Rigid cover board', 'EPDM seam tape and flashing', 'Approved insulation boards'],
    commonErrors: [
      'Applying adhesive in cold, wet or damp conditions so it does not bond.',
      'Wrinkles and fish-mouths at seams.',
      'Not letting the adhesive flash off to the right tack.',
      'Insufficient slope or drainage, leaving standing water.',
      'Punctures from foot traffic or debris.',
    ],
    moisture:
      'The membrane is a vapor barrier on the top side; moisture trapped below cannot dry upward, so interior air sealing matters.',
    thermal:
      'Black membrane absorbs heat; it adds almost no insulation by itself.',
    coldClimate:
      'Adhesives and seam tapes have low-temperature application limits, so building season matters. Cold makes the membrane stiff. Snow and ice loads and ice damming on a flat roof are real risks; a low-slope roof in this climate needs engineered drainage and snow design.',
    codeRefs: [R905_GEN, MFR],
  },

  'roof-mb-cap': {
    description:
      'The top ply of a modified-bitumen system: asphalt reinforced with polymer and a fabric mat, surfaced with mineral granules. ' + LOWSLOPE_NOTE,
    purpose:
      'Weather and UV-resistant top surface that sheds water and protects the base ply.',
    thickness: 'Commonly about 0.1-0.2 in (3-5 mm). Verify with manufacturer.',
    dimensions: 'Rolls commonly about 3 ft 3 in (1 m) wide and about 32-33 ft (10 m) long. Verify with supplier.',
    installSequence: [
      'Confirm the base ply and substrate are dry and clean.',
      'Unroll and align the cap sheet to set laps.',
      'Bond using the method specified: torch, hot asphalt, cold adhesive or self-adhered.',
      'Press out air, seal side and end laps, and embed granules at laps.',
      'Install flashings and edge metal.',
    ],
    fastening:
      'Adhered by heat, adhesive or self-adhering backing; the base sheet below may be nailed or fastened. Follow manufacturer.',
    compatible: ['Modified-bitumen base sheet', 'Rigid cover board', 'Manufacturer flashing system', 'Primers and mastics'],
    commonErrors: [
      'Overheating or underheating when torching, causing burn-through or poor bond.',
      'Open flame near combustibles, a serious fire hazard.',
      'Misaligned rolls and laps that are too narrow.',
      'Installing over a wet substrate.',
    ],
    moisture:
      'Laps and seams are the weak point; poor bonding leaks. Moisture trapped under the cap cannot easily escape.',
    thermal:
      'Dark surface absorbs heat; no meaningful insulation.',
    coldClimate:
      'Cold stiffens rolls, so many types need warming and have minimum installation temperatures; check manufacturer. Torch work in cold wind is slow and risky. A short season limits the practical install window, so scheduling is a major factor.',
    codeRefs: [R905_GEN, MFR],
  },

  'roof-mb-base': {
    description:
      'The first ply in a modified-bitumen system, laid over the deck or cover board before the cap sheet. ' + LOWSLOPE_NOTE,
    purpose:
      'Provides a continuous waterproofing layer and a bonding surface for the cap sheet, giving a second line of defense.',
    thickness: 'Commonly about 0.05-0.1 in (1.5-3 mm). Verify with manufacturer.',
    dimensions: 'Rolls commonly about 3 ft 3 in (1 m) wide and about 32-33 ft (10 m) long, or 36 in x 66 ft for some base sheets. Verify with supplier.',
    installSequence: [
      'Prepare a clean, dry, smooth deck or cover board.',
      'Roll out and align the base sheet at the low edge first.',
      'Fasten or adhere per manufacturer.',
      'Lap sides and ends the specified amount, staggering end laps.',
      'Inspect for fish-mouths and holes before the cap sheet goes on.',
    ],
    fastening:
      'Mechanically fastened with plates or nails, or adhered; method depends on the system. Verify with manufacturer.',
    compatible: ['Modified-bitumen cap sheet', 'Cover board', 'Primers and mastics'],
    commonErrors: [
      'Installing over wet or frosted substrate.',
      'Laps too narrow or not staggered.',
      'Fastener pattern wrong, leaving the sheet loose.',
      'Leaving the base exposed to weather for too long before capping.',
    ],
    moisture:
      'Acts as a temporary waterproofer and secondary barrier; trapped moisture below may blister the system.',
    thermal:
      'Adds negligible insulation.',
    coldClimate:
      'Frost and ice on the substrate prevent bonding; surfaces must be dry. Low-temperature limits apply to adhesives and handling, and the base should be capped quickly in a short season.',
    codeRefs: [R905_GEN, MFR],
  },

  'roof-ss-clips': {
    description:
      'Metal clips fastened to the deck that grip the seam of each standing-seam panel; often sliding or floating clips with a tab that moves with the panel.',
    purpose:
      'Holds panels down to the roof without any holes through the face and allows thermal movement.',
    thickness: 'Clip steel is typically thin sheet, about 0.04-0.06 in (1-1.5 mm); some clips add a raised base to create a thermal break. Verify with manufacturer.',
    dimensions: 'Clip bodies are typically a few inches long (about 2-4 in / 50-100 mm); spacing along the seam is set by the manufacturer and wind/snow design.',
    installSequence: [
      'Snap or hook a clip to the panel seam flange.',
      'Fasten the clip base to the deck with the specified screws.',
      'Set the next panel over the clip and seam it.',
      'Repeat at the clip spacing for the whole panel run.',
    ],
    fastening:
      'Screws through the clip base into the deck (or structure per manufacturer); fastener length and type must match deck thickness.',
    compatible: ['Matching standing-seam panels', 'OSB/plywood deck', 'Underlayment', 'Thermal-break pads'],
    commonErrors: [
      'Missing or skipped clips.',
      'Wrong clip type for the panel profile.',
      'Fasteners too short or missing the deck.',
      'Fixed clips used where sliding is needed.',
      'Overtightening that locks a sliding clip.',
    ],
    moisture:
      'Clip penetrations are covered by panels, but poor underlayment can allow wetting at the screw.',
    thermal:
      'Metal clips form small thermal bridges to the deck; some clips include a thermal break.',
    coldClimate:
      'Large temperature swings put sliding clips to work every day. Clip spacing and snow load need engineering for Interior Alaska snow loads; do not copy a standard spacing. Cold handling with gloves slows work.',
    codeRefs: [MFR, SNOW],
  },

  'roof-ef-screws': {
    description:
      'Self-drilling, self-tapping screws with a bonded neoprene or EPDM washer under the head, driven through the panel face.',
    purpose:
      'Hold exposed-fastener panels to the deck and seal the hole at each screw.',
    thickness: 'Common diameter #10-#14 (about 5-6 mm); lengths vary by deck, commonly 1 in to 1-1/2 in (25-40 mm) or more. Verify with manufacturer.',
    dimensions: 'Sold by length and diameter; point type is chosen for wood or steel substrate. Verify with supplier.',
    installSequence: [
      'Choose a screw length that bites into the deck or purlin.',
      'Mark or follow the manufacturer fastener pattern.',
      'Drive with a clutch or depth-controlled driver, square to the panel.',
      'Check each washer for a visible, gentle compression.',
    ],
    fastening:
      'Driven by screw gun through the panel flat (or rib if specified) into the structure; follow the pattern and spacing in the manufacturer instructions.',
    compatible: ['Matching-color metal panels', 'Wood or steel substrate', 'Neoprene/EPDM washers', 'Closure strips'],
    commonErrors: [
      'Overdriving, which crushes or splits the washer.',
      'Underdriving, leaving a gap.',
      'Crooked screws that tilt the washer.',
      'Reusing stripped holes without bigger or sealed screws.',
      'Wrong screw length missing the framing.',
    ],
    moisture:
      'The washer is the weak link in water-tightness; UV and thermal cycling age it over time.',
    thermal:
      'Each screw is a small thermal bridge, usually not significant versus the panel.',
    coldClimate:
      'Thermal cycling loosens holes and washers over years, so budget for periodic re-tightening or replacement. Cold makes neoprene stiff; check low-temperature installation limits.',
    codeRefs: [MFR],
  },

  'roof-shingle-nails': {
    description:
      'Corrosion-resistant (galvanized or stainless) roofing nails with a large flat head, driven through shingles into the deck.',
    purpose:
      'Hold shingles to the deck so they resist wind and sliding snow.',
    thickness: 'Shank is typically about 11-12 gauge; head about 3/8 in (10 mm) diameter. Verify spec.',
    dimensions: 'Commonly 1 in to 1-1/2 in long (25-38 mm) depending on shingle thickness and deck; must penetrate the deck fully or at least a code minimum. Verify with code and manufacturer.',
    installSequence: [
      'Pick nail length for the deck thickness and shingle layers.',
      'Set the nailing-gun pressure and depth on scrap.',
      'Nail within the manufacturer nail zone.',
      'Place the specified number of nails per shingle and check for flush heads.',
    ],
    fastening:
      'Driven by hand or pneumatic nailer flush with the shingle surface, neither overdriven nor proud.',
    compatible: ['Asphalt shingles', 'OSB/plywood deck', 'Synthetic underlayment', 'Ice-and-water membrane'],
    commonErrors: [
      'Nailing too high, above the nail zone.',
      'Overdriving through the shingle.',
      'Nails left proud, which prevent sealing.',
      'Using uncoated nails that rust.',
      'Nailing at an angle.',
    ],
    moisture:
      'Corrosion resistance matters because nail holes are covered but still see moisture and condensation.',
    thermal:
      'Negligible; nail tips can show frost on the sheathing underside in cold weather.',
    coldClimate:
      'Nail tips protruding below the deck can collect frost in a cold attic; vented channels reduce this. Pneumatic gun pressure may need adjusting in cold because shingles are stiffer.',
    codeRefs: [R905_GEN, MFR],
  },

  'roof-epdm-adhesive': {
    description:
      'Solvent- or water-based contact adhesive rolled onto both the substrate and the EPDM sheet to adhere the membrane. ' + LOWSLOPE_NOTE,
    purpose:
      'Fully adheres the membrane to the cover board so it resists wind uplift and flutter.',
    thickness: 'Applied as a thin film, typically a small fraction of a millimeter; coverage is set by the manufacturer (spread rate per gallon). Verify with manufacturer.',
    dimensions: 'Sold in gallon and 5-gallon pails or aerosol cans; use only the adhesive approved with the membrane. Verify with supplier.',
    installSequence: [
      'Confirm substrate and membrane are clean and dry.',
      'Roll adhesive on the substrate and the sheet underside.',
      'Wait for the adhesive to flash off to a tacky, non-stringing state.',
      'Roll the membrane into place and press out air.',
    ],
    fastening:
      'Adhesive bond only; no mechanical fasteners across the field. Edges and perimeters may add fasteners per manufacturer.',
    compatible: ['EPDM membrane', 'Approved cover board', 'Manufacturer-specified primers and seam products'],
    commonErrors: [
      'Applying too thick or too thin.',
      'Rolling the sheet in before the adhesive flashes off.',
      'Using the wrong adhesive for the board or membrane.',
      'Applying in rain, frost or below the minimum temperature.',
    ],
    moisture:
      'Moisture on the surface blocks adhesion and traps water under the membrane.',
    thermal:
      'No thermal role.',
    coldClimate:
      'Most adhesives have a minimum application temperature and slow-curing cold behavior; solvent products are flammable and need ventilation. Check the manufacturer data sheet. Short season limits practical use.',
    codeRefs: [MFR],
  },

  'roof-cover-board': {
    description:
      'A rigid board (for example gypsum-based, high-density polyiso or wood fiber) laid over the deck or insulation to give membrane roofing a smooth, firm base. ' + LOWSLOPE_NOTE,
    purpose:
      'Protects the membrane from deck irregularities and fasteners and provides a bonding surface.',
    thickness: 'Commonly about 1/4-1/2 in (6-13 mm); verify with manufacturer.',
    dimensions: 'Commonly 4 ft x 4 ft or 4 ft x 8 ft (1.2 x 1.2 m or 1.2 x 2.4 m). Verify with supplier.',
    installSequence: [
      'Check the deck is dry and flat.',
      'Lay boards tight with staggered joints.',
      'Fasten per manufacturer pattern or adhere with approved adhesive.',
      'Check for loose edges and flush joints before membrane install.',
    ],
    fastening:
      'Mechanical fasteners with plates or adhesive, as the board and membrane manufacturers specify.',
    compatible: ['EPDM membrane', 'Modified-bitumen systems', 'Plywood/OSB deck', 'Approved fasteners and adhesive'],
    commonErrors: [
      'Installing boards wet or frosted.',
      'Open gaps or uneven joints that telegraph through the membrane.',
      'Wrong fastener type or too few fasteners.',
      'Leaving boards exposed to weather before roofing.',
    ],
    moisture:
      'Some cover boards absorb water and swell; keep them dry until covered.',
    thermal:
      'Some types (polyiso) add a little insulation; others add nothing. Verify with manufacturer.',
    coldClimate:
      'Frost, ice and snow on boards must be removed before roofing; a short building season makes dry weather windows tight. Cold can make some boards brittle during handling.',
    codeRefs: [R905_GEN, MFR],
  },

  'roof-underlayment': {
    description:
      'Synthetic sheet (woven or non-woven polymer) rolled over the sheathing as a secondary water barrier under the roof covering.',
    purpose:
      'Sheds water that gets past the roof covering and protects the deck during construction.',
    thickness: 'Thin sheet, typically well under 1/16 in (about 1 mm). Verify with manufacturer.',
    dimensions: 'Rolls commonly 4 ft wide (1.2 m) by about 100-250 ft long, or 3 ft wide; verify with supplier.',
    installSequence: [
      'Confirm the deck is dry and the ice membrane is installed at the eaves.',
      'Start at the eave and roll horizontally.',
      'Overlap each course up the roof (shingle fashion) by the printed lap lines.',
      'Fasten with cap nails or cap staples as the manufacturer states.',
      'Lap and seal at hips, valleys and penetrations.',
    ],
    fastening:
      'Plastic-cap nails or cap staples at the manufacturer spacing; metal-roof underlayments may allow different patterns. Verify.',
    compatible: ['OSB/plywood deck', 'Ice-and-water membrane', 'Asphalt shingles', 'Metal panels (high-temperature type for metal)'],
    commonErrors: [
      'Laps going the wrong direction so water flows into the seam.',
      'Not enough fasteners, causing wind flutter.',
      'Leaving it exposed past its UV limit before covering.',
      'Using the wrong type under metal where heat is high.',
      'Wrinkles over the sheathing.',
    ],
    moisture:
      'Sheds liquid water but may or may not pass vapor; vapor-open types help the deck dry upward.',
    thermal:
      'No meaningful insulation.',
    coldClimate:
      'Slippery when frosty and dangerous to walk on; cold makes it stiffer. Exposure time limit before roofing is a manufacturer value; verify. Cold can reduce cap-nail holding.',
    codeRefs: [R905_UNDERLAY, R905_GEN],
  },

  'roof-ice-water': {
    description:
      'Self-adhered rubberized-asphalt sheet with a peel-off backing that bonds to the sheathing and seals around nails driven through it.',
    purpose:
      'Backs up the roof against water driven under the covering by ice dams and wind, at eaves, valleys and penetrations.',
    thickness: 'Commonly about 0.04 in (1 mm); verify with manufacturer.',
    dimensions: 'Rolls commonly 36 in (0.9 m) wide by about 65-75 ft (20-23 m) long, or 3 ft x 33 ft. Verify with supplier.',
    installSequence: [
      'Confirm the deck is clean, dry and free of frost; prime if the manufacturer requires.',
      'Start at the eave, peel back the liner and press into place.',
      'Lap courses the stated amount and roll to remove air.',
      'Extend up the slope past the warm wall line as planned, then add valleys and penetrations.',
      'Cover with underlayment and the roof covering without long exposure.',
    ],
    fastening:
      'Adhered to the deck by its own adhesive; edges may need a few cap nails on steep slopes. Follow manufacturer.',
    compatible: ['Plywood/OSB deck', 'Synthetic underlayment', 'Shingles and metal (check high-temperature rating under metal)', 'Primers'],
    commonErrors: [
      'Installing on a cold, frosty or dusty deck so it never bonds.',
      'Wrinkles and fishmouths that make a leak path.',
      'Ending too short of the exterior wall line, so dam water gets in.',
      'Leaving it exposed in sun beyond the stated time.',
      'Using a non-high-temperature type under dark metal.',
    ],
    moisture:
      'Blocks liquid water but is vapor-closed; over the whole deck it can trap moisture, so use it only in the areas designed (eaves, valleys) unless the design says otherwise.',
    thermal:
      'No insulation value.',
    coldClimate:
      'Ice dams are the main reason it is used in Interior Alaska. Adhesive has a minimum application temperature, and installing it in deep cold is hard because it will not stick; verify with manufacturer. Warming rolls indoors helps.',
    codeRefs: [R905_ICE, R905_GEN, MFR],
  },

  'roof-sheathing': {
    description:
      'Structural panels (OSB or plywood) fastened over the rafters, forming the deck that carries the roofing and snow load.',
    purpose:
      'Carries snow and wind loads to the rafters, braces the framing, and provides a nailing base for the roof covering.',
    thickness: 'Commonly 1/2 in to 3/4 in (12-19 mm); required thickness depends on rafter spacing, span rating and snow load, so verify with engineer.',
    dimensions: '4 ft x 8 ft (1.2 x 2.4 m) panels; installed across the rafters with joints staggered.',
    installSequence: [
      'Check rafters are straight and aligned at the intended spacing.',
      'Start at the eave with the long dimension perpendicular to rafters.',
      'Leave the manufacturer-specified expansion gap between panels.',
      'Fasten at the specified edge and field spacing.',
      'Keep it dry and covered with underlayment quickly.',
    ],
    fastening:
      'Nails or screws at the schedule from the code or engineer (edge and field spacing); verify the nailing schedule with the engineer for snow load.',
    compatible: ['Engineered I-joist rafters', 'Underlayment', 'Ice-and-water membrane', 'Ventilation channels beneath'],
    commonErrors: [
      'No panel edge gap, leading to buckling.',
      'Wet panels installed and covered, trapping moisture.',
      'Insufficient fastening along edges.',
      'Panels with joints not on framing.',
      'Panel too thin for the load and span.',
    ],
    moisture:
      'The coldest surface in the assembly: warm interior air that reaches it condenses or frosts on the underside, so air sealing and venting are critical.',
    thermal:
      'Little insulation value; it is part of the cold side of the assembly.',
    coldClimate:
      'Frost on the sheathing underside is a classic failure in Interior Alaska, driven by interior moisture leaking through air gaps. Repeated freeze-thaw can lead to mold and rot. Keep it dry during the short building season.',
    codeRefs: [R806_VENT, SNOW],
  },

  'roof-vent-channels': {
    description:
      'Rigid or semi-rigid baffles (chutes) stapled to the underside of the sheathing, creating an open air channel from the soffit to the ridge over the insulation.',
    purpose:
      'Lets outside air flow under the deck to carry away moisture and keep the deck cold and even, reducing ice dams.',
    thickness: 'Channel depth is commonly about 1-2 in (25-50 mm) of clear air space; the required depth depends on the code and design, so verify.',
    dimensions: 'Baffles commonly fit 14-1/2 in or 22-1/2 in wide bays; some come in 4 ft lengths. 24 in o.c. rafters use the wider type. Verify with supplier.',
    installSequence: [
      'Check that soffit vents are open and not blocked by insulation.',
      'Staple or fasten each baffle to the sheathing, centered in the bay.',
      'Lap baffles end to end and seal or fasten at joints.',
      'Run the channel to the ridge with a clear opening at the top.',
      'Install insulation after baffles, keeping the channel open.',
    ],
    fastening:
      'Staples or small fasteners into the sheathing or rafter sides, per the product instructions. Do not penetrate through the roof deck.',
    compatible: ['Soffit and ridge vent', 'Dense-pack or batt insulation', 'OSB/plywood sheathing', 'I-joist rafters'],
    commonErrors: [
      'Blocking the air space at the eave with insulation.',
      'Leaving a gap at the ridge so air has no exit.',
      'Not providing a baffle where dense-pack insulation can slump into the channel.',
      'Mixing vented and unvented parts without a design.',
      'Installing the ridge vent without matching eave intakes.',
    ],
    moisture:
      'Removes moisture that gets past the ceiling, but cannot fix a leaky air-control layer.',
    thermal:
      'Keeps the roof deck cool, which limits snowmelt that causes ice dams; it provides no insulation.',
    coldClimate:
      'Ventilation helps keep the deck near outdoor temperature so snow melts less. Soffit and ridge vents can clog with drifting snow or frost; plan a design that keeps them clear. Vent area depends on code and local conditions; confirm with the building official.',
    codeRefs: [R806_VENT, R806_CLEAR, R806_UNVENTED],
  },

  'roof-rafters': {
    description:
      'Engineered I-joist-style rafters about 11-7/8 in deep at 24 in o.c., with a structural ridge board or beam at the peak. The model shows a 6:12 gable.',
    purpose:
      'Carry the roof deck, snow, wind and dead loads to the walls, and define the depth of the insulated cavity.',
    thickness: 'Depth about 11-7/8 in (302 mm); flange width and web vary by product. Verify with manufacturer.',
    dimensions: 'Lengths vary by project; 24 in (610 mm) o.c. in this model. Span and spacing must come from the manufacturer tables or an engineer.',
    installSequence: [
      'Install and level the ridge beam or board and its supports.',
      'Mark rafter layout at 24 in o.c.',
      'Set rafters with a birdsmouth or hangers as the engineer specifies.',
      'Install blocking, bracing and connectors.',
      'Check straightness before decking.',
    ],
    fastening:
      'Nails, screws and engineered connectors per the manufacturer and structural design; do not notch or drill I-joist flanges without approval.',
    compatible: ['OSB/plywood sheathing', 'Dense-pack or batt insulation', 'Ventilation channels', 'Engineered hangers and ridge connectors'],
    commonErrors: [
      'Cutting or notching the flanges.',
      'Missing connectors or blocking at the ridge and walls.',
      'Spacing or span beyond the manufacturer tables.',
      'Leaving the I-joists exposed to rain for long.',
      'Ignoring outward thrust at the walls with no ties or beam.',
    ],
    moisture:
      'Keep framing dry; wet-built wood or OSB webs can swell, and damp framing under a sealed ceiling dries slowly.',
    thermal:
      'The web is thin, which reduces thermal bridging compared to solid wood, but the flanges still bridge insulation.',
    coldClimate:
      'Interior Alaska snow loads can be high and drift-prone; rafter size and spacing must be designed by a licensed engineer, not copied from this model. Cold-weather framing needs care with ice and snow on members.',
    codeRefs: [SNOW],
  },

  'roof-insulation': {
    description:
      'Insulation filling the rafter bays, such as dense-pack cellulose, mineral wool or fiberglass batts, placed below the vent channel.',
    purpose:
      'Slows heat loss from the house through the roof, and reduces roof-deck warming that causes ice dams.',
    thickness: 'Limited by the cavity depth: about 11-7/8 in (302 mm) minus the vent channel space, so around 9-10 in (230-255 mm) after baffles. Verify with design.',
    dimensions: 'Batts commonly 15 in or 23 in wide to fit 16 in or 24 in o.c.; dense-pack is blown to fill. Verify with supplier.',
    installSequence: [
      'Complete vent channels and make sure the eave opening is clear.',
      'Air-seal penetrations and bay ends before insulating.',
      'Fit batts snugly or blow dense-pack to the specified density.',
      'Do not compress or leave voids at edges.',
      'Leave the vent path open, then install the vapor and air layers.',
    ],
    fastening:
      'Friction fit for batts; dense-pack is held by a netting or the ceiling layer. Follow the manufacturer.',
    compatible: ['Vent baffles', 'Variable-perm vapor control', 'Taped air-control layer', 'I-joist rafters'],
    commonErrors: [
      'Gaps and voids that let heat and air move around the insulation.',
      'Insulation blocking the vent channel.',
      'Compressing batts, which lowers effective R-value.',
      'Insulating before the air sealing is finished.',
      'Wet insulation installed and closed in.',
    ],
    moisture:
      'Insulation does not stop air movement; wet insulation loses performance and can promote mold. Keep it dry before closing in.',
    thermal:
      'R-value depends on product, depth and density; verify with manufacturer data and the adopted energy code. Rafters and flanges still bridge the insulation.',
    coldClimate:
      'Deep cold means large heat flow, so the target R-value is high; confirm the energy-code requirement with the building official and a designer. Thermal bridging at the rafters matters. Missing air sealing at 40 below can frost the cold side.',
    codeRefs: [
      {
        ref: 'IECC roof/ceiling insulation requirements',
        note: 'The energy code sets a minimum insulation level by climate zone; the value and edition used locally must be confirmed with the building official. No value is given here.',
        confidence: 'UNVERIFIED',
      },
      R806_CLEAR,
    ],
  },

  'roof-vapor': {
    description:
      'A variable-perm (smart) vapor-control membrane installed on the warm side of the insulation. It slows vapor going into the roof in winter and allows drying in summer.',
    purpose:
      'Limits water vapor diffusion from the heated interior into the cold roof assembly.',
    thickness: 'Thin film, typically well under 1/16 in (about 0.1-0.2 mm). Verify with manufacturer.',
    dimensions: 'Rolls commonly 4-10 ft wide and 100 ft or longer; verify with supplier.',
    installSequence: [
      'Insulate and verify the vent path is clear.',
      'Unroll the membrane across the rafters, working from the eave up.',
      'Staple lightly at the rafters and keep laps on framing.',
      'Seal laps and edges with the manufacturer-approved tape or sealant.',
      'Seal to the air-control layer at penetrations and edges.',
    ],
    fastening:
      'Light staples or tape to the framing; the ceiling board holds it in place later. Follow the manufacturer.',
    compatible: ['Dense-pack or batt insulation', 'Taped air-control layer', 'Gypsum ceiling', 'Manufacturer tapes and sealants'],
    commonErrors: [
      'Tears and unsealed laps that leak humid air.',
      'Using a polyethylene vapor barrier where the design calls for a variable-perm product.',
      'Putting a vapor-closed layer on both sides of the assembly.',
      'Skipping sealing at penetrations.',
      'Leaving it exposed to UV before the ceiling goes up.',
    ],
    moisture:
      'Vapor diffusion is a smaller moisture path than air leakage; the vapor layer helps but does not replace air sealing.',
    thermal:
      'No insulation value.',
    coldClimate:
      'Vapor drive from a heated interior toward the cold roof deck is strong at 40 below and drives frost on the sheathing underside. Indoor humidity control (ventilation, dehumidification) matters as much. Check the type and class needed with the designer and building official.',
    codeRefs: [R702_VAPOR],
  },

  'roof-air': {
    description:
      'A continuous, taped air barrier at the ceiling plane that stops warm interior air from moving into the roof assembly. It may be the same as the vapor layer or a separate sheet.',
    purpose:
      'Stops air leakage, the largest moisture and heat-loss path through the roof, and protects the sheathing from frost.',
    thickness: 'Thin sheet or membrane; thickness depends on the product. Verify with manufacturer.',
    dimensions: 'Sheets or rolls to cover the ceiling; seams taped; check manufacturer for sizes.',
    installSequence: [
      'Plan the air barrier continuity with the wall system.',
      'Install the sheet or sealed drywall across the ceiling plane.',
      'Tape all seams and edges with approved tape.',
      'Seal around lights, vents, chimneys, and the attic hatch.',
      'Test with a blower door if the project calls for it.',
    ],
    fastening:
      'Staples or adhesive plus tape and sealant; continuity matters more than the fastener. Follow the manufacturer.',
    compatible: ['Variable-perm vapor control', 'Gypsum ceiling', 'Gaskets and sealants', 'Wall air-barrier connections'],
    commonErrors: [
      'Unsealed penetrations from wiring and recessed lights.',
      'Gaps where the ceiling meets walls and rafters.',
      'Tape that fails on dusty or cold surfaces.',
      'Not connecting to the wall air barrier.',
      'Damage from later trades.',
    ],
    moisture:
      'Air leakage carries far more moisture than vapor diffusion; this is the key defense against frost and condensation in the roof.',
    thermal:
      'Reduces heat loss by stopping air movement around the insulation; no R-value of its own.',
    coldClimate:
      'Small leaks at 40 below can deposit large amounts of frost on the sheathing, which melts and wets the assembly in spring. Tapes and sealants have low-temperature application limits, so seal indoors in warm conditions where possible.',
    codeRefs: [
      {
        ref: 'IECC air leakage / building thermal envelope',
        note: 'The energy code requires a sealed building envelope, which often includes a blower-door test. Requirements and edition vary; confirm with the building official.',
        confidence: 'LIKELY',
      },
    ],
  },

  'roof-ceiling': {
    description:
      'Gypsum board fastened to the underside of the rafters (and any strapping), finished with tape, mud and paint.',
    purpose:
      'Provides the interior finish, covers the insulation and air layers, and adds fire protection.',
    thickness: 'Commonly 1/2 in (12.7 mm) or 5/8 in (15.9 mm); thicker or fire-rated types may be required. Verify spacing requirements for the chosen thickness.',
    dimensions: 'Sheets commonly 4 ft x 8 ft, 10 ft or 12 ft (1.2 m x 2.4-3.7 m).',
    installSequence: [
      'Finish air and vapor layers and verify the framing is flat.',
      'Hang ceiling sheets first, perpendicular to rafters.',
      'Screw at the spacing the manufacturer or code requires.',
      'Tape and mud joints, sand, then prime and paint.',
    ],
    fastening:
      'Drywall screws into the rafter bottom flanges (or strapping) at the manufacturer spacing; verify that fasteners do not damage the air layer more than needed.',
    compatible: ['Taped air-control layer', 'Variable-perm vapor control', 'Strapping or service cavity', 'Primer and low-VOC paint'],
    commonErrors: [
      'Sagging because of thin board over wide spacing or heavy insulation.',
      'Screws missing the flanges.',
      'Penetrations cut without sealing the air layer.',
      'Finishing in cold or damp conditions so joint compound does not dry.',
      'Skipping a service cavity, forcing many wiring penetrations.',
    ],
    moisture:
      'Gypsum is vulnerable to moisture; keep the building dry during finishing and heat the space during mud work.',
    thermal:
      'Little insulation value; it is the interior face of the assembly.',
    coldClimate:
      'The building must be heated before finishing, since joint compound needs warmth to cure. A paint or primer with moisture control helps in a long winter. Cold ceilings with leaks can show stains or frost spots, which indicate an air-sealing problem.',
    codeRefs: [
      {
        ref: 'IRC R302 (fire-resistant construction) / R702 (interior coverings)',
        note: 'Gypsum board installation and fire-related thickness rules live in these chapters; the exact requirement depends on the edition and use. Confirm with the building official.',
        confidence: 'LIKELY',
      },
    ],
  },
};
