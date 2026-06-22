// ── Mock owner document vault ─────────────────────────────────────────────
// All data is completely fictional and for demonstration purposes only.

export type DocStatus = "current" | "expiring" | "expired";

export interface OwnerDocument {
  id: string;
  animalId: string;
  type: "coggins" | "health_cert" | "vaccination" | "insurance" | "passport" | "registration" | "prepurchase";
  title: string;
  issuer: string;
  issuedDate: string;
  expiresDate: string | null;
  status: DocStatus;
  fileNote: string; // simulated — would be a real file URL
  accessionNumber?: string;
}

export const mockDocuments: OwnerDocument[] = [

  // ── Raloma ──────────────────────────────────────────────────────────────
  {
    id: "doc-r-001",
    animalId: "raloma",
    type: "coggins",
    title: "EIA / Coggins Test",
    issuer: "Dr. Eleanor Marsh, DVM — Lakeside Equine Practice",
    issuedDate: "2026-03-05",
    expiresDate: "2027-03-05",
    status: "current",
    fileNote: "USDA accredited — negative result on file",
    accessionNumber: "PA-2026-03-00441",
  },
  {
    id: "doc-r-002",
    animalId: "raloma",
    type: "health_cert",
    title: "Certificate of Veterinary Inspection",
    issuer: "Dr. Eleanor Marsh, DVM — Lakeside Equine Practice",
    issuedDate: "2026-06-01",
    expiresDate: "2026-06-30",
    status: "expiring",
    fileNote: "Interstate CVI — valid for PA → NJ travel",
    accessionNumber: "CVI-2026-06-0017",
  },
  {
    id: "doc-r-003",
    animalId: "raloma",
    type: "vaccination",
    title: "Vaccination Record",
    issuer: "Dr. Eleanor Marsh, DVM — Lakeside Equine Practice",
    issuedDate: "2025-09-10",
    expiresDate: "2026-09-10",
    status: "current",
    fileNote: "EHV-1/4, Influenza, Rabies, West Nile, Tetanus",
  },
  {
    id: "doc-r-004",
    animalId: "raloma",
    type: "insurance",
    title: "Equine Mortality Insurance Certificate",
    issuer: "Markel Insurance — Policy #EQ-004821-R",
    issuedDate: "2026-01-01",
    expiresDate: "2026-12-31",
    status: "current",
    fileNote: "Major medical and mortality — $85,000 insured value",
  },
  {
    id: "doc-r-005",
    animalId: "raloma",
    type: "passport",
    title: "FEI Horse Passport",
    issuer: "USEF — Federation Equestre Internationale",
    issuedDate: "2016-05-12",
    expiresDate: null,
    status: "current",
    fileNote: "FEI ID: 10600979 — current microchip verified",
  },

  // ── Illusive Z ──────────────────────────────────────────────────────────
  {
    id: "doc-iz-001",
    animalId: "illusive-z",
    type: "coggins",
    title: "EIA / Coggins Test",
    issuer: "Dr. Eleanor Marsh, DVM — Lakeside Equine Practice",
    issuedDate: "2026-04-18",
    expiresDate: "2027-04-18",
    status: "current",
    fileNote: "USDA accredited — negative result on file",
    accessionNumber: "PA-2026-04-00629",
  },
  {
    id: "doc-iz-002",
    animalId: "illusive-z",
    type: "vaccination",
    title: "Vaccination Record",
    issuer: "Dr. Eleanor Marsh, DVM — Lakeside Equine Practice",
    issuedDate: "2026-04-18",
    expiresDate: "2027-04-18",
    status: "current",
    fileNote: "EHV-1/4, Influenza, Rabies, West Nile — April 2026",
  },
  {
    id: "doc-iz-003",
    animalId: "illusive-z",
    type: "registration",
    title: "KWPN Registration Certificate",
    issuer: "Royal Warmblood Studbook of the Netherlands (KWPN-NA)",
    issuedDate: "2018-09-01",
    expiresDate: null,
    status: "current",
    fileNote: "Studbook registration — stallion approved",
  },
  {
    id: "doc-iz-004",
    animalId: "illusive-z",
    type: "insurance",
    title: "Equine Mortality Insurance Certificate",
    issuer: "Markel Insurance — Policy #EQ-009374-IZ",
    issuedDate: "2026-01-01",
    expiresDate: "2026-12-31",
    status: "current",
    fileNote: "Major medical and mortality — $120,000 insured value",
  },

  // ── Independence VDL ────────────────────────────────────────────────────
  {
    id: "doc-iv-001",
    animalId: "independence-vdl",
    type: "coggins",
    title: "EIA / Coggins Test",
    issuer: "Dr. Helen Porter, DVM — Valley Equine Associates",
    issuedDate: "2026-05-01",
    expiresDate: "2027-05-01",
    status: "current",
    fileNote: "Prior owner — transferred on acquisition",
    accessionNumber: "PA-2026-05-00112",
  },
  {
    id: "doc-iv-002",
    animalId: "independence-vdl",
    type: "prepurchase",
    title: "Pre-Purchase Examination Report",
    issuer: "Dr. Helen Porter, DVM — Valley Equine Associates",
    issuedDate: "2026-05-20",
    expiresDate: null,
    status: "current",
    fileNote: "Full PPE including radiographs — reviewed by Dr. Marsh on intake",
  },
  {
    id: "doc-iv-003",
    animalId: "independence-vdl",
    type: "vaccination",
    title: "Vaccination Record",
    issuer: "Dr. Helen Porter, DVM — Valley Equine Associates",
    issuedDate: "2025-08-15",
    expiresDate: "2026-08-15",
    status: "expiring",
    fileNote: "EHV, Influenza — due for renewal August 2026",
  },
  {
    id: "doc-iv-004",
    animalId: "independence-vdl",
    type: "registration",
    title: "KWPN Registration Certificate",
    issuer: "Royal Warmblood Studbook of the Netherlands (KWPN-NA)",
    issuedDate: "2020-10-14",
    expiresDate: null,
    status: "current",
    fileNote: "Mare registration — transferred to new owner",
  },
];
