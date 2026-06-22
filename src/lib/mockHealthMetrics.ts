// ── Mock health metric series for Copperfield VDL ──────────────────────────
// All data is completely fictional and for demonstration purposes only.

export interface WeightPoint    { date: string; weight: number; }
export interface LamenessPoint  { date: string; score: number; label: string; }
export interface LabTrendPoint  { date: string; ast: number; ggt: number; totalProtein: number; }
export interface MedEvent       { date: string; name: string; status: "active" | "completed" | "paused"; duration: string; }
export interface ActivityPoint  { date: string; minutes: number; intensity: "rest" | "walk" | "trot" | "canter" | "jump"; }

// Body weight over rolling 18 months (kg)
export const weightSeries: WeightPoint[] = [
  { date: "Dec 2024", weight: 554 },
  { date: "Jan 2025", weight: 558 },
  { date: "Feb 2025", weight: 561 },
  { date: "Mar 2025", weight: 560 },
  { date: "Apr 2025", weight: 557 },
  { date: "May 2025", weight: 553 },
  { date: "Jun 2025", weight: 549 },
  { date: "Jul 2025", weight: 548 },
  { date: "Aug 2025", weight: 547 },
  { date: "Sep 2025", weight: 550 },
  { date: "Oct 2025", weight: 548 },
  { date: "Nov 2025", weight: 552 },
  { date: "Dec 2025", weight: 557 },
  { date: "Jan 2026", weight: 560 },
  { date: "Feb 2026", weight: 562 },
  { date: "Mar 2026", weight: 561 },
  { date: "Apr 2026", weight: 559 },
  { date: "May 2026", weight: 558 },
];

// Lameness score at each vet exam (0 = sound, 5 = severe; AAEP scale)
export const lamenessSeries: LamenessPoint[] = [
  { date: "Apr 2025", score: 0, label: "Annual exam — sound" },
  { date: "Oct 2025", score: 2, label: "Injury onset — moderate lameness" },
  { date: "Nov 2025", score: 2, label: "Week 4 recheck — unchanged" },
  { date: "Jan 2026", score: 1, label: "Post treatment — improving" },
  { date: "Mar 2026", score: 0.5, label: "Return-to-work — mild residual" },
  { date: "May 2026", score: 0, label: "Re-evaluation — sound at trot" },
];

// Key chemistry trends across lab panels
export const labTrendSeries: LabTrendPoint[] = [
  { date: "Apr 2025", ast: 310, ggt: 19, totalProtein: 7.1 },
  { date: "Oct 2025", ast: 340, ggt: 24, totalProtein: 6.9 },
  { date: "Mar 2026", ast: 298, ggt: 21, totalProtein: 7.0 },
];

// Medication timeline (Gantt-style)
export const medicationEvents: MedEvent[] = [
  { date: "Oct 2025", name: "Anti-Inflammatory (Rx)", status: "active",    duration: "Oct 2025 → present" },
  { date: "Oct 2025", name: "Therapeutic Sessions",   status: "completed", duration: "Oct 2025 → Jan 2026" },
  { date: "Jan 2026", name: "Joint Support Supplement", status: "active",  duration: "Jan 2026 → present" },
  { date: "Jan 2026", name: "Musculoskeletal Supplement", status: "active", duration: "Jan 2026 → present" },
  { date: "Nov 2024", name: "Omega-3 Supplement",     status: "active",    duration: "Nov 2024 → present" },
];

// Exercise/activity rehabilitation log (minutes per day — summarised by week)
export const activitySeries: ActivityPoint[] = [
  { date: "Oct W3 '25", minutes: 0,  intensity: "rest" },
  { date: "Nov W1 '25", minutes: 0,  intensity: "rest" },
  { date: "Nov W3 '25", minutes: 15, intensity: "walk" },
  { date: "Dec W1 '25", minutes: 20, intensity: "walk" },
  { date: "Dec W3 '25", minutes: 20, intensity: "walk" },
  { date: "Jan W2 '26", minutes: 25, intensity: "walk" },
  { date: "Feb W1 '26", minutes: 30, intensity: "walk" },
  { date: "Feb W3 '26", minutes: 30, intensity: "trot" },
  { date: "Mar W2 '26", minutes: 35, intensity: "trot" },
  { date: "Mar W4 '26", minutes: 40, intensity: "trot" },
  { date: "Apr W2 '26", minutes: 40, intensity: "canter" },
  { date: "Apr W4 '26", minutes: 45, intensity: "canter" },
  { date: "May W2 '26", minutes: 45, intensity: "canter" },
  { date: "May W4 '26", minutes: 50, intensity: "canter" },
];

// KPI snapshot
export const healthKPIs = {
  currentWeight:   "558 kg",
  weightTrend:     "stable",
  currentLameness: "0 / 5",
  lamenessTrend:   "improving",
  lastLabDate:     "Mar 5, 2026",
  labStatus:       "All within range",
  activeMeds:      4,
  daysInRehab:     237,
  nextReview:      "Mid-July 2026",
};
