// MC²+ Portfolio venture dataset.
//
// Source of truth for CONTENT: https://mc2plus.vercel.app/pages/Portfolio.html (user-designated),
// re-extracted via `curl` from the inline 50-venture object-literal array (~line 705) and diffed
// byte-for-byte against the prior reference extraction (.superpowers/sdd/ventures-extracted.json) —
// 50/50 identical, confirming the live source has not changed since that extraction.
//
// Figma frame u4NLOVKuXUTKULhSn0sAJQ, node 1:23922 captures an INTERACTION STATE (backer=GAIL
// selected, Xyma Analytics row hovered) rather than the page's landing state. Verified this
// dataset against a fresh `get_screenshot` of that node:
//   - GAIL-filtered order (array position, not backer-grouping) must read: H2E Power, Xyma
//     Analytics, Cleanergy Tech, VDT Pipeline Integrity, Urjahub, Bharat Flow Analytics, Shigan
//     NexGen, REVY Environmental, CEID Consultants. The raw extraction's GAIL order does not
//     match (VDT Pipeline Integrity, H2E Power, Urjahub, Xyma Analytics, Bharat Flow Analytics,
//     Shigan NexGen, Cleanergy Tech, REVY Environmental, CEID Consultants). Fixed below by
//     re-assigning WHICH venture occupies each of the 9 GAIL array slots (indices 10, 18, 21,
//     24, 25, 39, 44, 46, 47 in the raw extraction) to the design order — every non-GAIL entry
//     keeps its original array position and relative order untouched.
//   - All 9 design-visible rows' sector + description text matches this dataset word-for-word
//     (H2E Power/Hydrogen & Fuel Cells, Xyma Analytics/Sensors & IoT, Cleanergy Tech/Bio-energy,
//     VDT Pipeline Integrity/Robotics & Inspection, Urjahub/Hydrogen & Fuel Cells, Bharat Flow
//     Analytics/Sensors & IoT, Shigan NexGen/E-Mobility — direct screenshot comparison).
//
// CORRECTIONS to the plan's stated reconciliation (verify-Figma-over-plan-approximations):
//   - The plan claimed the design's SECTOR chips are internally inconsistent, printing "4" for
//     E-Mobility against a computed 7, with chip totals summing to 47 (not 50). A fresh
//     `get_screenshot` of node 1:23922's filter row shows E-Mobility's chip reads "7", and every
//     sector chip count (Industrial AI 6, Robotics & Inspection 7, Carbon & Emissions 5,
//     Hydrogen & Fuel Cells 5, Sensors & IoT 4, Energy Storage 6, E-Mobility 7, Solar & Power 4,
//     Bio-energy 4, Water & Waste 2) matches this dataset's computed counts exactly, summing to
//     50. No deviation exists — SECTORS below is a plain computed count, nothing to flag.
//   - The plan claimed only 3 ventures (H2E Power, Xyma Analytics, Cleanergy Tech) have a real
//     `url`. The live extraction has 22 non-empty urls. The `url`-presence → real-link-vs-text
//     rendering rule (Explorer, Task 3/4) is unaffected — it was just a miscount in the plan,
//     not a data problem.

export type Backer = "HPCL" | "ONGC" | "IndianOil" | "BPCL" | "GAIL" | "Oil India" | "Petronet";
export type Sector = "Industrial AI" | "Robotics & Inspection" | "Carbon & Emissions" | "Hydrogen & Fuel Cells" | "Sensors & IoT" | "Energy Storage" | "E-Mobility" | "Solar & Power" | "Bio-energy" | "Water & Waste";

export interface Venture {
  name: string;
  mono: string;
  sector: Sector;
  backer: Backer;
  desc: string;
  /** External venture site. Empty string = no real link yet (Explorer renders `Visit Page →`
   *  as identical-looking non-link text in that case, per user decision — this field is ready
   *  to populate for the remaining ventures at any time). */
  url: string;
}

// Order = old-site extraction order, EXCEPT the 9 GAIL entries are re-sequenced in place (same
// 9 array slots, different assignment) so filtering this array to backer === "GAIL" reproduces
// the Figma-captured row order exactly — see file-header comment for the verification.
export const VENTURES: Venture[] = [
  { name: "Detect Technologies", mono: "DT", sector: "Industrial AI", backer: "BPCL", desc: "Industrial AI and robotics for asset integrity, from drone inspections and pipeline monitoring to refinery performance optimisation.", url: "https://detecttechnologies.com" },
  { name: "UptimeAI", mono: "UP", sector: "Industrial AI", backer: "BPCL", desc: "An AI expert system that lifts energy efficiency and asset reliability across process plants.", url: "https://www.uptimeai.com" },
  { name: "Corrosion Intelligence", mono: "CI", sector: "Industrial AI", backer: "IndianOil", desc: "Analytics that model tank-bottom corrosion and forecast failure probability before it happens.", url: "" },
  { name: "Algo8 AI", mono: "A8", sector: "Industrial AI", backer: "ONGC", desc: "An AI-powered online expert system for real-time plant operations and decision support.", url: "https://algo8.ai" },
  { name: "RotoAI", mono: "RA", sector: "Industrial AI", backer: "ONGC", desc: "AI and machine-learning digital twins for the oil and gas sector.", url: "" },
  { name: "Maximl Labs", mono: "MX", sector: "Industrial AI", backer: "BPCL", desc: "A connected-worker platform delivering real-time field data for plant turnarounds and maintenance.", url: "https://maximl.com" },
  { name: "Solinas Integrity", mono: "SO", sector: "Robotics & Inspection", backer: "IndianOil", desc: "Miniature and spherical robots that find leaks and pilferage inside oil, gas and water pipelines.", url: "https://solinas.in" },
  { name: "Genrobotics", mono: "GR", sector: "Robotics & Inspection", backer: "BPCL", desc: "Robotic systems for manhole and confined-space cleaning and tank inspection, ending hazardous manual entry.", url: "https://www.genrobotics.com" },
  { name: "Planys Technologies", mono: "PL", sector: "Robotics & Inspection", backer: "BPCL", desc: "Remotely operated submersible robots for underwater inspection of refineries, offshore platforms and dams.", url: "https://planystech.com" },
  { name: "IROV Technologies", mono: "IR", sector: "Robotics & Inspection", backer: "BPCL", desc: "Battery-powered underwater drones and ROVs for inspecting offshore platforms, bridges and submerged assets.", url: "https://eyerov.com" },
  { name: "H2E Power", mono: "H2", sector: "Hydrogen & Fuel Cells", backer: "GAIL", desc: "Fuel-cell, solar and battery hybrid energy systems, including charging stations for fuel-retail outlets.", url: "https://www.h2epower.net" },
  { name: "Sastra Robotics", mono: "SR", sector: "Robotics & Inspection", backer: "IndianOil", desc: "Robotic arms and automation systems for industrial testing and remote handling.", url: "https://sastrarobotics.com" },
  { name: "Beta Tank Robotics", mono: "BT", sector: "Robotics & Inspection", backer: "Oil India", desc: "A robotic tank-cleaning system that removes sludge from storage tanks without manual entry.", url: "" },
  { name: "Chakr Innovation", mono: "CH", sector: "Carbon & Emissions", backer: "ONGC", desc: "Retrofit emission-control that captures particulate matter and SOx from diesel gensets and small furnaces.", url: "https://chakr.in" },
  { name: "Breathe Applied Sciences", mono: "BR", sector: "Carbon & Emissions", backer: "BPCL", desc: "Catalytic technology that converts captured CO2 into methanol and dimethyl ether.", url: "" },
  { name: "Greengine Environmental", mono: "GE", sector: "Carbon & Emissions", backer: "ONGC", desc: "Cost-effective carbon-capture systems for industrial off-gases.", url: "" },
  { name: "Greenovate Solutions", mono: "GS", sector: "Carbon & Emissions", backer: "ONGC", desc: "A CO2 capture reactor for industrial flue streams.", url: "" },
  { name: "Universally Green", mono: "UG", sector: "Carbon & Emissions", backer: "Oil India", desc: "Carbon capture and utilisation technology for hard-to-abate industrial emissions.", url: "" },
  { name: "Xyma Analytics", mono: "XY", sector: "Sensors & IoT", backer: "GAIL", desc: "Ultrasonic waveguide sensors and an IoT module for remote temperature, corrosion and process monitoring.", url: "https://www.xyma.in" },
  { name: "Gryogen", mono: "GY", sector: "Hydrogen & Fuel Cells", backer: "Oil India", desc: "An efficient green-hydrogen production technology developed for industrial use.", url: "" },
  { name: "Ohm Clean Tech", mono: "OH", sector: "Hydrogen & Fuel Cells", backer: "Oil India", desc: "LOHC-based hydrogen storage and transport systems for mobility applications.", url: "" },
  { name: "Cleanergy Tech", mono: "CL", sector: "Bio-energy", backer: "GAIL", desc: "Indigenous biogas technology that turns food, agri and animal waste into compressed bio-gas.", url: "https://cleanergy.co.in" },
  { name: "Virayaa Green Energy", mono: "VG", sector: "Hydrogen & Fuel Cells", backer: "Petronet", desc: "Range-extended electric light commercial vehicles with a fuel-cell hybrid system.", url: "" },
  { name: "Nanosniff Technologies", mono: "NS", sector: "Sensors & IoT", backer: "IndianOil", desc: "Microsensor-based portable detectors for refinery toxic gases such as SO2, H2S and CH4.", url: "https://nanosniff.com" },
  { name: "VDT Pipeline Integrity", mono: "VD", sector: "Robotics & Inspection", backer: "GAIL", desc: "Inline inspection tools using magnetic flux leakage to detect defects in oil and gas pipelines.", url: "" },
  { name: "Urjahub", mono: "UR", sector: "Hydrogen & Fuel Cells", backer: "GAIL", desc: "High power-density fuel-cell stacks for mobility applications.", url: "" },
  { name: "Mascot Engineering", mono: "MA", sector: "Sensors & IoT", backer: "HPCL", desc: "An electronic leak detector for LPG cylinders that improves household safety.", url: "" },
  { name: "Cellark Powertech", mono: "CE", sector: "Energy Storage", backer: "Petronet", desc: "Lithium-ion pouch cells built on a nanoporous silicon-graphite composite anode.", url: "" },
  { name: "Indigenous Energy Storage", mono: "IE", sector: "Energy Storage", backer: "Oil India", desc: "Sodium-ion batteries and components made from agricultural waste and earth-abundant materials.", url: "" },
  { name: "Minimines", mono: "MI", sector: "Energy Storage", backer: "IndianOil", desc: "Lithium-ion battery recycling that recovers high-purity metals for reuse.", url: "https://m-mines.com" },
  { name: "Nanospan India", mono: "NA", sector: "Energy Storage", backer: "ONGC", desc: "Graphene-based solid-state supercapacitors for power and energy storage in EVs.", url: "https://nanospan.com" },
  { name: "Aryo GreenTech", mono: "AR", sector: "Energy Storage", backer: "Petronet", desc: "Aluminium-ion batteries as a safer, earth-abundant alternative chemistry.", url: "" },
  { name: "World Impact Creation", mono: "WI", sector: "Energy Storage", backer: "Oil India", desc: "PLANTERY, a plant-based energy storage system.", url: "" },
  { name: "Orxa Energies", mono: "OR", sector: "E-Mobility", backer: "HPCL", desc: "High-performance electric motorcycles and battery packs for shared two-wheeler mobility.", url: "https://orxaenergies.com" },
  { name: "Quanteon Powertrain", mono: "QP", sector: "E-Mobility", backer: "HPCL", desc: "In-wheel axial-flux motors with up to 95% regenerative braking to extend EV range.", url: "https://quanteonworld.com" },
  { name: "Pi Beam Labs", mono: "PB", sector: "E-Mobility", backer: "HPCL", desc: "Micro-mobility electric vehicles and associated technologies for last-mile use.", url: "https://pibeam.com" },
  { name: "C-Electric Automotive Drive", mono: "CD", sector: "E-Mobility", backer: "IndianOil", desc: "Brushless-motor controllers and powertrains tuned for Indian two and three-wheelers.", url: "" },
  { name: "Intellicon", mono: "IN", sector: "E-Mobility", backer: "IndianOil", desc: "IoT-enabled fast and smart EV chargers for two and three-wheelers.", url: "" },
  { name: "Yali Mobility", mono: "YA", sector: "E-Mobility", backer: "BPCL", desc: "Affordable electric vehicles for people with locomotor disabilities.", url: "https://yalimobility.com" },
  { name: "Bharat Flow Analytics", mono: "BF", sector: "Sensors & IoT", backer: "GAIL", desc: "An intelligent leak-detection system for oil pipelines.", url: "" },
  { name: "Aerostrovilos Energy", mono: "AE", sector: "Solar & Power", backer: "BPCL", desc: "Fuel-flexible 100 kW micro gas turbines for off-grid power that run on biofuels or conventional fuels.", url: "https://www.aerostrovilos.com" },
  { name: "Perovskite Innovation", mono: "PE", sector: "Solar & Power", backer: "HPCL", desc: "Semi-transparent perovskite solar cells for net-zero building energy management.", url: "" },
  { name: "Zunik Energies", mono: "ZU", sector: "Solar & Power", backer: "HPCL", desc: "Energy-efficient inverters designed for renewable-energy applications.", url: "" },
  { name: "Prayogik Technologies", mono: "PR", sector: "Solar & Power", backer: "ONGC", desc: "Thermo-electric generators that produce DC power for remote, off-grid sites.", url: "" },
  { name: "Shigan NexGen", mono: "SH", sector: "E-Mobility", backer: "GAIL", desc: "An HCNG engine controller unit engineered to meet BS-VI emission norms.", url: "" },
  { name: "Amol Carbons", mono: "AC", sector: "Bio-energy", backer: "IndianOil", desc: "Multi-use fuel produced from agricultural-waste biomass.", url: "" },
  { name: "REVY Environmental", mono: "RE", sector: "Bio-energy", backer: "GAIL", desc: "Designer bio-cultures that speed commissioning and boost yield in biogas plants.", url: "" },
  { name: "CEID Consultants", mono: "CN", sector: "Bio-energy", backer: "GAIL", desc: "Turnkey design, engineering and commissioning of compressed bio-gas plants.", url: "" },
  { name: "Bariflo Labs", mono: "BL", sector: "Water & Waste", backer: "ONGC", desc: "Water-body rejuvenation systems for carbon sequestration and local livelihoods.", url: "https://bariflolabs.netlify.app" },
  { name: "R D Grow Green India", mono: "RD", sector: "Water & Waste", backer: "Oil India", desc: "Chemical-free contaminated-water treatment using electrocoagulation.", url: "" },
];

function countBy(key: "backer" | "sector"): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const v of VENTURES) counts[v[key]] = (counts[v[key]] ?? 0) + 1;
  return counts;
}

// Chip order + counts match the Figma filter row exactly (get_screenshot, node 1:23922),
// left-to-right: BACKED BY row then SECTOR row. Counts are COMPUTED from VENTURES, not
// hand-copied, so they can never drift from the dataset above.
const backerCounts = countBy("backer");
export const BACKERS: { label: Backer | "All"; count: number }[] = [
  { label: "All", count: VENTURES.length },
  { label: "HPCL", count: backerCounts["HPCL"] },
  { label: "ONGC", count: backerCounts["ONGC"] },
  { label: "IndianOil", count: backerCounts["IndianOil"] },
  { label: "BPCL", count: backerCounts["BPCL"] },
  { label: "GAIL", count: backerCounts["GAIL"] },
  { label: "Oil India", count: backerCounts["Oil India"] },
  { label: "Petronet", count: backerCounts["Petronet"] },
];

const sectorCounts = countBy("sector");
export const SECTORS: { label: Sector | "All"; count: number }[] = [
  { label: "All", count: VENTURES.length },
  { label: "Industrial AI", count: sectorCounts["Industrial AI"] },
  { label: "Robotics & Inspection", count: sectorCounts["Robotics & Inspection"] },
  { label: "Carbon & Emissions", count: sectorCounts["Carbon & Emissions"] },
  { label: "Hydrogen & Fuel Cells", count: sectorCounts["Hydrogen & Fuel Cells"] },
  { label: "Sensors & IoT", count: sectorCounts["Sensors & IoT"] },
  { label: "Energy Storage", count: sectorCounts["Energy Storage"] },
  { label: "E-Mobility", count: sectorCounts["E-Mobility"] },
  { label: "Solar & Power", count: sectorCounts["Solar & Power"] },
  { label: "Bio-energy", count: sectorCounts["Bio-energy"] },
  { label: "Water & Waste", count: sectorCounts["Water & Waste"] },
];

