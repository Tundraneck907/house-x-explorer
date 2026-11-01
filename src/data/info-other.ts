import type { MaterialInfo } from './types';

// ILLUSTRATIVE content for a generic model house. Foundation design in Interior Alaska
// (frost depth, permafrost, thaw settlement, pile/post vs. stem wall) is site-specific and
// requires a geotechnical engineer and a licensed structural professional.
// Code refs are edition-dependent; none were confirmed from a source this session.

const PRO =
  "Illustrative model only. Foundation type, depth, bearing and insulation in Interior Alaska depend on site soils and permafrost and must be designed by a geotechnical/structural professional.";

export const OTHER_INFO: Record<string, MaterialInfo> = {
  'fnd-gravel': {
    description:
      "A compacted pad of clean, free-draining, non-frost-susceptible granular fill placed over prepared native ground. It is the base the footings and crawlspace sit on. " + PRO,
    purpose:
      "Spreads building load, drains water away from the footings, and keeps frost-susceptible silt from wetting up directly under the structure. Pads may also be insulated or thickened to manage heat flow into the ground; that is an engineered decision.",
    thickness:
      "Varies widely by site; commonly from several inches to several feet (about 150 mm to over 1 m). Set by the geotechnical report, not by rule of thumb.",
    dimensions:
      "Extends beyond the footprint on all sides (width set by engineer). Delivered as crushed or screened gravel with specified gradation; placed in thin lifts.",
    installSequence: [
      "Get the geotechnical report and engineered pad design; confirm permafrost and groundwater conditions.",
      "Strip organics and remove unsuitable soil as directed (stripping can alter permafrost; follow the engineer).",
      "Place gravel in thin lifts, grading to shed water away from the house.",
      "Compact each lift with a plate or roller compactor to the specified density.",
      "Check grades and have the engineer or special inspector verify before footing forms.",
    ],
    fastening: "None. Held by compaction and confinement; side slopes graded to stay stable.",
    compatible: [
      "Geotextile separation fabric (if specified)",
      "Rigid foam insulation layers under or beside the pad (if engineered)",
      "Perimeter drain / sloped grade",
      "Concrete footings",
    ],
    commonErrors: [
      "Using silty native soil or fill with too many fines, which stays frost-susceptible.",
      "Skipping compaction testing or placing thick lifts, causing settlement.",
      "Stripping the organic mat on permafrost ground without engineering input, starting thaw.",
      "Grading toward the house so water ponds at the footing.",
      "Placing gravel on frozen or snow-covered ground.",
    ],
    moisture:
      "The pad should drain freely and never hold water. Surface grade should slope away; poor drainage feeds frost heave and crawlspace dampness.",
    thermal:
      "Gravel itself is a poor insulator. Insulated pads (foam layers) are sometimes used to limit heat loss and ground thaw; thickness and R-value come from the engineer.",
    coldClimate:
      "Interior Alaska has discontinuous permafrost and frost-susceptible silts; the same lot can differ in 50 feet. Heat from a house can thaw ice-rich ground and cause settlement, while frozen ground heaves. Work in deep cold is hard because frozen fill cannot be compacted, so winter placement needs a plan. Have a geotechnical engineer decide.",
    codeRefs: [
      { ref: "IRC R401.3", note: "Surface drainage must direct water away from the foundation (edition-dependent).", confidence: 'LIKELY' },
      { ref: "IRC R403.1", note: "Footings must bear on adequate soil; soil bearing and frost design come from engineering and local requirements.", confidence: 'LIKELY' },
    ],
  },

  'fnd-footing': {
    description:
      "Cast-in-place reinforced concrete strips that sit under the stem wall and spread its load onto the soil or gravel pad. " + PRO,
    purpose:
      "Transfers wall and floor loads to the ground over a wide enough area, and bears below the depth the designer sets for frost and soil conditions.",
    thickness:
      "Set by design; commonly several inches to a foot or more (roughly 150 to 300+ mm). Verify with the structural engineer.",
    dimensions:
      "Continuous strip wider than the stem wall (width by design); depth to bearing is a site-specific design decision. Concrete is typically ordered by strength class and slump from a local plant.",
    installSequence: [
      "Confirm excavation and bearing material with the engineer or inspector; keep subgrade unfrozen.",
      "Build and level forms; set keyways or dowels as drawn.",
      "Place footing rebar on supports (chairs) with required cover.",
      "Pour concrete, vibrate or rod it, and screed level.",
      "Cure with moisture retention and cold-weather protection before loading.",
    ],
    fastening: "Rebar tied with wire at laps and crossings; dowels tied to footing steel to connect to the stem wall.",
    compatible: [
      "Stem-wall dowels",
      "Gravel pad",
      "Perimeter footing drain",
      "Foam insulation at the footing edge (if engineered)",
    ],
    commonErrors: [
      "Pouring onto frozen or soft subgrade, which thaws and settles.",
      "Letting fresh concrete freeze before it gains strength.",
      "Incorrect rebar cover or position (steel sitting on the ground).",
      "Footing not level, forcing stem-wall adjustments.",
      "Assuming a standard footing depth instead of getting a site design.",
    ],
    moisture:
      "Keep water out of the footing trench and away from bearing soil. Footing drains and gravel help, but design is site-specific.",
    thermal:
      "Concrete conducts heat well, so footing edges can be a thermal bridge; insulation placement is part of engineered design.",
    coldClimate:
      "Frost heave and thaw settlement mean footing depth and insulation must follow a soils report; do not copy a depth from another house. Cold-weather concreting needs heated enclosures, blankets and mix-design guidance, and frozen ground must never receive concrete. Permafrost sites often use other foundation types entirely.",
    codeRefs: [
      { ref: "IRC R403", note: "Footing requirements, including bearing, size and depth below frost; frost depth must come from local adoption and engineering (edition-dependent).", confidence: 'LIKELY' },
      { ref: "IRC R402.2", note: "Concrete material and strength requirements for foundations (edition-dependent).", confidence: 'UNVERIFIED' },
    ],
  },

  'fnd-stem': {
    description:
      "A reinforced concrete wall, often built with insulating concrete form (ICF) blocks in this model, that rises from the footing to support the floor and sill plate. " + PRO,
    purpose:
      "Carries the house load down to the footing, retains soil where the grade rises, and encloses the crawlspace.",
    thickness:
      "Design-dependent; ICF cores are commonly in the 6 to 10 in. range (about 150 to 250 mm). Verify with the engineer and ICF manufacturer.",
    dimensions:
      "Height set by crawlspace clearance and grade; continuous around the perimeter with vent or access openings as designed. ICF blocks are manufacturer-specific sizes.",
    installSequence: [
      "Verify footing level and dowel locations.",
      "Stack forms or set wall forms, bracing plumb and straight.",
      "Place horizontal and vertical rebar; set window/vent bucks and anchor bolts.",
      "Pour concrete in controlled lifts and consolidate.",
      "Cure, remove forms if used, and check for voids.",
    ],
    fastening: "Rebar tied to footing dowels; anchor bolts cast in top of wall; ICF ties are part of the form system.",
    compatible: [
      "Footing dowels",
      "Damp-proofing membrane",
      "Exterior rigid foam",
      "Pressure-treated sill plate with sealer",
    ],
    commonErrors: [
      "Blowouts or voids from pouring too fast or poor consolidation.",
      "Anchor bolts misplaced or not embedded to the engineered depth.",
      "Backfilling before the floor deck braces the wall.",
      "Concrete poured at low temperatures without protection.",
      "Skipping drainage and damp-proofing below grade.",
    ],
    moisture:
      "Concrete wicks moisture from the ground; damp-proofing outside and a capillary break at the sill are needed. Surface water must drain away.",
    thermal:
      "Bare concrete is a thermal bridge. Foam forms or exterior foam reduce losses; required R-values are edition- and climate-zone dependent, so confirm locally.",
    coldClimate:
      "At -40 degrees F/C extremes the wall is exposed to freeze-thaw cycles, so protect the top and exterior from saturation. Frost heave can push on walls bearing in frost-susceptible soil, which is why site-specific design matters. Pour only with cold-weather plans; verify any adopted code and design with the local official and engineer.",
    codeRefs: [
      { ref: "IRC R404.1", note: "Concrete and masonry foundation walls must be designed or follow prescriptive limits (edition-dependent).", confidence: 'LIKELY' },
      { ref: "IRC R608 / R611", note: "Prescriptive concrete wall and ICF requirements; edition-dependent, may require engineering in high-seismic areas such as Alaska.", confidence: 'UNVERIFIED' },
    ],
  },

  'fnd-rebar': {
    description:
      "Steel reinforcing bars inside footings and stem walls, plus anchor bolts or straps cast into the top of the wall that tie the sill plate to the foundation. " + PRO,
    purpose:
      "Rebar resists tension and cracking in concrete; anchor bolts resist uplift and sliding from wind and seismic forces.",
    thickness:
      "Bar sizes are called out by number (for example #4 means 1/2 in. nominal diameter). Actual sizes and spacing come from the engineer.",
    dimensions:
      "Bars are straight lengths with specified laps and bends; anchor bolts are typically 1/2 in. or 5/8 in. diameter with a hooked or headed embedded end. Verify against drawings.",
    installSequence: [
      "Check the drawings for bar size, spacing, lap length and cover.",
      "Set bars on chairs in the footing and tie dowels.",
      "Place vertical and horizontal bars in the wall form.",
      "Position anchor bolts or straps with templates at the specified spacing and edge distance.",
      "Have the building inspector check before concrete placement.",
    ],
    fastening: "Wire ties at crossings and laps; anchor bolts held by template and cast in; washers and nuts torqued at the sill.",
    compatible: [
      "Concrete",
      "Plastic or concrete bar supports",
      "Pressure-treated sill plate",
      "Hold-downs if designed",
    ],
    commonErrors: [
      "Bars resting on the ground or against forms with no cover.",
      "Too-short laps or missing corner bars.",
      "Anchor bolts too close to the sill edge or poorly aligned.",
      "Cutting rebar to clear a bolt or pipe without approval.",
      "Using rusty, oily or ice-coated bars.",
    ],
    moisture:
      "Concrete cover protects steel from rust. Keep bars clear of the wall face and below-grade water paths.",
    thermal:
      "Steel is conductive but the volume is small; the main thermal concern is the concrete itself.",
    coldClimate:
      "Remove ice and snow from bars before the pour. Cold-weather placement needs protection so concrete does not freeze around the steel. Seismic design is a real factor in Alaska, so the anchorage schedule should come from the engineer, not generic details.",
    codeRefs: [
      { ref: "IRC R403.1.6", note: "Sill plates must be anchored to the foundation with anchor bolts or approved anchors; spacing is code- and engineering-dependent (edition-dependent).", confidence: 'LIKELY' },
      { ref: "IRC R404.1", note: "Reinforcement in foundation walls follows design or prescriptive tables.", confidence: 'LIKELY' },
    ],
  },

  'fnd-damp': {
    description:
      "A liquid-applied or sheet damp-proofing coating on the outside of the below-grade wall, often with a dimpled drainage membrane that lets water drain down to the footing drain. " + PRO,
    purpose:
      "Resists moisture movement from wet soil into the concrete and keeps water pressure off the wall.",
    thickness:
      "Coatings are applied in mils (thin film); drainage mats are roughly a fraction of an inch thick. Follow the manufacturer's datasheet.",
    dimensions:
      "Covers the wall from footing up to a few inches above finished grade, terminating at a protected edge. Rolls and pails vary by product.",
    installSequence: [
      "Clean the wall surface and fill voids or tie holes.",
      "Prime if the manufacturer requires it.",
      "Apply coating or membrane to the full below-grade height, with cove at the footing.",
      "Install the dimpled drainage layer and terminate it at the top.",
      "Protect the membrane before backfill.",
    ],
    fastening: "Coatings bond by adhesion; sheet membranes use manufacturer adhesive or termination bars; drainage mats use cap nails or tape near the top.",
    compatible: [
      "Concrete and ICF surfaces (check foam compatibility)",
      "Exterior rigid foam",
      "Footing drain pipe",
      "Gravel backfill",
    ],
    commonErrors: [
      "Using a solvent-based product that dissolves foam insulation.",
      "Applying to a wet, dirty or frozen surface.",
      "Coating too thin or missing the footing joint.",
      "Backfilling with sharp rock that punctures the membrane.",
      "Leaving the top edge open so water runs behind it.",
    ],
    moisture:
      "Damp-proofing resists moisture; it is not full waterproofing under hydrostatic pressure. Drainage and grading are what keep the wall dry.",
    thermal:
      "Negligible thermal value. Its job is moisture control.",
    coldClimate:
      "Most coatings have a minimum application temperature, and cold surfaces will not cure; verify the manufacturer's limit and plan heat or timing. Ice behind membranes and freeze-thaw can damage poorly attached sheets.",
    codeRefs: [
      { ref: "IRC R406", note: "Foundation walls enclosing usable space must be damp-proofed; waterproofing is needed where high groundwater exists (edition-dependent).", confidence: 'LIKELY' },
      { ref: "IRC R405", note: "Foundation drainage provisions.", confidence: 'LIKELY' },
    ],
  },

  'fnd-insulation': {
    description:
      "Rigid foam board (commonly XPS or EPS) fastened to the outside of the stem wall, extending down to the footing in some designs and protected above grade by a coating or cover. " + PRO,
    purpose:
      "Reduces heat loss through the concrete, keeps the wall warm to limit condensation, and may help manage frost near the foundation if designed for that purpose.",
    thickness:
      "Commonly 2 to 4 in. (about 50 to 100 mm) in cold climates, but required R-value is climate- and edition-dependent. Verify with the local building official.",
    dimensions:
      "Boards commonly 4 ft x 8 ft; stagger joints and cover from the sill to the specified depth.",
    installSequence: [
      "Confirm compatibility with the damp-proofing product.",
      "Apply adhesive or fasteners as the manufacturer allows.",
      "Install boards with tight, staggered joints.",
      "Tape or seal seams at the top near the sill.",
      "Cover the above-grade portion with a protective coating, panel or cement board.",
    ],
    fastening: "Compatible foam adhesive and/or mechanical fasteners; keep fasteners from puncturing the membrane unless the system allows it.",
    compatible: [
      "Damp-proofing coatings that are foam-safe",
      "ICF or poured walls",
      "Protective cementitious coating",
      "Gravel backfill",
    ],
    commonErrors: [
      "Leaving above-grade foam exposed to sun and damage.",
      "Gaps at the sill that create a thermal bypass.",
      "Foam damaged by backfill equipment.",
      "Letting soil contact or insects reach the foam without a plan.",
      "Mismatching foam with the wrong adhesive or sealant.",
    ],
    moisture:
      "Foam sheds moisture but needs a drainage path; water trapped behind it can freeze. Use a termination that blocks water entry at the top.",
    thermal:
      "R-value per inch depends on foam type and age; check the manufacturer's published values. Foam over a warm crawlspace wall reduces losses and cold bridges.",
    coldClimate:
      "Frost heave can load foam at the grade line. The designer may specify horizontal foam wings in some soils, but only a geotechnical professional can say if they are appropriate. Foam gets brittle in deep cold, so handle with care. Verify adhesive low-temp limits.",
    codeRefs: [
      { ref: "IECC R402.2.8 / Table R402.1.3", note: "Foundation wall insulation requirement by climate zone; section numbers vary by edition.", confidence: 'UNVERIFIED' },
      { ref: "IRC R316", note: "Foam plastic must be protected as required where exposed (edition-dependent).", confidence: 'LIKELY' },
    ],
  },

  'fnd-ground-vapor': {
    description:
      "A heavy polyethylene sheet laid over the crawlspace soil, lapped and sealed, and lapped up the stem walls. " + PRO,
    purpose:
      "Stops soil moisture and soil gas from rising into the crawlspace and the insulated floor above.",
    thickness:
      "Commonly 6 mil minimum is cited in codes; many installers use 10 to 20 mil for durability (about 0.15 to 0.5 mm). Verify what your edition requires.",
    dimensions:
      "Sheet widths vary (for example 10 to 20 ft rolls); overlap seams several inches to a foot as required, and extend up the walls.",
    installSequence: [
      "Level the soil and remove sharp rocks and debris.",
      "Roll out sheets with the specified overlap.",
      "Seal seams with compatible tape.",
      "Run the sheet up the stem wall and secure it.",
      "Seal around piers, pipes and penetrations.",
    ],
    fastening: "Seam tape, termination bar or compatible adhesive at the wall; avoid nailing through the sheet.",
    compatible: [
      "Polyethylene or reinforced vapor retarder sheets",
      "Seam tape",
      "Sealant at stem wall",
      "Gravel or sand cover (optional)",
    ],
    commonErrors: [
      "Leaving seams unsealed or short overlaps.",
      "Tears or punctures from foot traffic or sharp stones.",
      "Not lapping up the wall, leaving a bypass.",
      "Letting standing water collect on top.",
      "Using thin builder film when durable sheet is needed.",
    ],
    moisture:
      "Controls ground moisture, but it is not a drainage layer. The crawlspace still needs drainage or a sump plan if water appears.",
    thermal:
      "No meaningful R-value. It reduces latent load and keeps insulation dry.",
    coldClimate:
      "Where permafrost or very cold ground exists, a warm crawlspace could affect ground temperature, so this ties into the engineered design. Poly becomes stiff and brittle in the cold and may crack; install in warmer conditions where possible. Seasonal frost heave can lift and tear the sheet.",
    codeRefs: [
      { ref: "IRC R408", note: "Under-floor space provisions, including vented and unvented crawlspaces; ground cover requirements depend on edition.", confidence: 'LIKELY' },
      { ref: "IRC R408.3", note: "Unvented crawlspace option with a ground vapor retarder and conditioning requirements (edition-dependent).", confidence: 'LIKELY' },
    ],
  },

  'floor-finish': {
    description:
      "The visible walking surface: hardwood, engineered wood, LVP, tile, carpet or similar over the underlayment.",
    purpose:
      "Provides a durable, comfortable and cleanable surface and finishes the interior.",
    thickness:
      "Varies by product; commonly about 3/8 in. to 3/4 in. (10 to 19 mm) for wood and LVP, thinner for sheet goods.",
    dimensions:
      "Planks, tiles or rolls per product; follow the manufacturer's layout and expansion gap rules.",
    installSequence: [
      "Let the product acclimate in the heated house per instructions.",
      "Check the underlayment for flatness and dryness.",
      "Lay out from a reference line, leaving expansion gaps at walls.",
      "Install per product method (nail, glue, float, thinset).",
      "Add transitions, baseboard and cleanup.",
    ],
    fastening: "Varies: nails or staples for wood, adhesive or floating click systems, thinset for tile. Follow the product instructions.",
    compatible: [
      "Plywood or OSB-type underlayment",
      "Radiant floor heat (check product rating)",
      "Floor-safe adhesives",
      "Trim and thresholds",
    ],
    commonErrors: [
      "Installing before the house is at normal heated humidity.",
      "No expansion gap at walls.",
      "Laying over a wavy or damp subfloor.",
      "Using the wrong adhesive or trowel notch.",
      "Ignoring the product's heated-floor temperature limit.",
    ],
    moisture:
      "Wood flooring swells and shrinks with humidity. Measure subfloor moisture before install; keep crawlspace moisture controlled.",
    thermal:
      "Contributes little insulation. Cold floors in winter are mostly a function of the insulation and air sealing below.",
    coldClimate:
      "Indoor winter humidity can drop very low when cold air is heated, so wood floors may gap and crack. Keep indoor humidity within the manufacturer's range, often with the HRV and humidification. Do not store or install material in freezing conditions.",
    codeRefs: [],
  },

  'floor-underlayment': {
    description:
      "A thin panel layer, such as plywood, hardboard or specialty underlayment, placed over the structural subfloor to give a smooth, flat base.",
    purpose:
      "Smooths subfloor seams and imperfections, improves bonding for finish materials, and can add sound damping depending on the product.",
    thickness:
      "Commonly 1/4 in. to 1/2 in. (about 6 to 13 mm); the finish flooring maker will specify the type.",
    dimensions:
      "Panels commonly 4 ft x 8 ft; offset joints from the subfloor seams.",
    installSequence: [
      "Clean and flatten the subfloor, fixing squeaks and high spots.",
      "Check moisture content.",
      "Lay panels with staggered seams and a small gap.",
      "Fasten on the manufacturer's pattern.",
      "Fill and sand seams as required.",
    ],
    fastening: "Ring-shank nails, staples or screws on the manufacturer's schedule; adhesive where specified.",
    compatible: [
      "OSB or plywood subfloor",
      "Tile backer (for tile)",
      "Resilient or wood finish floors",
      "Sound mat products",
    ],
    commonErrors: [
      "Fasteners too long, hitting pipes or poking through the underside.",
      "Seams aligned over subfloor seams.",
      "Using an underlayment not approved by the floor maker.",
      "Leaving no expansion gap.",
      "Installing over moisture-damaged subfloor.",
    ],
    moisture:
      "Keep dry during construction. Cover the subfloor to avoid rain and snow before the building is closed in.",
    thermal:
      "Slight added resistance; not a significant insulator.",
    coldClimate:
      "Panels shrink as the heated house dries out in winter, so leave gaps. Do not install on a frozen or wet subfloor. Adhesives often have minimum temperatures, so confirm before cold-season installs.",
    codeRefs: [
      { ref: "IRC R503.3", note: "Underlayment requirements for wood floor finishes (edition-dependent).", confidence: 'UNVERIFIED' },
    ],
  },

  'floor-subfloor': {
    description:
      "Tongue-and-groove structural OSB (or plywood) panels glued and fastened to the joists to form the working deck and diaphragm.",
    purpose:
      "Spans between joists, carries floor loads, ties the framing together and gives a platform for walls and finish.",
    thickness:
      "Commonly 23/32 in. (3/4 nominal), about 19 mm; the actual panel span rating must match the joist spacing. Verify the stamp.",
    dimensions:
      "4 ft x 8 ft panels, long edge perpendicular to the joists, with tongue-and-groove on the long edges.",
    installSequence: [
      "Snap a chalk line and verify joists are flat and aligned.",
      "Apply subfloor adhesive to the top of the joists.",
      "Lay the first panel, groove side to the wall, with end joints staggered.",
      "Leave a small gap at panel edges and ends as the manufacturer recommends.",
      "Fasten on the nailing schedule.",
    ],
    fastening: "Construction adhesive plus ring-shank nails or screws at the schedule on the drawings; edge spacing per panel manufacturer.",
    compatible: [
      "Engineered I-joists",
      "Subfloor adhesive rated for the panel",
      "Underlayment",
      "Rim board",
    ],
    commonErrors: [
      "Panels left rained or snowed on for weeks, swelling at edges.",
      "No gap for expansion, causing buckling.",
      "Missing glue, causing squeaks.",
      "Fasteners over-driven or missing the joist.",
      "Using adhesive not rated for cold temperatures.",
    ],
    moisture:
      "OSB edges swell if wet. Cover early and dry out before finishing; protect the exposure rating.",
    thermal:
      "Minor insulation value. Air sealing at the rim and joints matters more.",
    coldClimate:
      "Snow and ice on an open deck are common in construction season, so clear them and let the deck dry before floor finishes. Adhesives have temperature limits; verify. Moisture from construction and from the heated house will be driven into the floor system.",
    codeRefs: [
      { ref: "IRC R503.2", note: "Wood structural panel floor sheathing requirements and span ratings (edition-dependent).", confidence: 'LIKELY' },
      { ref: "IRC Table R503.2.1.1(1)", note: "Panel thickness vs. joist spacing; table number varies by edition.", confidence: 'UNVERIFIED' },
    ],
  },

  'floor-joists': {
    description:
      "Engineered wood I-joists (OSB web with LVL or lumber flanges) running between rim boards to carry the floor.",
    purpose:
      "Provide long, light, stable spans with room for insulation and utilities, and transfer loads to the foundation and beams.",
    thickness:
      "Common depths are 9-1/2 in., 11-7/8 in., 14 in. and 16 in. (about 241 to 406 mm). Depth and spacing must follow the manufacturer's span tables or engineer.",
    dimensions:
      "Flange width typically about 1-1/2 to 3-1/2 in.; spaced 12, 16 or 24 in. on center, with rim board matched to joist depth.",
    installSequence: [
      "Install the rim board on the sill plate.",
      "Mark joist layout on the rim and beam.",
      "Set joists, fastening to the rim with the specified blocking.",
      "Add squash blocks, web stiffeners and bridging as required.",
      "Frame openings per the manufacturer's details.",
    ],
    fastening: "Nails sized per the manufacturer; do not nail into the flange edge in ways the maker prohibits. Use approved hangers and clips.",
    compatible: [
      "Rim board of the same manufacturer",
      "Subfloor adhesive",
      "Joist hangers",
      "Spray foam and batt insulation",
    ],
    commonErrors: [
      "Cutting or notching flanges.",
      "Drilling holes outside the manufacturer's allowed zones in the web.",
      "Leaving joists unbraced during construction, so they roll or collapse.",
      "Wetting beyond the manufacturer's allowed exposure.",
      "Missing web stiffeners at bearing or hangers.",
    ],
    moisture:
      "Keep covered from rain; I-joists tolerate only limited exposure. The crawlspace condition below affects them long term.",
    thermal:
      "The web and rim board are thermal bridges, but much smaller than solid lumber. Rim areas are a key air leakage and heat loss location.",
    coldClimate:
      "Snow loads, floor loads and any hanging belly weight must be considered by a professional. Moisture drive upward from a damp crawlspace or downward from interior humidity can affect the framing. Cold lumber is slippery and brittle, and OSB webs resist cracking best with care.",
    codeRefs: [
      { ref: "IRC R502", note: "Wood floor framing, including engineered joists per manufacturer evaluation reports (edition-dependent).", confidence: 'LIKELY' },
      { ref: "IRC R502.1.5 / R502.8", note: "Prefabricated I-joist requirements and cutting limits; numbering varies by edition.", confidence: 'UNVERIFIED' },
    ],
  },

  'floor-insulation': {
    description:
      "Insulation placed between the floor joists (batts, blown-in, or spray foam) to separate the heated floor from the crawlspace.",
    purpose:
      "Reduces heat loss and cold floors, with the belly air barrier below keeping the insulation tight and protected.",
    thickness:
      "Fills the joist depth, for example 9-1/2 in. to 16 in. (about 240 to 400 mm). Required R-value depends on the adopted code edition and climate zone; verify locally.",
    dimensions:
      "Cavity width follows joist spacing; batts are made for 16 in. and 24 in. spacing.",
    installSequence: [
      "Air-seal rim, penetrations and subfloor joints first.",
      "Install underside support or belly air barrier layer.",
      "Fill the cavities completely and without voids.",
      "Keep the insulation in contact with the subfloor.",
      "Check for compression and gaps at the beams and rim.",
    ],
    fastening: "Friction fit, wire or strapping supports, or the underside barrier; spray foam adheres to the framing.",
    compatible: [
      "Mineral wool, fiberglass or cellulose",
      "Closed-cell spray foam at rim",
      "Belly board or air barrier",
      "Sealed ducts and wires",
    ],
    commonErrors: [
      "Gaps between insulation and the subfloor that allow convective loops.",
      "Compressing batts around pipes and wires.",
      "Leaving rim joist areas uninsulated.",
      "Placing insulation under a leaking drain or pipe with no access.",
      "Uncovered insulation exposed to crawlspace air and pests.",
    ],
    moisture:
      "Wet insulation loses performance. Ground vapor control and a dry crawlspace are essential, and plumbing leaks must be fixed promptly.",
    thermal:
      "Insulation value depends on the material and installation quality; use manufacturer published R-values. Gaps cause big losses.",
    coldClimate:
      "With -40 degree air in a vented crawlspace, an incomplete floor insulation layer can freeze pipes and make floors cold. Pipes need to sit inside the insulated envelope or be protected. Vapor drive from the warm interior means air-sealing is the critical piece.",
    codeRefs: [
      { ref: "IECC R402.2.7", note: "Floor insulation must be installed to maintain permanent contact with the underside of the subfloor (section number edition-dependent).", confidence: 'LIKELY' },
      { ref: "IECC Table R402.1.3", note: "Required R-values by climate zone; verify the adopted edition locally.", confidence: 'LIKELY' },
    ],
  },

  'floor-underside': {
    description:
      "A rigid or semi-rigid sheet (such as belly board, housewrap-type or similar air barrier) fastened to the underside of the joists to enclose the insulation.",
    purpose:
      "Stops wind and air from moving through the insulation, holds it in place, and protects it from pests and crawlspace humidity.",
    thickness:
      "Typically thin: sheet products are a fraction of an inch, and boards roughly 1/4 to 1/2 in. (6 to 13 mm). Verify the product.",
    dimensions:
      "Sheets or rolls sized to span joists, taped or sealed at all edges to the framing and beams.",
    installSequence: [
      "Complete insulation and inspections of wiring and plumbing.",
      "Cut the barrier to fit between or across the joists.",
      "Fasten to the joist bottoms.",
      "Tape or seal all seams and edges.",
      "Seal penetrations such as pipes and ducts.",
    ],
    fastening: "Cap staples, screws with washers or strapping, plus compatible tape or sealant at seams.",
    compatible: [
      "Mineral wool or fiberglass insulation",
      "Sealant and tape rated for cold",
      "Rigid board or fabric membranes",
      "Sealed rim details",
    ],
    commonErrors: [
      "Leaving seams or edges open.",
      "Using a vapor-impermeable layer on the underside that traps moisture in the insulation.",
      "Letting the barrier sag, creating air pockets.",
      "Not sealing pipe and wire penetrations.",
      "Skipping the barrier at beams and edges.",
    ],
    moisture:
      "Choose a vapor-open or air-barrier product so that the floor can dry downward if it ever gets wet, unless the design says otherwise. Do not trap water in the cavity.",
    thermal:
      "Air barrier performance prevents wind-washing of the insulation, which can dramatically reduce effective R-value.",
    coldClimate:
      "Wind through a vented crawlspace in deep cold can strip heat from poorly sealed floors. Tapes and sealants have temperature limits; check the manufacturer. Condensation can form on the cold side if warm air leaks in.",
    codeRefs: [
      { ref: "IECC R402.4", note: "Building thermal envelope must be durably sealed to limit air leakage (edition-dependent).", confidence: 'LIKELY' },
    ],
  },

  'floor-sill': {
    description:
      "A pressure-treated wood plate bolted to the top of the stem wall over a compressible foam sill sealer; the floor framing sits on it.",
    purpose:
      "Provides a level, anchored bearing surface, separates wood from concrete moisture, and seals the air path at the foundation.",
    thickness:
      "Usually 2x lumber, 1-1/2 in. (38 mm) actual, with sill sealer about 1/4 to 1/2 in. when compressed less; verify the product.",
    dimensions:
      "Nominal 2x6 or 2x8 widths to match the wall, in long lengths with staggered joints.",
    installSequence: [
      "Check the wall top for level, and shim or grout as needed.",
      "Roll out the sill sealer on the concrete.",
      "Drill and set the treated plate over the anchor bolts.",
      "Add washers and nuts; tighten snugly.",
      "Seal joints and the inside edge as air sealing requires.",
    ],
    fastening: "Anchor bolts with plate washers and nuts per engineering; sealer is compressed, not fastened.",
    compatible: [
      "Foam sill sealer or gasket",
      "Treated lumber with compatible galvanized or stainless hardware",
      "Rim board",
      "Sealant or flashing tape",
    ],
    commonErrors: [
      "Using untreated lumber on concrete.",
      "Using standard steel hardware with modern treated lumber, causing corrosion.",
      "Over-tightening nuts and crushing the sealer.",
      "Gaps from out-of-level concrete.",
      "Cutting bolt holes oversize.",
    ],
    moisture:
      "Concrete wicks moisture; treated lumber and a capillary break protect the wood. Foam sealer must not trap water.",
    thermal:
      "The sill is a major air leakage point if unsealed; combine with rim insulation.",
    coldClimate:
      "Frost heave or settlement may shift the sill, so the foundation design matters. Check the sealer's compression in cold. Concrete corner areas can be cold and condense if humid air reaches them.",
    codeRefs: [
      { ref: "IRC R317.1", note: "Wood in contact with concrete or earth must be naturally durable or preservative-treated (edition-dependent).", confidence: 'LIKELY' },
      { ref: "IRC R403.1.6", note: "Anchorage of sill plates to the foundation.", confidence: 'LIKELY' },
    ],
  },

  'air-seal-details': {
    description:
      "The collection of seals that make the house envelope airtight: sill gasket, taped membrane seams, sealed penetrations, and tape or foam around windows and doors.",
    purpose:
      "Stops warm, humid indoor air from leaking into cold assemblies, where it would condense and cause rot, mold and frost, and reduces heating cost.",
    thickness:
      "Not applicable as a single layer; products are thin tapes, gaskets, caulks and foams.",
    dimensions:
      "Applied at every joint, edge and hole in the envelope; tape widths commonly 2 to 4 in.",
    installSequence: [
      "Plan the air barrier line and who is responsible for each junction.",
      "Seal the sill, rim and foundation joint.",
      "Tape or seal seams in the membrane.",
      "Seal around wires, pipes, ducts and boxes.",
      "Seal window and door rough openings, then test.",
    ],
    fastening: "Adhesive tapes, gaskets, sealant, gaskets and low-expansion foam; mechanical fasteners only to hold membranes in place.",
    compatible: [
      "Sheathing and membrane tapes",
      "Compatible caulks and sealants",
      "Low-expansion window foam",
      "Gaskets and grommets for wires",
    ],
    commonErrors: [
      "Tape on dusty, wet or frosted surfaces so it lets go later.",
      "Using high-expansion foam that bows window frames.",
      "Forgetting attic hatches, chimney and flue chases.",
      "Not sealing electrical boxes.",
      "Tape or sealant used below its minimum temperature.",
    ],
    moisture:
      "Air leakage moves far more moisture than vapor diffusion in most walls, so a continuous air barrier is a main moisture control.",
    thermal:
      "Leakage can account for large heat loss; tighter houses also need controlled ventilation.",
    coldClimate:
      "At -40, stack effect and wind drive heavy air leakage and indoor humid air condenses or frosts inside cold cavities. Many tapes and sealants fail when applied cold, so use cold-rated products and warm surfaces. A blower-door test is the way to verify; tight houses need an HRV.",
    codeRefs: [
      { ref: "IECC R402.4", note: "Air leakage provisions: building envelope must be sealed, with a list of required sealing locations (edition-dependent).", confidence: 'LIKELY' },
      { ref: "IECC R402.4.1.2", note: "Testing of air leakage with a limit set by climate zone; edition-dependent, and the local jurisdiction may differ.", confidence: 'LIKELY' },
    ],
  },

  'vent-hrv': {
    description:
      "A heat-recovery ventilator that brings in fresh outdoor air and exhausts stale indoor air through a core, recovering heat. It connects to supply and exhaust ducts and two wall hoods.",
    purpose:
      "Provides controlled fresh air in an airtight house and removes humidity, odors and pollutants while keeping heat loss low.",
    thickness:
      "Not applicable. Ducts are commonly 4 to 6 in. round, with the unit mounted indoors, often in a conditioned space.",
    dimensions:
      "Unit size depends on the model and airflow rating; ducts run to rooms and to two exterior hoods spaced apart to prevent re-entry of exhaust air.",
    installSequence: [
      "Have the ventilation rate calculated by a designer or per the adopted code.",
      "Mount the unit with access for filters and a condensate drain.",
      "Run insulated ducts to exterior hoods with a slope or drain as the manufacturer states.",
      "Install supply and exhaust grilles in suitable rooms.",
      "Seal duct joints, connect power, and commission with airflow balancing.",
    ],
    fastening: "Hangers or straps for ducts, duct mastic or approved tape, mounting brackets per the manufacturer; seal wall penetrations.",
    compatible: [
      "Insulated flex or rigid duct",
      "Foil tape and mastic",
      "Wall hoods with backdraft damper",
      "Condensate drain",
    ],
    commonErrors: [
      "Uninsulated ducts in cold space that sweat and freeze.",
      "Intake and exhaust hoods too close together.",
      "Unbalanced airflow that pressurizes or depressurizes the house.",
      "Skipping filter maintenance.",
      "Not providing a condensate drain or frost-protection strategy for the unit.",
    ],
    moisture:
      "Removes indoor moisture, but the core can freeze at very cold outdoor temperatures. Use a defrost strategy as the unit provides, and drain condensate properly.",
    thermal:
      "Efficiency varies by model, so use certified data. Cold climates need units rated for low-temperature operation.",
    coldClimate:
      "Core frost at -40 is a real design issue; choose a unit rated for the lowest design temperature, with defrost control or preheat, and insulate ducts. Hoods can ice over, so make sure they stay clear of snow drifts and have the right height. Verify performance claims with the manufacturer.",
    codeRefs: [
      { ref: "IRC M1507 / R303.4", note: "Whole-house mechanical ventilation requirements; section and applicability are edition-dependent.", confidence: 'LIKELY' },
      { ref: "IECC R403.6", note: "Mechanical ventilation system requirements, with efficiency and fan rules (edition-dependent).", confidence: 'LIKELY' },
    ],
  },

  'fin-trim': {
    description:
      "Boards or composite pieces at corners, window and door openings, and rakes that finish the wall and cover edges of siding.",
    purpose:
      "Protects siding ends and openings from water, hides gaps and gives the building its finished look.",
    thickness:
      "Commonly 3/4 in. (about 19 mm) nominal 1x or 5/4 stock; composite thickness varies by product.",
    dimensions:
      "Widths commonly 3-1/2 to 5-1/2 in. (1x4 to 1x6) for casing and corner boards, in 8 to 16 ft lengths.",
    installSequence: [
      "Make sure window and door flashing is in place.",
      "Prime or seal all cut ends and back faces.",
      "Install corner boards and casing plumb and square.",
      "Leave a small gap and sealant at siding joints.",
      "Caulk, paint or finish as required.",
    ],
    fastening: "Corrosion-resistant finish nails or trim screws into framing; stainless or hot-dip galvanized recommended, with spacing as the maker specifies.",
    compatible: [
      "Wood, fiber cement or composite siding",
      "Flashing tapes and head flashing",
      "Sealants rated for exterior use",
      "Exterior paint or stain",
    ],
    commonErrors: [
      "Leaving cut ends unprimed, so they absorb water.",
      "Trim sitting on the ground or in snow with no clearance.",
      "Missing head flashing above openings.",
      "Rigid caulk that cracks in thermal movement.",
      "Fasteners that stain or corrode.",
    ],
    moisture:
      "Trim is a common water-entry point. Slope horizontal surfaces, flash tops, and keep ends sealed.",
    thermal:
      "Negligible. A thick trim over thick exterior insulation may need extension jambs; detail early.",
    coldClimate:
      "Wood expands and contracts across a very wide temperature range, so use flexible sealants rated for low temperatures. Snow piled against trim promotes rot, so keep clearance above the grade. Paint and caulk should not be applied below the manufacturer's minimum temperature.",
    codeRefs: [
      { ref: "IRC R703", note: "Exterior covering requirements, including flashing and weather protection (edition-dependent).", confidence: 'LIKELY' },
      { ref: "IRC R703.4", note: "Flashing at openings and wall details (numbering varies by edition).", confidence: 'LIKELY' },
    ],
  },

  'fin-soffit-fascia': {
    description:
      "Vented soffit panels under the eave, the fascia board at the roof edge, and metal drip edge that guides water off the roof.",
    purpose:
      "Soffit lets intake air into the roof ventilation path, fascia caps the rafter ends and supports gutters, and drip edge protects the roof edge.",
    thickness:
      "Fascia commonly 1x or 5/4 board (about 3/4 to 1 in.); soffit panels are thin vinyl, aluminum or plywood; drip edge is thin metal.",
    dimensions:
      "Soffit widths vary with the overhang (for example 12 to 24 in.); fascia boards commonly 1x6 to 1x8; drip edge flange a few inches wide.",
    installSequence: [
      "Install rafter blocking and baffles so insulation does not block the air channel.",
      "Fasten drip edge and roof underlayment in the correct order for the roof type.",
      "Install the fascia board.",
      "Install soffit panels with the specified vent area.",
      "Check that vents remain clear.",
    ],
    fastening: "Corrosion-resistant nails or screws; drip edge nailed along its top flange as the manufacturer or code states.",
    compatible: [
      "Metal roofing and drip edge",
      "Baffles and rafter vents",
      "Gutters or snow guards (if used)",
      "Treated or primed wood",
    ],
    commonErrors: [
      "Insulation blocking the air path from soffit to ridge.",
      "Drip edge in the wrong lap order with underlayment.",
      "Insufficient vent area.",
      "Unprimed fascia that rots behind gutters.",
      "Soffit panels not allowed to expand and contract.",
    ],
    moisture:
      "Venting carries moist air out of the roof assembly; a clogged soffit can cause frost and ice build-up in the cold roof.",
    thermal:
      "Eaves are a key location for ice dams. A well-insulated, air-sealed ceiling reduces heat leaking to the roof deck.",
    coldClimate:
      "Snow drifts and frost can block soffit vents, so keep them above likely snow depth. Heat leaks to the roof deck cause ice dams in Interior Alaska winters. Air sealing and insulation continuity at the eave are important, as is a cold vented roof design. Check what the roof manufacturer allows.",
    codeRefs: [
      { ref: "IRC R806.1 / R806.2", note: "Attic and rafter space ventilation and minimum net free vent area (edition-dependent).", confidence: 'LIKELY' },
      { ref: "IRC R905.2.8.5", note: "Drip edge provisions for asphalt shingles; metal roofing is covered by R905.10 and the maker (edition-dependent).", confidence: 'UNVERIFIED' },
    ],
  },

  'fin-gutters': {
    description:
      "Gutters and downspouts that collect roof water and carry it away from the house. In this model they are optional, and many Interior Alaska homes go without them.",
    purpose:
      "Controls roof runoff to protect siding, foundation and walkways.",
    thickness:
      "Aluminum or steel, thin gauge; downspouts commonly 2x3 in. or 3x4 in. rectangular, or round.",
    dimensions:
      "Common K-style gutters are about 5 or 6 in. wide; downspouts sized to roof area. Verify the sizing with the supplier.",
    installSequence: [
      "Decide whether gutters are right for the roof and snow load.",
      "Mark a slight slope toward downspouts.",
      "Fasten hangers into rafter tails or fascia.",
      "Install the gutter sections with sealed seams, end caps and outlets.",
      "Attach downspouts and extend discharge away from the foundation.",
    ],
    fastening: "Hidden hangers or spikes and ferrules into framing at the maker's spacing; screws into fascia with corrosion-resistant coating.",
    compatible: [
      "Fascia boards",
      "Metal roofing and drip edge",
      "Heat cable (if rated)",
      "Splash blocks or drains",
    ],
    commonErrors: [
      "Installing gutters below a sliding snow load without snow guards.",
      "Ice build-up pulling gutters off.",
      "Too little slope, causing standing water and ice.",
      "Discharging at the foundation.",
      "Heat tape not rated for the application, or installed incorrectly.",
    ],
    moisture:
      "Controls roof water. Poor drainage can soak fascia and the foundation area, increasing frost heave risk.",
    thermal:
      "None directly, but ice dams and icicles show heat loss at the eave.",
    coldClimate:
      "Gutters ice up and can tear off with sliding snow in Interior Alaska, and spring melt may flow while the downspouts are still frozen. Options include heat cable (energy cost and fire safety to check), no-gutter designs with wide overhangs and good grading, or drip-line gravel and drains. Choose a design based on roof type, snow load and local advice.",
    codeRefs: [
      { ref: "IRC R801.3", note: "Roof drainage: gutters are required only in some conditions, with discharge away from the foundation (edition-dependent).", confidence: 'LIKELY' },
    ],
  },

  'fin-ridge-vent': {
    description:
      "A continuous vent at the roof peak that lets warm, moist air escape from the cold vented roof space, working with soffit intake vents.",
    purpose:
      "Provides the exhaust half of roof ventilation to remove moisture and equalize the roof deck temperature, reducing frost and ice dams.",
    thickness:
      "A low-profile ridge cap with a gap in the deck; vent opening commonly about 1 to 2 in. each side of the ridge. Follow the manufacturer.",
    dimensions:
      "Runs the full ridge length, less any manufacturer-specified end distance; net free area per foot of length is a product data point.",
    installSequence: [
      "Calculate the required net free vent area.",
      "Cut the opening at the ridge per the manufacturer and structural guidance.",
      "Install underlayment and any baffle or filter material.",
      "Fit the metal ridge vent and cap.",
      "Seal and fasten with the supplied fasteners and closures.",
    ],
    fastening: "Screws with sealing washers or the manufacturer's clips into the framing or deck; fasteners at the roofing maker's schedule.",
    compatible: [
      "Metal roofing panels",
      "Vented closure strips",
      "Eave soffit vents",
      "Baffles for the insulation",
    ],
    commonErrors: [
      "No soffit intake, which makes the ridge useless or wrong-way.",
      "Cutting too much of the structure or ridge board.",
      "Blowing snow can enter if the design has no baffle.",
      "Mixing ridge vents with other exhaust vents that short-circuit the flow.",
      "Missing or crushed closure strips.",
    ],
    moisture:
      "Carries moisture out of the roof, but wind-driven snow can enter if poorly detailed.",
    thermal:
      "Keeping the roof deck cold avoids melt and refreeze at eaves, when combined with high insulation and air sealing below.",
    coldClimate:
      "Fine snow can blow through ridge vents in Interior Alaska, and frost may close the openings. Use a vent product with snow-resistant baffles, and make sure the ceiling is airtight so the vent is not overloaded with warm moist air. Some designs prefer unvented roofs; that choice needs an engineered approach.",
    codeRefs: [
      { ref: "IRC R806.1", note: "Enclosed attics and rafter spaces must have cross ventilation, with minimum net free area (edition-dependent).", confidence: 'LIKELY' },
      { ref: "IRC R806.5", note: "Unvented attic and rafter spaces: alternative to venting, with specific conditions (edition-dependent).", confidence: 'LIKELY' },
    ],
  },

  'fin-vent-terminals': {
    description:
      "Roof and wall penetrations to the outdoors: the plumbing vent stack with its flashing boot, the bath fan and HRV wall terminals.",
    purpose:
      "Let plumbing drains breathe, exhaust bath moisture, and bring HRV air in and out while keeping rain and snow out.",
    thickness:
      "Not applicable. Plumbing vents commonly use 2 to 3 in. pipe; duct sizes depend on fan and HRV airflow.",
    dimensions:
      "Stack must rise above the roof surface by the required minimum, set by the plumbing code and snow depth; wall hoods mounted at a height and spacing set by the code and manufacturer.",
    installSequence: [
      "Locate penetrations away from valleys and obstructions.",
      "Install the flashing boot, lapped correctly with the roofing.",
      "Run and insulate the vent stack through the cold space.",
      "Seal duct and pipe penetrations at the air barrier.",
      "Install wall terminals with dampers and sealing flange.",
    ],
    fastening: "Boot flange fastened and sealed per the roofing maker; pipe supported by straps; hoods screwed with sealant behind the flange.",
    compatible: [
      "Metal roof boots rated for the profile",
      "Insulated ductwork",
      "Foil tape and sealants",
      "Frost-resistant terminal caps",
    ],
    commonErrors: [
      "Uninsulated vent stack where moist air freezes and closes the opening.",
      "Exhaust and intake too close, or exhaust too near a window.",
      "Rubber boots that crack in extreme cold.",
      "Stack too low and buried in drifted snow.",
      "Unsealed ducts that drip condensate into insulation.",
    ],
    moisture:
      "Warm moist air condenses on cold pipe and duct surfaces. Slope ducts, add condensate protection and insulate them.",
    thermal:
      "Penetrations leak air and heat if unsealed; insulate pipes and ducts in cold spaces.",
    coldClimate:
      "Plumbing vents can frost shut in severe cold, so larger pipe sizes near the roof or an insulated stack may be needed; confirm the local plumbing code. Wall terminals can clog with frost or snow, so keep them above the drift line. Choose cold-rated boot materials and verify with the manufacturer.",
    codeRefs: [
      { ref: "IRC P3103", note: "Vent termination: vent extension above the roof and frost-closure provisions (edition-dependent; check the adopted plumbing code).", confidence: 'LIKELY' },
      { ref: "IRC M1501 / M1506", note: "Exhaust ducts must discharge to the outdoors, with termination spacing rules (edition-dependent).", confidence: 'LIKELY' },
    ],
  },

  'fin-snow-guards': {
    description:
      "Clamp-on or bolted bars, pads or fences fixed on the metal roof to hold the snow and release it slowly.",
    purpose:
      "Prevents sudden snow slides that can injure people, damage vehicles, gutters, vents and the roof itself.",
    thickness:
      "Not applicable; guards are small metal or polymer pieces. Height is product-specific.",
    dimensions:
      "Installed in rows above eaves and doors, with spacing based on roof pitch and snow load; consult the guard maker's layout tables.",
    installSequence: [
      "Identify areas where sliding snow is hazardous.",
      "Get a layout from the snow guard maker or an engineer for the snow load.",
      "Mark positions on the seams or panel ribs.",
      "Install clamps, pads or fasteners to the maker's torque and sealing instructions.",
      "Check for tight clamps after the first season.",
    ],
    fastening: "Clamps on standing seams with set screws (no roof penetrations), or fasteners with sealant on exposed-fastener panels; follow the manufacturer's schedule.",
    compatible: [
      "Standing-seam metal roofing (clamp type)",
      "Exposed-fastener panels (screw-on type)",
      "Matching or coated finish",
      "Approved sealants",
    ],
    commonErrors: [
      "Too few rows for the actual snow load.",
      "Clamps over-tightened, marring the seam, or left loose.",
      "Using the wrong type of guard for the panel profile.",
      "Dissimilar metals that corrode.",
      "Forgetting that the retained snow load goes into the roof structure.",
    ],
    moisture:
      "Held snow melts slowly, so water control and sealing of roof edges matter; ice may form behind the guards.",
    thermal:
      "Not directly. Retained snow may insulate the roof deck and can alter melt patterns.",
    coldClimate:
      "Roofs in Interior Alaska carry heavy snow for months, and snow guards keep the load on the roof, so the structure must be designed for the ground snow load as set by the local official. Large releases in spring can overwhelm guards, and the layout should come from a professional. Install clamps carefully in cold, when metal is stiff.",
    codeRefs: [
      { ref: "IRC R301.2(1)", note: "Climatic design criteria including ground snow load, set by the local jurisdiction.", confidence: 'LIKELY' },
      { ref: "IRC R905.10", note: "Metal roof panel installation requirements; snow retention is generally per manufacturer and engineer (edition-dependent).", confidence: 'UNVERIFIED' },
    ],
  },
};
