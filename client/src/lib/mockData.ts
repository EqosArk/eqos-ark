import type { Animal, CareTeamMember, Record } from "@shared/schema";

// ─────────────────────────────────────────────────────────────────────────────
// ANIMALS
// ─────────────────────────────────────────────────────────────────────────────

export const mockAnimals: Animal[] = [
  // ── EPS Sport Horses ────────────────────────────────────────────────────────
  {
    id: "colorado-z",
    name: "Colorado Z",
    species: "Equine",
    breed: "Zangersheide",
    sex: "Gelding",
    dob: "2016-06-22",
    color: "Grey",
    microchip: "056 110 8831 4471",
    ownerId: "demo-owner-eps",
    openingSummary: "Colorado Z",
    reasonForVisit: "Routine autumn maintenance evaluation — hock joint assessment and pre-season conditioning check.",
    recentHistory: "Annual wellness exam May 28, 2026 — all findings within normal limits. Vaccinations and Coggins current. Dental float completed March 2026. Spring bloodwork WNL. Competing actively at 1.30m level — no performance concerns.",
    clinicalBackground: "10-year-old grey Zangersheide gelding. Accomplished 1.30m competitor. Bilateral hock maintenance injections performed annually since 2023 — good response. No history of significant lameness or surgical intervention. Prior primary care at Westfield Equine Clinic (Dr. Amara Osei, 2019–2022).",
    patientStatus: "stable",
    activeConditions: JSON.stringify([
      "Bilateral hock joint maintenance — annual protocol",
    ]),
    activeMedications: JSON.stringify([
      "Joint support supplement (MSM/Glucosamine) — daily",
      "Omega-3 supplement — daily",
    ]),
    nextScheduledCare: JSON.stringify([
      "Hock maintenance injections — late August — Dr. Marsh",
      "Annual foot radiograph survey — autumn",
      "Coggins renewal — due November 2026",
    ]),
    primaryVet: "Dr. Eleanor Marsh, DVM",
    barn: "EPS Sport Horses",
    discipline: "Show Jumping",
  },
  {
    id: "sambucca",
    name: "Sambucca",
    species: "Equine",
    breed: "Oldenburg",
    sex: "Mare",
    dob: "2019-02-14",
    color: "Bay",
    microchip: "276 002 9914 6638",
    ownerId: "demo-owner-eps",
    openingSummary: "Sambucca",
    reasonForVisit: "Monitoring visit — intermittent right hindlimb stiffness noted during flatwork. Proximal suspensory evaluation scheduled.",
    recentHistory: "Stiffness first observed May 2026 during canter work. Flexion test June 5, 2026 — mild positive response right hind distal limb, borderline positive proximal suspensory region. Diagnostic ultrasound of right hindlimb proximal suspensory ligament scheduled.",
    clinicalBackground: "7-year-old bay Oldenburg mare. Training at 1.10m level with scope for advancement. No prior lameness history. Annual wellness and Coggins current — April 2026. Prior care at Ridgeline Equine Partners (Dr. Fiona Steed, 2019–2024). First year with current primary veterinarian.",
    patientStatus: "monitoring",
    activeConditions: JSON.stringify([
      "Right hindlimb intermittent stiffness — under investigation",
      "Possible proximal suspensory involvement — pending imaging",
    ]),
    activeMedications: JSON.stringify([
      "Anti-inflammatory (as needed, per vet instruction)",
      "Magnesium supplement — daily",
    ]),
    nextScheduledCare: JSON.stringify([
      "Proximal suspensory ultrasound — right hind — late June 2026 — Dr. Marsh",
      "Repeat flexion and lameness evaluation — pending imaging results",
      "Coggins renewal — due April 2027",
    ]),
    primaryVet: "Dr. Eleanor Marsh, DVM",
    barn: "EPS Sport Horses",
    discipline: "Show Jumping",
  },
  // ── EQOS Performance Sport ───────────────────────────────────────────────────
  {
    id: "raloma",
    name: "Raloma",
    species: "Equine",
    breed: "Warmblood",
    sex: "Gelding",
    dob: "2014-03-18",
    color: "Bay",
    microchip: "276 002 3847 1092",
    ownerId: "demo-owner",
    openingSummary: "Raloma",
    reasonForVisit: "Lameness rehabilitation monitoring — return to work progress assessment and pre-imaging check-in.",
    recentHistory: "Soft tissue injury to left forelimb identified autumn 2025. Rehabilitation progressing well — cleared for trot and canter work May 12, 2026 (Dr. Marsh). Jumping restricted pending imaging recheck mid-July. CBC & chemistry panel March 2026 — all values within normal limits.",
    clinicalBackground: "12-year-old bay Warmblood gelding. Active at 1.30m level. History of bilateral foot bone remodeling (2023, managed). Anti-inflammatory therapy ongoing since October 2025. Prior primary care at Greenfield Equine Clinic through 2023; specialist consultation at Tri-State Equine Hospital (Dr. Ng, DACVS) 2022.",
    patientStatus: "monitoring",
    activeConditions: JSON.stringify([
      "Left forelimb soft tissue injury — recovering",
      "Mild bilateral foot bone remodeling — managed",
    ]),
    activeMedications: JSON.stringify([
      "Anti-inflammatory tablet — once daily (ongoing)",
      "Joint support supplement — daily",
      "Musculoskeletal support supplement — daily",
    ]),
    nextScheduledCare: JSON.stringify([
      "Lameness re-evaluation + imaging recheck — mid-July — Dr. Marsh",
      "Routine dental exam — late summer — Dr. Briar",
      "Annual vaccination series — autumn",
    ]),
    primaryVet: "Dr. Eleanor Marsh, DVM",
    barn: "EQOS Performance Sport",
    discipline: "Show Jumping",
  },
  {
    id: "illusive-z",
    name: "Illusive Z",
    species: "Equine",
    breed: "KWPN",
    sex: "Stallion",
    dob: "2018-04-14",
    color: "Dark Bay",
    microchip: "528 210 4002 7831",
    ownerId: "demo-owner",
    openingSummary: "Illusive Z",
    reasonForVisit: "Annual wellness and Coggins — spring vaccines administered. Routine monitoring visit, no presenting complaint.",
    recentHistory: "Wellness exam April 18, 2026 — all findings within normal limits. Coggins negative. EHV, Influenza, Rabies, West Nile vaccines current. Foot radiograph series due before autumn season.",
    clinicalBackground: "8-year-old dark bay KWPN stallion. Active at 1.20m level. No active lameness or medical conditions. Prior sports medicine evaluation at Brennan Equine Sports Medicine (Dr. Brennan, 2021–2023). Omega-3 supplementation ongoing.",
    patientStatus: "stable",
    activeConditions: JSON.stringify([]),
    activeMedications: JSON.stringify([
      "Omega-3 fatty acid supplement — daily",
    ]),
    nextScheduledCare: JSON.stringify([
      "Annual wellness exam + Coggins test — due this month",
      "Foot radiograph series — annual, due autumn",
    ]),
    primaryVet: "Dr. Eleanor Marsh, DVM",
    barn: "EQOS Performance Sport",
    discipline: "Show Jumping",
  },
  {
    id: "independence-vdl",
    name: "Independence VDL",
    species: "Equine",
    breed: "KWPN",
    sex: "Mare",
    dob: "2020-05-09",
    color: "Chestnut",
    microchip: "528 210 5103 9920",
    ownerId: "demo-owner",
    openingSummary: "Independence VDL",
    reasonForVisit: "New patient intake and baseline workup — pre-season evaluation prior to first competition season.",
    recentHistory: "Intake exam completed June 1, 2026. Pre-purchase evaluation WNL reviewed. Baseline radiographs (fore and hind feet) scheduled early July. Coggins and AAEP vaccination series pending. No prior findings of concern.",
    clinicalBackground: "6-year-old chestnut KWPN mare. Development training at 1.00m level. Previously with Stonebridge Equine Clinic (Dr. Hartley, 2021–2025). Dental exam pending — Dr. Briar. Vitamin E and electrolyte supplementation ongoing.",
    patientStatus: "stable",
    activeConditions: JSON.stringify([]),
    activeMedications: JSON.stringify([
      "Vitamin E supplement — daily",
      "Electrolyte support — during training days",
    ]),
    nextScheduledCare: JSON.stringify([
      "Baseline radiograph series — fore and hind feet — early July",
      "Annual wellness exam + Coggins test — July",
      "First vaccination series — August",
    ]),
    primaryVet: "Dr. Eleanor Marsh, DVM",
    barn: "EQOS Performance Sport",
    discipline: "Show Jumping",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CARE TEAM
// ─────────────────────────────────────────────────────────────────────────────

export const mockCareTeam: CareTeamMember[] = [
  // ── Raloma ──────────────────────────────────────────────────────────────
  { id: "ct-1", animalId: "raloma", name: "Dr. Eleanor Marsh", role: "Primary Veterinarian", practice: "Lakeside Equine Practice", phone: "(555) 010-0100", email: "e.marsh@demo-vet.example", lastContact: "2026-05-12", accessLevel: "READ+WRITE" },
  { id: "ct-2", animalId: "raloma", name: "Dr. Thomas Briar", role: "Dental / Routine Care", practice: "Briar Equine Dentistry", phone: "(555) 010-0200", email: "t.briar@demo-dental.example", lastContact: "2026-01-08", accessLevel: "READ+APPEND" },
  { id: "ct-3", animalId: "raloma", name: "Owen Calloway", role: "Farrier", practice: "Calloway Farriery", phone: "(555) 010-0300", email: null, lastContact: "2026-05-28", accessLevel: "READ" },
  { id: "ct-4", animalId: "raloma", name: "Dr. Vivian Cross", role: "Consulting Radiologist", practice: "Clearview Equine Imaging", phone: "(555) 010-0400", email: "v.cross@demo-imaging.example", lastContact: "2025-10-22", accessLevel: "READ+APPEND" },
  { id: "ct-5", animalId: "raloma", name: "Peter Halston", role: "Trainer", practice: "EQOS Performance Sport", phone: "(555) 010-0500", email: "p.halston@demo-barn.example", lastContact: "2026-06-10", accessLevel: "READ" },
  // ── Illusive Z ───────────────────────────────────────────────────────────
  { id: "ct-6", animalId: "illusive-z", name: "Dr. Eleanor Marsh", role: "Primary Veterinarian", practice: "Lakeside Equine Practice", phone: "(555) 010-0100", email: "e.marsh@demo-vet.example", lastContact: "2026-04-18", accessLevel: "READ+WRITE" },
  { id: "ct-7", animalId: "illusive-z", name: "Owen Calloway", role: "Farrier", practice: "Calloway Farriery", phone: "(555) 010-0300", email: null, lastContact: "2026-05-30", accessLevel: "READ" },
  { id: "ct-8", animalId: "illusive-z", name: "Peter Halston", role: "Trainer", practice: "EQOS Performance Sport", phone: "(555) 010-0500", email: "p.halston@demo-barn.example", lastContact: "2026-06-12", accessLevel: "READ" },
  // ── Colorado Z ──────────────────────────────────────────────────────────
  { id: "ct-cz-1", animalId: "colorado-z", name: "Dr. Eleanor Marsh", role: "Primary Veterinarian", practice: "Lakeside Equine Practice", phone: "(555) 010-0100", email: "e.marsh@demo-vet.example", lastContact: "2026-05-28", accessLevel: "READ+WRITE" },
  { id: "ct-cz-2", animalId: "colorado-z", name: "Owen Calloway", role: "Farrier", practice: "Calloway Farriery", phone: "(555) 010-0300", email: null, lastContact: "2026-06-01", accessLevel: "READ" },
  { id: "ct-cz-3", animalId: "colorado-z", name: "Dr. Thomas Briar", role: "Dental / Routine Care", practice: "Briar Equine Dentistry", phone: "(555) 010-0200", email: "t.briar@demo-dental.example", lastContact: "2026-03-12", accessLevel: "READ+APPEND" },
  { id: "ct-cz-4", animalId: "colorado-z", name: "Marcus Ford", role: "Trainer", practice: "EPS Sport Horses", phone: "(555) 010-0600", email: "m.ford@demo-barn.example", lastContact: "2026-06-14", accessLevel: "READ" },
  // ── Sambucca ─────────────────────────────────────────────────────────────
  { id: "ct-sb-1", animalId: "sambucca", name: "Dr. Eleanor Marsh", role: "Primary Veterinarian", practice: "Lakeside Equine Practice", phone: "(555) 010-0100", email: "e.marsh@demo-vet.example", lastContact: "2026-06-05", accessLevel: "READ+WRITE" },
  { id: "ct-sb-2", animalId: "sambucca", name: "Owen Calloway", role: "Farrier", practice: "Calloway Farriery", phone: "(555) 010-0300", email: null, lastContact: "2026-05-20", accessLevel: "READ" },
  { id: "ct-sb-3", animalId: "sambucca", name: "Marcus Ford", role: "Trainer", practice: "EPS Sport Horses", phone: "(555) 010-0600", email: "m.ford@demo-barn.example", lastContact: "2026-06-15", accessLevel: "READ" },
  // ── Independence VDL ───────────────────────────────────────────────────
  { id: "ct-9", animalId: "independence-vdl", name: "Dr. Eleanor Marsh", role: "Primary Veterinarian", practice: "Lakeside Equine Practice", phone: "(555) 010-0100", email: "e.marsh@demo-vet.example", lastContact: "2026-06-01", accessLevel: "READ+WRITE" },
  { id: "ct-10", animalId: "independence-vdl", name: "Owen Calloway", role: "Farrier", practice: "Calloway Farriery", phone: "(555) 010-0300", email: null, lastContact: "2026-06-05", accessLevel: "READ" },
  { id: "ct-11", animalId: "independence-vdl", name: "Peter Halston", role: "Trainer", practice: "EQOS Performance Sport", phone: "(555) 010-0500", email: "p.halston@demo-barn.example", lastContact: "2026-06-11", accessLevel: "READ" },
];

// ─────────────────────────────────────────────────────────────────────────────
// RECORDS — all three horses, current + prior providers
// ─────────────────────────────────────────────────────────────────────────────

export const mockRecords: Record[] = [

  // ══════════════════════════════════════════════════════════════════════════

  // ══════════════════════════════════════════════════════════════════════════
  // COLORADO Z
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "rec-cz-001", animalId: "colorado-z", date: "2026-05-28", season: "Spring 2026",
    type: "vet_note", title: "Annual Wellness Examination", provider: "Dr. Eleanor Marsh",
    practice: "Lakeside Equine Practice", isSignificant: false, isSorted: true,
    summary: "Annual wellness — all findings normal. Vaccinations and Coggins current. Hock maintenance scheduled late summer.",
    content: JSON.stringify({ type: "vet_note", visitDate: "May 28, 2026", visitType: "Annual Wellness Examination", subjective: "Owner reports excellent condition. Competing at 1.30m. No lameness.", objective: "Full exam. BCS 6/9. No lameness. Hocks: mild periarticular thickening bilaterally, stable.", assessment: "Healthy 10-year-old. Hock changes stable. Annual maintenance appropriate.", plan: "Vaccines administered. Coggins — negative. Hock maintenance injections scheduled late August.", provider: "Dr. Eleanor Marsh, DVM", practice: "Lakeside Equine Practice" }),
  },
  {
    id: "rec-cz-002", animalId: "colorado-z", date: "2026-03-12", season: "Spring 2026",
    type: "routine", title: "Dental Examination & Float", provider: "Dr. Thomas Briar",
    practice: "Briar Equine Dentistry", isSignificant: false, isSorted: true,
    summary: "Biannual dental float. Minor hook formation and enamel points addressed. Good equilibrium overall.",
    content: JSON.stringify({ type: "routine", serviceType: "Dental Float", date: "March 12, 2026", nextDue: "September 2026", findings: "Mild hook 106/206. Buccal enamel points upper arcades. Good equilibrium for age.", treatment: "Motorized float all arcades. Hooks resolved. Standard sedation.", provider: "Dr. Thomas Briar, DVM", practice: "Briar Equine Dentistry" }),
  },
  {
    id: "rec-cz-003", animalId: "colorado-z", date: "2025-08-18", season: "Summer 2025",
    type: "vet_note", title: "Bilateral Hock Maintenance Injections", provider: "Dr. Eleanor Marsh",
    practice: "Lakeside Equine Practice", isSignificant: true, isSorted: true,
    summary: "Annual bilateral hock maintenance injections. Excellent response — returned to full competition within three weeks.",
    content: JSON.stringify({ type: "vet_note", visitDate: "August 18, 2025", visitType: "Hock Joint Maintenance", subjective: "Mild resistance to collected canter, consistent with prior seasons.", objective: "Flexion: mild positive bilateral distal hind. No acute effusion.", assessment: "Low-grade bilateral hock discomfort. Annual maintenance appropriate.", plan: "Bilateral distal hock injections under aseptic technique. 72-hour rest, graduated return over 14 days.", provider: "Dr. Eleanor Marsh, DVM", practice: "Lakeside Equine Practice" }),
  },
  {
    id: "rec-cz-prior-1", animalId: "colorado-z", date: "2022-09-10", season: "Autumn 2022",
    type: "vet_note", title: "Annual Wellness — Prior Primary Care", provider: "Dr. Amara Osei",
    practice: "Westfield Equine Clinic", isSignificant: false, isSorted: true,
    summary: "Annual wellness under prior primary care. All findings normal. Competing at 1.20m. Vaccinations current.",
    content: JSON.stringify({ type: "vet_note", visitDate: "September 10, 2022", visitType: "Annual Wellness Examination", subjective: "Six-year-old gelding performing well in early competition career.", objective: "Exam unremarkable. No lameness. Hocks unremarkable.", assessment: "Healthy young competition horse.", plan: "Vaccines. Coggins — negative. Baseline hock radiographs recommended.", provider: "Dr. Amara Osei, DVM", practice: "Westfield Equine Clinic", note: "Prior primary veterinarian" }),
  },
  {
    id: "rec-cz-prior-2", animalId: "colorado-z", date: "2021-06-05", season: "Summer 2021",
    type: "imaging", title: "Hock Radiograph Survey — Baseline", provider: "Dr. Amara Osei",
    practice: "Westfield Equine Clinic", isSignificant: false, isSorted: true,
    summary: "Baseline hock radiograph at five years. Mild early tarsocrural changes bilaterally. Surveillance initiated.",
    content: JSON.stringify({ type: "imaging", studyDate: "June 5, 2021", modality: "Digital Radiography", region: "Bilateral Hocks", indication: "Baseline prior to advancing training", findings: "Mild periarticular modeling at distal tarsal joints bilaterally. No bone spavin or joint space narrowing.", impression: "Mild bilateral distal hock changes. Annual surveillance recommended.", recommendation: "Annual radiographic review. Consider maintenance if clinical signs progress.", radiologist: "Dr. Amara Osei, DVM", practice: "Westfield Equine Clinic" }),
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SAMBUCCA
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "rec-sb-001", animalId: "sambucca", date: "2026-06-05", season: "Spring 2026",
    type: "vet_note", title: "Lameness Evaluation — Right Hindlimb", provider: "Dr. Eleanor Marsh",
    practice: "Lakeside Equine Practice", isSignificant: true, isSorted: true,
    summary: "Intermittent right hindlimb stiffness investigated. Mild positive flexion and borderline proximal suspensory response. Ultrasound scheduled.",
    content: JSON.stringify({ type: "vet_note", visitDate: "June 5, 2026", visitType: "Lameness Evaluation", subjective: "Trainer reports right hindlimb irregularity during canter over past 3 weeks. Occasional stiffness warming up.", objective: "Subtle right hindlimb irregularity at trot. Flexion: mild positive distal hind R>L. Deep palpation: mild sensitivity proximal suspensory right hind. No swelling or heat.", assessment: "Mild right hindlimb lameness. Proximal suspensory desmopathy possible. Imaging required.", plan: "1. Ultrasound right hind proximal suspensory — late June. 2. Restrict jumping, light flatwork only. 3. NSAID as needed. 4. Re-evaluate post-imaging.", provider: "Dr. Eleanor Marsh, DVM", practice: "Lakeside Equine Practice" }),
  },
  {
    id: "rec-sb-002", animalId: "sambucca", date: "2026-04-14", season: "Spring 2026",
    type: "vet_note", title: "Annual Wellness Examination", provider: "Dr. Eleanor Marsh",
    practice: "Lakeside Equine Practice", isSignificant: false, isSorted: true,
    summary: "Annual wellness — all findings normal. Vaccinations and Coggins current. No lameness at time of exam.",
    content: JSON.stringify({ type: "vet_note", visitDate: "April 14, 2026", visitType: "Annual Wellness Examination", subjective: "Owner reports horse healthy. No concerns.", objective: "Exam unremarkable. BCS 5/9. Sound at walk and trot.", assessment: "Healthy 7-year-old mare. All systems normal.", plan: "EHV, Influenza, Rabies, West Nile vaccines. Coggins — negative.", provider: "Dr. Eleanor Marsh, DVM", practice: "Lakeside Equine Practice" }),
  },
  {
    id: "rec-sb-prior-1", animalId: "sambucca", date: "2024-10-02", season: "Autumn 2024",
    type: "vet_note", title: "Annual Wellness — Prior Primary Care", provider: "Dr. Fiona Steed",
    practice: "Ridgeline Equine Partners", isSignificant: false, isSorted: true,
    summary: "Annual wellness under prior primary care. All findings normal. Vaccinations current.",
    content: JSON.stringify({ type: "vet_note", visitDate: "October 2, 2024", visitType: "Annual Wellness", subjective: "Five-year-old mare in training. No health concerns.", objective: "Exam normal. No lameness.", assessment: "Healthy young sport mare.", plan: "Vaccines. Coggins — negative. Records transferred on request.", provider: "Dr. Fiona Steed, DVM", practice: "Ridgeline Equine Partners", note: "Prior primary veterinarian" }),
  },
  {
    id: "rec-sb-prior-2", animalId: "sambucca", date: "2022-03-18", season: "Spring 2022",
    type: "vet_note", title: "Young Horse Pre-Training Examination", provider: "Dr. Fiona Steed",
    practice: "Ridgeline Equine Partners", isSignificant: false, isSorted: true,
    summary: "Three-year-old pre-training exam. All findings normal. First vaccination series. Cleared for initial training.",
    content: JSON.stringify({ type: "vet_note", visitDate: "March 18, 2022", visitType: "Pre-Training Examination", subjective: "Three-year-old Oldenburg mare preparing to begin training.", objective: "Exam normal. No limb deformities. BCS 4.5/9.", assessment: "Healthy young mare cleared for training.", plan: "First AAEP vaccines. Coggins — negative. Dental exam scheduled.", provider: "Dr. Fiona Steed, DVM", practice: "Ridgeline Equine Partners" }),
  },

  // RALOMA
  // ══════════════════════════════════════════════════════════════════════════

  // Unsorted tray
  {
    id: "rec-unsorted-1", animalId: "raloma", date: "2026-06-01", season: "Spring 2026",
    type: "routine", title: "Farrier Visit — Reset", provider: "Owen Calloway",
    practice: "Calloway Farriery", isSignificant: false, isSorted: false,
    summary: "Routine reset, all four feet. Left front showing slightly increased toe wear — noted for vet discussion.",
    content: JSON.stringify({ type: "routine", date: "2026-06-01", nextDue: "2026-07-13", notes: "All four feet reset. Left front showing slightly increased toe wear — noted for discussion with primary vet given current rehabilitation protocol.", provider: "Owen Calloway", practice: "Calloway Farriery" }),
  },

  // Spring 2026
  {
    id: "rec-001", animalId: "raloma", date: "2026-05-12", season: "Spring 2026",
    type: "vet_note", title: "Lameness Re-Evaluation", provider: "Dr. Eleanor Marsh",
    practice: "Lakeside Equine Practice", isSignificant: true, isSorted: true,
    summary: "Follow-up lameness exam — cleared for trot/canter, jumping hold until summer recheck.",
    content: JSON.stringify({ type: "vet_note", visitDate: "May 12, 2026", visitType: "Lameness Re-Evaluation", subjective: "Owner reports horse comfortable in light flatwork. No visible lameness noted at walk or trot under saddle. Attitude alert and willing.", objective: "Gait evaluation at walk and trot — no appreciable lameness detected. Flexion response: mild, improved. Palpation: mild residual thickening, no heat, no pain response.", assessment: "Favorable progression consistent with tissue healing. Imaging recheck recommended prior to return to jumping.", plan: "1. Maintain anti-inflammatory medication once daily. 2. Advance to canter — no jumping until imaging recheck. 3. Reassess mid-summer.", provider: "Dr. Eleanor Marsh, DVM", practice: "Lakeside Equine Practice" }),
  },
  {
    id: "rec-002", animalId: "raloma", date: "2026-03-05", season: "Spring 2026",
    type: "lab", title: "CBC & Chemistry Panel", provider: "Dr. Eleanor Marsh",
    practice: "Lakeside Equine Practice", isSignificant: false, isSorted: true,
    summary: "Pre-return-to-work bloodwork — all values within normal limits.",
    content: JSON.stringify({ type: "lab", collectedDate: "March 5, 2026", lab: "Lakeside Equine In-House Laboratory", panels: [{ name: "Complete Blood Count", results: [{ analyte: "RBC", value: "7.6", unit: "×10⁶/μL", refRange: "6.0–10.0", flag: null }, { analyte: "Hemoglobin", value: "13.5", unit: "g/dL", refRange: "11.0–17.0", flag: null }, { analyte: "WBC", value: "7.1", unit: "×10³/μL", refRange: "5.4–14.3", flag: null }, { analyte: "Platelets", value: "192", unit: "×10³/μL", refRange: "100–350", flag: null }] }, { name: "Chemistry Panel", results: [{ analyte: "AST", value: "298", unit: "U/L", refRange: "185–370", flag: null }, { analyte: "GGT", value: "21", unit: "U/L", refRange: "5–28", flag: null }, { analyte: "Creatinine", value: "1.4", unit: "mg/dL", refRange: "0.9–2.1", flag: null }, { analyte: "Glucose", value: "92", unit: "mg/dL", refRange: "60–110", flag: null }] }], interpretation: "All analytes within normal reference ranges. Results support safe return to graduated exercise.", provider: "Dr. Eleanor Marsh, DVM" }),
  },

  // Early 2026
  {
    id: "rec-003", animalId: "raloma", date: "2026-01-20", season: "Early 2026",
    type: "vet_note", title: "Therapeutic Treatment — Session 4 (Final)", provider: "Dr. Eleanor Marsh",
    practice: "Lakeside Equine Practice", isSignificant: true, isSorted: true,
    summary: "Final therapeutic session completed. Imaging shows favorable tissue response — cleared to begin transition from stall rest.",
    content: JSON.stringify({ type: "vet_note", visitDate: "January 20, 2026", visitType: "Therapeutic Treatment Session 4 (Final) + Imaging Recheck", subjective: "Owner reports horse comfortable at stall rest. No observable lameness during hand-walking. Appetite and attitude normal.", objective: "Final therapeutic session administered. Post-treatment imaging performed — tissue organization improved, echogenicity approaching normal with improved fiber alignment.", assessment: "Favorable response to therapeutic protocol. Prognosis for return to competition: guarded but improving.", plan: "1. Transition from stall rest to 20 min hand-walking daily for 4 weeks. 2. Imaging recheck at 6 weeks. 3. Maintain anti-inflammatory medication.", provider: "Dr. Eleanor Marsh, DVM", practice: "Lakeside Equine Practice" }),
  },

  // Late 2025
  {
    id: "rec-004", animalId: "raloma", date: "2025-10-22", season: "Late 2025",
    type: "imaging", title: "Left Forelimb — Diagnostic Imaging Study", provider: "Dr. Vivian Cross",
    practice: "Clearview Equine Imaging", isSignificant: true, isSorted: true,
    summary: "Soft tissue injury confirmed — moderate fiber disruption. Rehabilitation protocol recommended. Treatment initiated.",
    content: JSON.stringify({ type: "imaging", studyDate: "October 22, 2025", modality: "Diagnostic Ultrasound", region: "Left Forelimb — Soft Tissue Structures", indication: "Acute onset left forelimb lameness following competition", findings: "Proximal structures normal. Area of concern: focal hypoechoic region at mid-section with significant disruption of parallel fiber pattern. No complete tear identified. Periligamentous mild edema noted.", impression: "Moderate soft tissue injury, left forelimb. Consistent with acute fiber disruption. Prognosis for full return: guarded. Recommend structured rehabilitation with serial imaging.", recommendation: "Initiate therapeutic treatment within two weeks. Recheck following final treatment session.", radiologist: "Dr. Vivian Cross, Dipl. ACVR", practice: "Clearview Equine Imaging", referredBy: "Dr. Eleanor Marsh, DVM" }),
  },

  // Spring 2025
  {
    id: "rec-005", animalId: "raloma", date: "2025-04-10", season: "Spring 2025",
    type: "imaging", title: "Bilateral Foot Survey — Annual Radiograph", provider: "Dr. Eleanor Marsh",
    practice: "Lakeside Equine Practice", isSignificant: false, isSorted: true,
    summary: "Annual foot radiograph — mild bone remodeling noted, unchanged from prior year. Management maintained.",
    content: JSON.stringify({ type: "imaging", studyDate: "April 10, 2025", modality: "Digital Radiography", region: "Both Forefeet — Foot Bone Survey", findings: "Mild bone remodeling at flexor cortex bilaterally, stable — no progression from prior study. No cyst formation or canal changes.", impression: "Bilateral mild foot bone changes — stable. Current farriery and management protocol effective.", recommendation: "Continue current management. Repeat surveillance at next annual exam.", radiologist: "Dr. Eleanor Marsh, DVM", views: "DP, LM, PaPr-PaDiO — bilateral" }),
  },

  // Early 2025
  {
    id: "rec-006", animalId: "raloma", date: "2025-01-15", season: "Early 2025",
    type: "routine", title: "Annual Dental Examination & Float", provider: "Dr. Thomas Briar",
    practice: "Briar Equine Dentistry", isSignificant: false, isSorted: true,
    summary: "Routine float completed. Minor enamel irregularities addressed. Next float in twelve months.",
    content: JSON.stringify({ type: "routine", serviceType: "Dental Examination & Float", date: "January 15, 2025", nextDue: "January 2026", findings: "Minor hook formation on upper first cheek teeth. Mild sharp enamel points along outer arcades. No wave mouth detected.", treatment: "Motorized float performed — all arcades. Hooks addressed. Buccal enamel points smoothed bilaterally. Occlusal balance confirmed.", provider: "Dr. Thomas Briar, DVM", practice: "Briar Equine Dentistry" }),
  },

  // ── PRIOR PROVIDERS — Raloma ─────────────────────────────────────────────

  {
    id: "rec-raloma-prior-1", animalId: "raloma", date: "2023-09-14", season: "Autumn 2023",
    type: "vet_note", title: "Annual Wellness Exam", provider: "Dr. Sarah Colton",
    practice: "Greenfield Equine Clinic", isSignificant: false, isSorted: true,
    summary: "Annual wellness exam — all findings within normal limits. Vaccinations administered. Prior primary veterinarian.",
    content: JSON.stringify({ type: "vet_note", visitDate: "September 14, 2023", visitType: "Annual Wellness Examination", subjective: "Owner reports no health concerns. Horse competing actively at 1.20m level.", objective: "Physical exam unremarkable. Body condition 6/9. Cardiovascular and respiratory within normal limits. No lameness detected.", assessment: "Healthy gelding in good athletic condition.", plan: "Vaccinations administered per AAEP protocol. Coggins submitted — negative. Annual dental exam recommended.", provider: "Dr. Sarah Colton, DVM", practice: "Greenfield Equine Clinic", note: "Prior primary veterinarian" }),
  },
  {
    id: "rec-raloma-prior-2", animalId: "raloma", date: "2023-03-20", season: "Spring 2023",
    type: "imaging", title: "Foot Bone Survey — Baseline", provider: "Dr. Sarah Colton",
    practice: "Greenfield Equine Clinic", isSignificant: true, isSorted: true,
    summary: "Baseline foot radiograph survey — mild bilateral remodeling identified for the first time. Management plan initiated.",
    content: JSON.stringify({ type: "imaging", studyDate: "March 20, 2023", modality: "Digital Radiography", region: "Both Forefeet", indication: "Routine annual surveillance — baseline study for new patient", findings: "Mild remodeling at flexor cortex noted bilaterally. Early finding — no progression data available at this time.", impression: "Mild bilateral foot bone changes. Recommend annual surveillance to monitor for progression.", recommendation: "Specialized farriery consultation. Annual radiographic follow-up.", radiologist: "Dr. Sarah Colton, DVM", practice: "Greenfield Equine Clinic" }),
  },
  {
    id: "rec-raloma-prior-3", animalId: "raloma", date: "2022-06-08", season: "Summer 2022",
    type: "vet_note", title: "Specialist Consultation — Hind Limb Evaluation", provider: "Dr. Raymond Ng",
    practice: "Tri-State Equine Hospital", isSignificant: true, isSorted: true,
    summary: "Specialist referral — hind limb evaluation. No significant pathology identified. Conservative management recommended.",
    content: JSON.stringify({ type: "vet_note", visitDate: "June 8, 2022", visitType: "Lameness Consultation — Specialist Referral", subjective: "Referred by Dr. Colton for evaluation of intermittent right hind lameness noted over 3 competition weekends.", objective: "Flexion tests performed bilaterally. Mild positive response to distal hind limb flexion bilaterally — not considered clinically significant. Nerve blocks: improved with low 4-point block. Radiographs — no bony abnormality.", assessment: "Low-grade distal hind limb discomfort, likely associated with competition demands. No structural pathology identified.", plan: "Joint supplementation. Reduce arena surface hardness where possible. Re-evaluate if lameness worsens.", provider: "Dr. Raymond Ng, DVM DACVS", practice: "Tri-State Equine Hospital", referredBy: "Dr. Sarah Colton, Greenfield Equine Clinic" }),
  },
  {
    id: "rec-raloma-prior-4", animalId: "raloma", date: "2021-11-03", season: "Autumn 2021",
    type: "routine", title: "Dental Float & Wolf Tooth Extraction", provider: "Dr. Marcus Webb",
    practice: "Valley Equine Dental", isSignificant: false, isSorted: true,
    summary: "Routine float. Wolf teeth (105, 205) extracted without complication. Seven-year-old horse at time of exam.",
    content: JSON.stringify({ type: "routine", serviceType: "Dental Float & Surgical Extraction", date: "November 3, 2021", findings: "Wolf teeth 105 and 205 present — obstructing bit contact. Moderate enamel points upper arcades. Otherwise good dental equilibrium for age.", treatment: "Float performed all arcades. Wolf teeth 105 and 205 extracted — both uncomplicated, complete root extraction confirmed. Standard sedation protocol.", provider: "Dr. Marcus Webb, DVM", practice: "Valley Equine Dental" }),
  },
  {
    id: "rec-raloma-prior-5", animalId: "raloma", date: "2020-08-17", season: "Summer 2020",
    type: "vet_note", title: "Emergency Colic Evaluation", provider: "Dr. Priya Deshpande",
    practice: "Riverstone Equine Emergency", isSignificant: true, isSorted: true,
    summary: "Emergency colic evaluation — gas colic resolved with medical management. No surgical intervention required.",
    content: JSON.stringify({ type: "vet_note", visitDate: "August 17, 2020", visitType: "Emergency Colic Evaluation", subjective: "Owner reports horse showing signs of colic — pawing, flank watching, rolling. Onset approximately 2 hours prior. No recent feed change.", objective: "HR 52 bpm, RR 18. Gut sounds reduced all quadrants. Rectal: mild gas distension, no displacement palpated. Nasogastric tube: no reflux.", assessment: "Gas colic — moderate. Responsive to treatment. No indication for referral at this time.", plan: "Analgesic administered IV. Mineral oil via nasogastric tube. Monitor 2 hours — gut sounds returned, horse passing manure at discharge. Follow-up with primary vet in 24 hours.", provider: "Dr. Priya Deshpande, DVM", practice: "Riverstone Equine Emergency" }),
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ILLUSIVE Z
  // ══════════════════════════════════════════════════════════════════════════

  // Spring 2026
  {
    id: "rec-iz-001", animalId: "illusive-z", date: "2026-04-18", season: "Spring 2026",
    type: "vet_note", title: "Annual Wellness Examination", provider: "Dr. Eleanor Marsh",
    practice: "Lakeside Equine Practice", isSignificant: false, isSorted: true,
    summary: "Annual wellness exam — all findings within normal limits. Vaccinations administered. Coggins negative.",
    content: JSON.stringify({ type: "vet_note", visitDate: "April 18, 2026", visitType: "Annual Wellness Examination", subjective: "Owner reports excellent health. Competing actively at 1.20m. No lameness or behavioral concerns.", objective: "Full physical exam performed. BCS 6/9. No abnormalities on cardiovascular, respiratory, or musculoskeletal exam. Gait: sound at walk and trot.", assessment: "Healthy stallion in good athletic condition. All systems within normal limits.", plan: "EHV-1/4, Influenza, Rabies, West Nile vaccines administered. Coggins — negative. Annual foot radiograph series recommended before autumn.", provider: "Dr. Eleanor Marsh, DVM", practice: "Lakeside Equine Practice" }),
  },
  {
    id: "rec-iz-002", animalId: "illusive-z", date: "2026-02-10", season: "Early 2026",
    type: "routine", title: "Dental Examination & Float", provider: "Dr. Thomas Briar",
    practice: "Briar Equine Dentistry", isSignificant: false, isSorted: true,
    summary: "Biannual dental float. Mild hook formation addressed. No other concerns noted.",
    content: JSON.stringify({ type: "routine", serviceType: "Dental Float", date: "February 10, 2026", nextDue: "August 2026", findings: "Mild hook formation 106/206. Enamel points along buccal arcades. No wave mouth.", treatment: "Float performed all arcades. Hooks resolved. Standard sedation.", provider: "Dr. Thomas Briar, DVM", practice: "Briar Equine Dentistry" }),
  },
  {
    id: "rec-iz-003", animalId: "illusive-z", date: "2025-09-05", season: "Autumn 2025",
    type: "imaging", title: "Bilateral Foot Survey — Annual Radiograph", provider: "Dr. Eleanor Marsh",
    practice: "Lakeside Equine Practice", isSignificant: false, isSorted: true,
    summary: "Annual foot radiograph — all findings within normal limits. No remodeling or pathology identified.",
    content: JSON.stringify({ type: "imaging", studyDate: "September 5, 2025", modality: "Digital Radiography", region: "Both Forefeet", findings: "No remodeling changes identified. Joint spaces normal. Hoof capsule balance appropriate.", impression: "Normal radiographic findings bilaterally. No pathology identified.", recommendation: "Continue annual surveillance. Current farriery program appropriate.", radiologist: "Dr. Eleanor Marsh, DVM" }),
  },

  // ── PRIOR PROVIDERS — Illusive Z ──────────────────────────────────────────

  {
    id: "rec-iz-prior-1", animalId: "illusive-z", date: "2023-07-22", season: "Summer 2023",
    type: "vet_note", title: "Pre-Purchase Examination", provider: "Dr. Nadia Brennan",
    practice: "Brennan Equine Sports Medicine", isSignificant: true, isSorted: true,
    summary: "Pre-purchase examination completed on behalf of buyer. All findings unremarkable. Horse cleared for purchase.",
    content: JSON.stringify({ type: "vet_note", visitDate: "July 22, 2023", visitType: "Pre-Purchase Examination", subjective: "5-year-old KWPN stallion presented for pre-purchase exam. Current owner reports no known health concerns or prior injuries.", objective: "Comprehensive physical exam. BCS 5.5/9. No lymphadenopathy. Cardiovascular auscultation: normal rhythm, no murmur. Flexion tests: no significant positive response. Radiographs included in exam.", assessment: "No significant findings on pre-purchase examination. Horse is suitable for intended use at competitive level.", plan: "Results communicated to purchasing party. Records and radiographs provided for transfer to new primary veterinarian.", provider: "Dr. Nadia Brennan, DVM", practice: "Brennan Equine Sports Medicine", note: "Prior primary veterinarian" }),
  },
  {
    id: "rec-iz-prior-2", animalId: "illusive-z", date: "2022-11-14", season: "Autumn 2022",
    type: "vet_note", title: "Annual Wellness — Prior Primary Care", provider: "Dr. Nadia Brennan",
    practice: "Brennan Equine Sports Medicine", isSignificant: false, isSorted: true,
    summary: "Annual wellness exam under prior primary care. Routine vaccinations administered. All findings normal.",
    content: JSON.stringify({ type: "vet_note", visitDate: "November 14, 2022", visitType: "Annual Wellness Examination", subjective: "Four-year-old stallion. Owner reports horse performing well in early training. No concerns.", objective: "Physical exam unremarkable. BCS 5/9. No lameness. Cardiovascular and respiratory normal.", assessment: "Healthy young stallion in training. All systems normal.", plan: "EHV, Influenza, Rabies, West Nile vaccines administered. Coggins — negative. Dental exam scheduled with veterinary dentist.", provider: "Dr. Nadia Brennan, DVM", practice: "Brennan Equine Sports Medicine" }),
  },
  {
    id: "rec-iz-prior-3", animalId: "illusive-z", date: "2022-06-30", season: "Summer 2022",
    type: "imaging", title: "Hock & Stifle Survey — Training Baseline", provider: "Dr. Raymond Ng",
    practice: "Tri-State Equine Hospital", isSignificant: false, isSorted: true,
    summary: "Specialist referral for baseline imaging of hocks and stifles prior to advanced training. All findings within normal limits.",
    content: JSON.stringify({ type: "imaging", studyDate: "June 30, 2022", modality: "Digital Radiography + Ultrasound", region: "Bilateral Hocks and Stifles", indication: "Baseline imaging prior to advancing to 1.10m training program", findings: "Bilateral hocks: no degenerative changes. Joint spaces normal. Bilateral stifles: meniscal and ligamentous structures appear normal ultrasonographically. No effusion.", impression: "Normal imaging findings. No pathology identified. Appropriate for advancing training program.", recommendation: "Baseline archived for longitudinal comparison. Annual surveillance optional pending clinical signs.", provider: "Dr. Raymond Ng, DVM DACVS", practice: "Tri-State Equine Hospital" }),
  },
  {
    id: "rec-iz-prior-4", animalId: "illusive-z", date: "2021-08-05", season: "Summer 2021",
    type: "routine", title: "First Dental Float", provider: "Dr. Marcus Webb",
    practice: "Valley Equine Dental", isSignificant: false, isSorted: true,
    summary: "First dental float at three years of age. Mild enamel points addressed. All permanent teeth erupting normally.",
    content: JSON.stringify({ type: "routine", serviceType: "First Dental Float", date: "August 5, 2021", findings: "Three-year-old developing dentition. Cap shedding normal. Mild enamel points along buccal aspects. No wolf teeth noted.", treatment: "Light float performed. No extractions required. Standard sedation.", provider: "Dr. Marcus Webb, DVM", practice: "Valley Equine Dental" }),
  },

  // ══════════════════════════════════════════════════════════════════════════
  // INDEPENDENCE VDL
  // ══════════════════════════════════════════════════════════════════════════

  // Spring 2026
  {
    id: "rec-iv-001", animalId: "independence-vdl", date: "2026-06-01", season: "Spring 2026",
    type: "vet_note", title: "New Patient Intake & Pre-Purchase Review", provider: "Dr. Eleanor Marsh",
    practice: "Lakeside Equine Practice", isSignificant: true, isSorted: true,
    summary: "New patient registered. Pre-purchase evaluation reviewed — all findings unremarkable. Baseline care plan established.",
    content: JSON.stringify({ type: "vet_note", visitDate: "June 1, 2026", visitType: "New Patient Intake", subjective: "6-year-old chestnut KWPN mare recently acquired. Pre-purchase examination performed by referring vet — reviewed and accepted. Current on vaccinations per prior owner documentation. No known prior injuries.", objective: "Physical exam on intake. BCS 5/9. No lameness at walk or trot. Limbs unremarkable. Feet well-maintained.", assessment: "Healthy young mare. No concerns on intake. Pre-purchase report reviewed — no significant findings.", plan: "1. Baseline radiograph series — fore and hind feet — July. 2. Annual wellness exam + Coggins — July. 3. Vaccination series per AAEP guidelines — August. 4. Dental exam to be scheduled.", provider: "Dr. Eleanor Marsh, DVM", practice: "Lakeside Equine Practice" }),
  },
  {
    id: "rec-iv-002", animalId: "independence-vdl", date: "2026-05-20", season: "Spring 2026",
    type: "routine", title: "Farrier — Initial Trim & Assessment", provider: "Owen Calloway",
    practice: "Calloway Farriery", isSignificant: false, isSorted: true,
    summary: "Initial farriery assessment following acquisition. Hoof balance evaluated. Trim performed — no shoes at this time.",
    content: JSON.stringify({ type: "routine", date: "2026-05-20", nextDue: "2026-07-01", notes: "Initial trim on new horse to barn. Good natural hoof quality. Balanced trim performed. No corrective shoeing required at this stage. Will reassess when baseline radiographs are available.", provider: "Owen Calloway", practice: "Calloway Farriery" }),
  },

  // ── PRIOR PROVIDERS — Independence VDL ────────────────────────────────────

  {
    id: "rec-iv-prior-1", animalId: "independence-vdl", date: "2025-11-18", season: "Autumn 2025",
    type: "vet_note", title: "Pre-Purchase Examination", provider: "Dr. Colleen Hartley",
    practice: "Stonebridge Equine Clinic", isSignificant: true, isSorted: true,
    summary: "Pre-purchase exam on behalf of buyer. Soundness exam, radiographs, and scope completed. No significant findings. Horse cleared for purchase.",
    content: JSON.stringify({ type: "vet_note", visitDate: "November 18, 2025", visitType: "Pre-Purchase Examination", subjective: "5-year-old KWPN mare presented for pre-purchase. Seller reports no prior injuries or health concerns. Mare is current on vaccinations.", objective: "Full physical exam. BCS 5/9. No lymphadenopathy or focal abnormalities. Flexion tests bilaterally: no significant positive response. Upper airway endoscopy: normal. Radiographs of all four feet and hocks included.", assessment: "No significant findings. Mare suitable for intended use at 1.00m–1.10m level with scope for advancement.", plan: "Report provided to purchasing party. Radiograph copies archived and transferred.", provider: "Dr. Colleen Hartley, DVM", practice: "Stonebridge Equine Clinic", note: "Prior primary veterinarian" }),
  },
  {
    id: "rec-iv-prior-2", animalId: "independence-vdl", date: "2025-04-09", season: "Spring 2025",
    type: "vet_note", title: "Annual Wellness Examination", provider: "Dr. Colleen Hartley",
    practice: "Stonebridge Equine Clinic", isSignificant: false, isSorted: true,
    summary: "Annual wellness under prior primary care. Vaccinations current. All findings normal. Training progressing well.",
    content: JSON.stringify({ type: "vet_note", visitDate: "April 9, 2025", visitType: "Annual Wellness Examination", subjective: "Five-year-old mare in early training. Owner reports no health concerns. Appetite and attitude good.", objective: "Physical exam unremarkable. No lameness. Cardiovascular and respiratory normal for age.", assessment: "Healthy mare, all systems normal.", plan: "Vaccinations administered. Coggins — negative. Dental float recommended.", provider: "Dr. Colleen Hartley, DVM", practice: "Stonebridge Equine Clinic" }),
  },
  {
    id: "rec-iv-prior-3", animalId: "independence-vdl", date: "2023-06-14", season: "Summer 2023",
    type: "routine", title: "First Dental Float", provider: "Dr. Thomas Briar",
    practice: "Briar Equine Dental", isSignificant: false, isSorted: true,
    summary: "First dental float at three years of age. Mild enamel points. Normal developing dentition. No complications.",
    content: JSON.stringify({ type: "routine", serviceType: "First Dental Float", date: "June 14, 2023", findings: "Three-year-old developing dentition. Normal cap shedding in progress. Mild buccal enamel points. No wolf teeth.", treatment: "Light float performed. Standard sedation. No extractions required.", provider: "Dr. Thomas Briar, DVM", practice: "Briar Equine Dental" }),
  },
  {
    id: "rec-iv-prior-4", animalId: "independence-vdl", date: "2021-07-22", season: "Summer 2021",
    type: "vet_note", title: "Foal Exam — 10 Weeks", provider: "Dr. Colleen Hartley",
    practice: "Stonebridge Equine Clinic", isSignificant: false, isSorted: true,
    summary: "Routine foal examination at 10 weeks. All findings normal. First vaccination series initiated.",
    content: JSON.stringify({ type: "vet_note", visitDate: "July 22, 2021", visitType: "Foal Health Examination", subjective: "10-week-old KWPN filly. Breeder reports foal nursing well, growing appropriately, no health concerns.", objective: "General physical exam — normal findings for age. No angular or flexural limb deformities. Navel fully closed. Weight appropriate.", assessment: "Healthy foal at 10 weeks. Normal development.", plan: "Initial vaccination series commenced. Deworming per foal protocol. Follow-up at 4–6 months.", provider: "Dr. Colleen Hartley, DVM", practice: "Stonebridge Equine Clinic" }),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PATIENT REVIEWS
// ─────────────────────────────────────────────────────────────────────────────

export const mockPatientReviews: Record<string, {
  animalId: string;
  items: { label: string; type: string; detail: string; status: string; date?: string }[];
}> = {
  "raloma": {
    animalId: "raloma",
    items: [
      { label: "Anti-Inflammatory Rx", type: "medication", detail: "Once daily — ongoing since Oct 2025", status: "active", date: "Oct 2025" },
      { label: "No Jumping", type: "restriction", detail: "Hold until imaging recheck — mid-July", status: "warning" },
      { label: "Soft Tissue Injury", type: "condition", detail: "Left forelimb — rehabilitation in progress", status: "monitoring" },
      { label: "Trot & Canter Cleared", type: "clearance", detail: "Dr. Marsh — May 12, 2026", status: "cleared" },
      { label: "Imaging Recheck Due", type: "upcoming", detail: "Mid-July 2026 — Dr. Cross, Clearview Imaging", status: "upcoming" },
      { label: "Dental Exam Pending", type: "upcoming", detail: "Late summer — Dr. Briar", status: "upcoming" },
      { label: "Weight Stable", type: "clearance", detail: "558 kg — consistent over 6 months", status: "cleared" },
    ],
  },
  "illusive-z": {
    animalId: "illusive-z",
    items: [
      { label: "Coggins — Negative", type: "clearance", detail: "Tested April 18, 2026 — valid 12 months", status: "cleared" },
      { label: "Vaccinations Current", type: "clearance", detail: "EHV, Influenza, Rabies, West Nile — April 2026", status: "cleared" },
      { label: "Foot Radiographs Due", type: "upcoming", detail: "Annual series — schedule before autumn", status: "upcoming" },
      { label: "Wellness Exam Complete", type: "clearance", detail: "All findings WNL — April 18, 2026", status: "cleared" },
    ],
  },
  "independence-vdl": {
    animalId: "independence-vdl",
    items: [
      { label: "New Patient", type: "condition", detail: "Intake completed June 1, 2026", status: "monitoring" },
      { label: "Baseline Radiographs", type: "upcoming", detail: "Fore & hind feet — schedule early July", status: "upcoming" },
      { label: "Coggins Test Due", type: "upcoming", detail: "Required before July competitions", status: "upcoming" },
      { label: "Vaccination Series", type: "upcoming", detail: "AAEP protocol — schedule August", status: "upcoming" },
      { label: "Dental Exam Pending", type: "upcoming", detail: "First exam — Dr. Briar to schedule", status: "upcoming" },
      { label: "Pre-Purchase WNL", type: "clearance", detail: "Reviewed June 1, 2026 — no significant findings", status: "cleared" },
    ],
  },
};

export const mockPatientReview = mockPatientReviews["raloma"];

// ─────────────────────────────────────────────────────────────────────────────
// VET HEALTH STATS — recent key lab values + vitals per horse
// Used to populate the "Recent Health Data" section on VetAnimalView
// ─────────────────────────────────────────────────────────────────────────────

export interface HealthStat {
  label: string;       // analyte or metric name
  value: string;       // numeric or descriptive value
  unit: string;        // e.g. "g/dL", "kg", "bpm" — empty string if not applicable
  refRange?: string;   // normal range if available
  flag: "normal" | "low" | "high" | "watch";  // result interpretation
  date: string;        // when collected / recorded
  source: string;      // e.g. "CBC Panel · Mar 2026"
}

export const mockVetHealthStats: Record<string, HealthStat[]> = {
  "raloma": [
    { label: "RBC",        value: "7.6",   unit: "×10⁶/μL", refRange: "6.0–10.0",  flag: "normal", date: "Mar 5, 2026",  source: "CBC Panel" },
    { label: "Hemoglobin", value: "13.5",  unit: "g/dL",    refRange: "11.0–17.0", flag: "normal", date: "Mar 5, 2026",  source: "CBC Panel" },
    { label: "WBC",        value: "7.1",   unit: "×10³/μL", refRange: "5.4–14.3",  flag: "normal", date: "Mar 5, 2026",  source: "CBC Panel" },
    { label: "AST",        value: "298",   unit: "U/L",     refRange: "185–370",   flag: "normal", date: "Mar 5, 2026",  source: "Chemistry Panel" },
    { label: "GGT",        value: "21",    unit: "U/L",     refRange: "5–28",      flag: "normal", date: "Mar 5, 2026",  source: "Chemistry Panel" },
    { label: "Creatinine", value: "1.4",   unit: "mg/dL",   refRange: "0.9–2.1",   flag: "normal", date: "Mar 5, 2026",  source: "Chemistry Panel" },
    { label: "Glucose",    value: "92",    unit: "mg/dL",   refRange: "60–110",    flag: "normal", date: "Mar 5, 2026",  source: "Chemistry Panel" },
    { label: "Body Weight",value: "558",   unit: "kg",      refRange: "",          flag: "normal", date: "May 12, 2026", source: "Physical Exam" },
  ],
  "illusive-z": [
    { label: "Coggins",    value: "Negative", unit: "",   refRange: "",          flag: "normal", date: "Apr 18, 2026", source: "Serology" },
    { label: "Body Weight",value: "612",      unit: "kg", refRange: "",          flag: "normal", date: "Apr 18, 2026", source: "Physical Exam" },
    { label: "Heart Rate", value: "36",       unit: "bpm",refRange: "28–44",     flag: "normal", date: "Apr 18, 2026", source: "Physical Exam" },
    { label: "Resp Rate",  value: "14",       unit: "/min",refRange: "8–16",     flag: "normal", date: "Apr 18, 2026", source: "Physical Exam" },
    { label: "Temp",       value: "37.6",     unit: "°C", refRange: "37.2–38.5", flag: "normal", date: "Apr 18, 2026", source: "Physical Exam" },
  ],
  "colorado-z": [
    { label: "Body Weight", value: "582",     unit: "kg",   refRange: "",          flag: "normal", date: "May 28, 2026",  source: "Physical Exam" },
    { label: "Heart Rate",  value: "36",      unit: "bpm",  refRange: "28–44",     flag: "normal", date: "May 28, 2026",  source: "Physical Exam" },
    { label: "Temp",        value: "37.5",    unit: "°C",   refRange: "37.2–38.5", flag: "normal", date: "May 28, 2026",  source: "Physical Exam" },
    { label: "Coggins",     value: "Negative",unit: "",     refRange: "",          flag: "normal", date: "May 28, 2026",  source: "Serology" },
  ],
  "sambucca": [
    { label: "Body Weight", value: "523",     unit: "kg",   refRange: "",          flag: "normal", date: "Jun 5, 2026",   source: "Physical Exam" },
    { label: "Heart Rate",  value: "40",      unit: "bpm",  refRange: "28–44",     flag: "normal", date: "Jun 5, 2026",   source: "Physical Exam" },
    { label: "Temp",        value: "37.7",    unit: "°C",   refRange: "37.2–38.5", flag: "normal", date: "Jun 5, 2026",   source: "Physical Exam" },
    { label: "Coggins",     value: "Negative",unit: "",     refRange: "",          flag: "normal", date: "Apr 14, 2026",  source: "Serology" },
  ],
  "independence-vdl": [
    { label: "Body Weight",value: "487",   unit: "kg",   refRange: "",            flag: "normal", date: "Jun 1, 2026",  source: "Intake Exam" },
    { label: "Heart Rate", value: "40",    unit: "bpm",  refRange: "28–44",       flag: "normal", date: "Jun 1, 2026",  source: "Intake Exam" },
    { label: "Temp",       value: "37.8",  unit: "°C",   refRange: "37.2–38.5",  flag: "normal", date: "Jun 1, 2026",  source: "Intake Exam" },
    { label: "Resp Rate",  value: "12",    unit: "/min", refRange: "8–16",        flag: "normal", date: "Jun 1, 2026",  source: "Intake Exam" },
    { label: "Mucous Memb.",value:"Pink/moist",unit:"",  refRange: "Pink, moist", flag: "normal", date: "Jun 1, 2026",  source: "Intake Exam" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// VET MOCK DATA — Dr. Eleanor Marsh, Lakeside Equine Practice
// ─────────────────────────────────────────────────────────────────────────────

export const mockVetPractice = {
  name: "Lakeside Equine Practice",
  vetName: "Dr. Eleanor Marsh, DVM",
  initials: "EM",
  phone: "(555) 010-0100",
  email: "e.marsh@demo-vet.example",
};

// All animals this vet is permissioned on, with context for each
export const mockVetCaseload = [
  {
    animalId: "raloma",
    animalName: "Raloma",
    breed: "Warmblood",
    sex: "Gelding",
    dob: "2014-03-18",
    ownerName: "EQOS Performance Sport",
    patientStatus: "monitoring" as const,
    accessLevel: "READ+WRITE",
    lastVisit: "2026-05-12",
    nextDue: "Mid-July 2026",
    clinicalNote: "Monitoring soft tissue rehab. Jumping restricted until imaging recheck.",
    urgency: "medium" as const,
  },
  {
    animalId: "illusive-z",
    animalName: "Illusive Z",
    breed: "KWPN Stallion",
    sex: "Stallion",
    dob: "2018-04-14",
    ownerName: "EQOS Performance Sport",
    patientStatus: "stable" as const,
    accessLevel: "READ+WRITE",
    lastVisit: "2026-04-18",
    nextDue: "Autumn 2026",
    clinicalNote: "Annual foot radiographs due before autumn season.",
    urgency: "low" as const,
  },
  {
    animalId: "independence-vdl",
    animalName: "Independence VDL",
    breed: "KWPN Mare",
    sex: "Mare",
    dob: "2020-05-09",
    ownerName: "EQOS Performance Sport",
    patientStatus: "stable" as const,
    accessLevel: "READ+WRITE",
    lastVisit: "2026-06-01",
    nextDue: "Early July 2026",
    clinicalNote: "New patient. Baseline radiographs and Coggins pending before first season.",
    urgency: "medium" as const,
  },
  {
    animalId: "colorado-z",
    animalName: "Colorado Z",
    breed: "Zangersheide",
    sex: "Gelding",
    dob: "2016-06-22",
    ownerName: "EPS Sport Horses",
    patientStatus: "stable" as const,
    accessLevel: "READ+WRITE",
    lastVisit: "2026-05-28",
    nextDue: "Late August 2026",
    clinicalNote: "Healthy 10-year-old in active 1.30m competition. Spring vaccines and dental float completed. No active concerns. Fall hock maintenance anticipated.",
    urgency: "low" as const,
  },
  {
    animalId: "sambucca",
    animalName: "Sambucca",
    breed: "Oldenburg Mare",
    sex: "Mare",
    dob: "2019-02-14",
    ownerName: "EPS Sport Horses",
    patientStatus: "monitoring" as const,
    accessLevel: "READ+WRITE",
    lastVisit: "2026-06-05",
    nextDue: "Late June 2026",
    clinicalNote: "7-year-old mare with mild intermittent right hindlimb stiffness noted in work. Flexion test borderline positive. Ultrasound of proximal suspensory scheduled.",
    urgency: "medium" as const,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PRIOR CARE TEAM — keyed by animalId
// Derived from records — one entry per prior provider, with specialty + notes
// ─────────────────────────────────────────────────────────────────────────────

export interface PriorProvider {
  name: string;
  role: string;
  practice: string;
  specialty: string;
  yearsActive: string;       // e.g. "2020–2023"
  relationship: string;      // "Prior primary vet" | "Specialist referral" | etc.
  recordIds: string[];       // IDs of records from this provider
  notes: string;             // brief clinical context for why they were involved
}

export const mockPriorCareTeam: Record<string, PriorProvider[]> = {
  "colorado-z": [
    {
      name: "Dr. Amara Osei, DVM",
      role: "Prior Primary Veterinarian",
      practice: "Westfield Equine Clinic",
      specialty: "General equine medicine & preventive care",
      yearsActive: "2019–2022",
      relationship: "Prior primary veterinarian",
      recordIds: ["rec-cz-prior-1", "rec-cz-prior-2"],
      notes: "Primary veterinarian prior to transfer to Lakeside Equine Practice. Performed baseline hock radiograph survey identifying early distal tarsal changes. Annual wellness and vaccination records on file.",
    },
  ],
  "sambucca": [
    {
      name: "Dr. Fiona Steed, DVM",
      role: "Prior Primary Veterinarian",
      practice: "Ridgeline Equine Partners",
      specialty: "General equine medicine — sport horse",
      yearsActive: "2019–2024",
      relationship: "Prior primary veterinarian",
      recordIds: ["rec-sb-prior-1", "rec-sb-prior-2"],
      notes: "Primary veterinarian from foalhood through 2024. Performed pre-training examination at three years and annual wellness care. Full longitudinal records transferred and on file.",
    },
  ],
  "raloma": [
    {
      name: "Dr. Sarah Colton, DVM",
      role: "Prior Primary Veterinarian",
      practice: "Greenfield Equine Clinic",
      specialty: "General equine medicine & preventive care",
      yearsActive: "2021–2023",
      relationship: "Prior primary veterinarian",
      recordIds: ["rec-raloma-prior-1", "rec-raloma-prior-2"],
      notes: "Primary veterinarian prior to transfer to Lakeside Equine Practice. Identified and documented initial bilateral foot bone remodeling in spring 2023. Full wellness and vaccination records on file.",
    },
    {
      name: "Dr. Raymond Ng, DVM DACVS",
      role: "Surgical Specialist",
      practice: "Tri-State Equine Hospital",
      specialty: "Equine surgery & lameness — board certified (ACVS)",
      yearsActive: "2022",
      relationship: "Specialist referral — hind limb evaluation",
      recordIds: ["rec-raloma-prior-3"],
      notes: "Referred by Dr. Colton for intermittent right hind lameness evaluation. No significant pathology identified. Conservative management recommended. Full specialist report on file.",
    },
    {
      name: "Dr. Marcus Webb, DVM",
      role: "Veterinary Dentist",
      practice: "Valley Equine Dental",
      specialty: "Equine dental care & oral surgery",
      yearsActive: "2021",
      relationship: "Dental specialist",
      recordIds: ["rec-raloma-prior-4"],
      notes: "Performed first dental float and wolf tooth extraction (105, 205) at seven years of age. Uncomplicated procedure. Records transferred to current dental provider Dr. Briar.",
    },
    {
      name: "Dr. Priya Deshpande, DVM",
      role: "Emergency Veterinarian",
      practice: "Riverstone Equine Emergency",
      specialty: "Equine emergency medicine",
      yearsActive: "2020",
      relationship: "Emergency care — single episode",
      recordIds: ["rec-raloma-prior-5"],
      notes: "Treated for an episode of gas colic in August 2020. Resolved with medical management — no surgical intervention. Full emergency report on file.",
    },
  ],
  "illusive-z": [
    {
      name: "Dr. Nadia Brennan, DVM",
      role: "Prior Primary Veterinarian",
      practice: "Brennan Equine Sports Medicine",
      specialty: "Equine sports medicine & performance",
      yearsActive: "2021–2023",
      relationship: "Prior primary veterinarian",
      recordIds: ["rec-iz-prior-1", "rec-iz-prior-2"],
      notes: "Primary veterinarian prior to purchase. Performed pre-purchase examination cleared for competitive use. Annual wellness records on file for 2021–2023 period.",
    },
    {
      name: "Dr. Raymond Ng, DVM DACVS",
      role: "Surgical Specialist",
      practice: "Tri-State Equine Hospital",
      specialty: "Equine surgery & lameness — board certified (ACVS)",
      yearsActive: "2022",
      relationship: "Specialist referral — baseline imaging",
      recordIds: ["rec-iz-prior-3"],
      notes: "Baseline hock and stifle imaging performed prior to advancing to 1.10m training. All findings within normal limits. Imaging archived for longitudinal comparison.",
    },
    {
      name: "Dr. Marcus Webb, DVM",
      role: "Veterinary Dentist",
      practice: "Valley Equine Dental",
      specialty: "Equine dental care & oral surgery",
      yearsActive: "2021",
      relationship: "Dental specialist",
      recordIds: ["rec-iz-prior-4"],
      notes: "First dental float performed at three years of age. Normal developing dentition. No extractions required. Records transferred to current dental provider.",
    },
  ],
  "independence-vdl": [
    {
      name: "Dr. Colleen Hartley, DVM",
      role: "Prior Primary Veterinarian",
      practice: "Stonebridge Equine Clinic",
      specialty: "General equine medicine — sport horse",
      yearsActive: "2021–2025",
      relationship: "Prior primary veterinarian",
      recordIds: ["rec-iv-prior-1", "rec-iv-prior-2", "rec-iv-prior-4"],
      notes: "Primary veterinarian from foalhood through sale in late 2025. Performed foal exam, annual wellness care, and pre-purchase examination. Full longitudinal records transferred and on file.",
    },
    {
      name: "Dr. Thomas Briar, DVM",
      role: "Veterinary Dentist",
      practice: "Briar Equine Dental",
      specialty: "Equine dental care",
      yearsActive: "2023",
      relationship: "Dental specialist — first float",
      recordIds: ["rec-iv-prior-3"],
      notes: "Performed first dental float at three years of age under prior ownership. Mild enamel points addressed, normal developing dentition. Same provider now serving as current dental specialist.",
    },
  ],
};
