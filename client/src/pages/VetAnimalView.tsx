import { useState } from "react";
import { useParams, Link } from "wouter";
import {
  mockAnimals, mockRecords, mockCareTeam, mockVetPractice, mockPatientReviews, mockPriorCareTeam, mockVetHealthStats
} from "@/lib/mockData";
import type { HealthStat } from "@/lib/mockData";
import type { Record } from "@shared/schema";
import RecordSlideOver from "@/components/RecordSlideOver";
import {
  ChevronLeft, Star, FlaskConical, FileText, Scan, Scissors,
  Clock, CheckCircle, AlertTriangle, Activity, Upload,
  User, Phone, Mail, History, Filter, Pill, TestTube, TrendingUp,
} from "lucide-react";

import horseCopperfieldVDLImg from "@assets/horse-copperfield-vdl.jpg";
import horseSacardaImg from "@assets/horse-sacarda.jpg";

const horsePhotos: Record<string, string> = {
  "raloma":           horseCopperfieldVDLImg,
  "illusive-z":       horseSacardaImg,
  "independence-vdl": horseSacardaImg,
};

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function TypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = { lab: "Lab", imaging: "Imaging", vet_note: "Vet Note", routine: "Routine" };
  const classMap: Record<string, string> = { lab: "type-lab", imaging: "type-imaging", vet_note: "type-vet_note", routine: "type-routine" };
  const icons: Record<string, JSX.Element> = {
    lab: <FlaskConical style={{ width: 10, height: 10 }} />,
    imaging: <Scan style={{ width: 10, height: 10 }} />,
    vet_note: <FileText style={{ width: 10, height: 10 }} />,
    routine: <Scissors style={{ width: 10, height: 10 }} />,
  };
  return (
    <span className={`type-badge ${classMap[type] ?? "type-vet_note"}`}>
      {icons[type] ?? <FileText style={{ width: 10, height: 10 }} />}
      {labels[type] ?? type}
    </span>
  );
}

function isPriorProvider(record: Record, currentProviders: string[]): boolean {
  return !currentProviders.includes(record.provider);
}

const SEASON_ORDER = [
  "Spring 2026", "Early 2026", "Autumn 2025", "Late 2025",
  "Spring 2025", "Early 2025", "Summer 2023", "Autumn 2023",
  "Spring 2023", "Summer 2022", "Autumn 2022", "Summer 2021",
  "Autumn 2021", "Summer 2020",
];

/* ── SOAP Composer ────────────────────────────────────────────────────────── */
function SoapComposer({ animalName, onClose }: { animalName: string; onClose: () => void }) {
  const [form, setForm] = useState({ subjective: "", objective: "", assessment: "", plan: "", visitType: "Examination" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));
  const inputStyle: React.CSSProperties = {
    width: "100%", border: "1px solid rgba(25,30,46,0.14)", borderRadius: 5,
    padding: "0.6rem 0.75rem", fontFamily: "var(--font-body)", fontWeight: 300,
    fontSize: "0.82rem", color: "var(--navy)", background: "white",
    resize: "vertical", minHeight: 70, outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-courier)", fontSize: "0.55rem", letterSpacing: "0.08em",
    textTransform: "uppercase", color: "var(--amber)", marginBottom: "0.3rem", display: "block",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "flex-end",
    }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(25,30,46,0.35)" }} onClick={onClose} />
      <div style={{
        position: "relative", width: 480, height: "100vh",
        background: "var(--linen)", boxShadow: "-4px 0 32px rgba(25,30,46,0.18)",
        display: "flex", flexDirection: "column", overflowY: "auto",
      }}>
        {/* Header */}
        <div style={{ background: "var(--navy)", padding: "1.25rem 1.5rem", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.3rem" }}>
            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
              Add clinical note
            </p>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "1.1rem", lineHeight: 1 }}>×</button>
          </div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "white" }}>{animalName}</p>
          <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.07em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginTop: "0.2rem" }}>
            {mockVetPractice.vetName} · {mockVetPractice.name}
          </p>
        </div>

        <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Visit type */}
          <div>
            <label style={labelStyle}>Visit type</label>
            <select value={form.visitType} onChange={set("visitType")} style={{ ...inputStyle, minHeight: "auto", resize: "none", height: 36, cursor: "pointer" }}>
              <option>Examination</option>
              <option>Lameness Evaluation</option>
              <option>Follow-up</option>
              <option>Emergency</option>
              <option>Preventive Care</option>
              <option>Consultation</option>
              <option>Post-Operative</option>
            </select>
          </div>

          {/* SOAP */}
          {(["subjective", "objective", "assessment", "plan"] as const).map(field => (
            <div key={field}>
              <label style={labelStyle}>{field}</label>
              <textarea
                value={form[field]}
                onChange={set(field)}
                style={inputStyle}
                placeholder={
                  field === "subjective" ? "Owner-reported observations, chief complaint…" :
                  field === "objective" ? "Physical exam findings, gait evaluation, palpation…" :
                  field === "assessment" ? "Clinical impression, diagnosis, prognosis…" :
                  "Treatment plan, medications, restrictions, follow-up…"
                }
              />
            </div>
          ))}

          {/* Attach */}
          <div>
            <label style={labelStyle}>Attach file</label>
            <label style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              border: "1px dashed rgba(25,30,46,0.2)", borderRadius: 5,
              padding: "0.75rem 1rem", cursor: "pointer",
              fontFamily: "var(--font-body)", fontWeight: 300,
              fontSize: "0.75rem", color: "rgba(25,30,46,0.62)",
            }}>
              <Upload size={14} />
              Upload lab result, image, or PDF
              <input type="file" style={{ display: "none" }} />
            </label>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "auto", paddingTop: "0.5rem" }}>
            <button
              onClick={onClose}
              style={{
                flex: 1, padding: "0.7rem", borderRadius: 5,
                border: "1px solid rgba(25,30,46,0.15)",
                background: "white", cursor: "pointer",
                fontFamily: "var(--font-courier)", fontSize: "0.6rem",
                letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(25,30,46,0.70)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              style={{
                flex: 2, padding: "0.7rem", borderRadius: 5,
                border: "none", background: "var(--navy)", cursor: "pointer",
                fontFamily: "var(--font-courier)", fontSize: "0.6rem",
                letterSpacing: "0.07em", textTransform: "uppercase", color: "white",
              }}
            >
              Save to record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ───────────────────────────────────────────────────────── */
export default function VetAnimalView() {
  const params = useParams<{ id: string }>();
  const animalId = params.id ?? "";
  const animal = mockAnimals.find(a => a.id === animalId);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [showSoap, setShowSoap] = useState(false);
  const [selectedPriorProvider, setSelectedPriorProvider] = useState<any | null>(null);
  const [filterType, setFilterType] = useState("all");

  if (!animal) {
    return (
      <div style={{ padding: "3rem", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-body)", color: "rgba(25,30,46,0.70)" }}>Patient not found.</p>
        <Link href="/vet" style={{ color: "var(--blue)", fontFamily: "var(--font-body)", fontSize: "0.85rem" }}>← Back to caseload</Link>
      </div>
    );
  }

  const records = mockRecords.filter(r => r.animalId === animalId);
  const careTeam = mockCareTeam.filter(m => m.animalId === animalId);
  const currentProviders = careTeam.map(m => m.name);
  const priorCareTeam = mockPriorCareTeam[animalId] ?? [];
  const review = mockPatientReviews[animalId];
  const healthStats: HealthStat[] = mockVetHealthStats[animalId] ?? [];
  const photo = horsePhotos[animalId];

  const filterTypes = ["all", "vet_note", "lab", "imaging", "routine"];
  const filterLabels: Record<string, string> = { all: "All", vet_note: "Vet Notes", lab: "Lab", imaging: "Imaging", routine: "Routine" };
  const filteredRecords = filterType === "all" ? records : records.filter(r => r.type === filterType);

  // Group by season
  const grouped = filteredRecords.reduce<Record<string, Record[]>>((acc, r) => {
    acc[r.season] = acc[r.season] ?? [];
    acc[r.season].push(r);
    return acc;
  }, {});
  const seasons = SEASON_ORDER.filter(s => grouped[s]?.length);
  const age = Math.floor((Date.now() - new Date(animal.dob).getTime()) / (365.25 * 24 * 3600 * 1000));
  const conditions: string[] = JSON.parse(animal.activeConditions);
  const medications: string[] = JSON.parse(animal.activeMedications);
  const nextCare: string[] = JSON.parse(animal.nextScheduledCare);

  const statusColors: Record<string, string> = { monitoring: "var(--amber)", stable: "#2e7d52", urgent: "#c0392b" };
  const statusColor = statusColors[animal.patientStatus] ?? "#2e7d52";

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "2rem 1.5rem" }}>

      {/* ── Vet context banner ──────────────────────────────────────────── */}
      <div style={{
        background: "var(--blue)", borderRadius: 6, padding: "0.6rem 1.1rem",
        marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem",
      }}>
        <Activity size={13} color="white" style={{ opacity: 0.8 }} />
        <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.55rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)" }}>
          Permissioned access · {mockVetPractice.vetName} · {mockVetPractice.name} · READ+WRITE
        </p>
      </div>

      {/* ── Back + actions bar ──────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <Link href="/vet" style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--navy)", textDecoration: "none", fontFamily: "var(--font-courier)", fontSize: "0.58rem", letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.75 }}>
          <ChevronLeft size={13} /> Back to caseload
        </Link>
        <button
          data-testid="btn-add-soap"
          onClick={() => setShowSoap(true)}
          style={{
            background: "var(--navy)", border: "none", borderRadius: 5,
            padding: "0.55rem 1.1rem", cursor: "pointer",
            fontFamily: "var(--font-courier)", fontSize: "0.58rem",
            letterSpacing: "0.07em", textTransform: "uppercase", color: "white",
          }}
        >
          + Add clinical note
        </button>
      </div>

      {/* ── Patient header ──────────────────────────────────────────────── */}
      <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: "1.5rem" }}>

        {/* Identity band */}
        <div style={{ background: "var(--navy)", padding: "0.85rem 1.25rem", display: "flex", alignItems: "center", gap: "1.1rem" }}>
          {photo && (
            <img
              src={photo} alt={animal.name}
              style={{ width: 52, height: 52, borderRadius: 5, objectFit: "cover", objectPosition: "center top", flexShrink: 0, border: "2px solid rgba(255,255,255,0.12)" }}
            />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", flexWrap: "wrap", marginBottom: "0.2rem" }}>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "white", fontWeight: 400, lineHeight: 1.2 }}>{animal.name}</h1>
              <span style={{
                fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.08em",
                textTransform: "uppercase", color: statusColor,
                background: `${statusColor}22`, border: `1px solid ${statusColor}`,
                borderRadius: 3, padding: "0.15rem 0.5rem", fontWeight: 700,
              }}>
                {animal.patientStatus}
              </span>
            </div>
            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.48)", lineHeight: 1.5 }}>
              {animal.breed} · {animal.sex} · {age} yrs · DOB {animal.dob} · Chip {animal.microchip}
            </p>
          </div>
        </div>

        {/* Structured visit summary */}
        <div style={{ padding: "0.9rem 1.25rem", display: "flex", flexDirection: "column", gap: "0" }}>

          {/* Reason for visit */}
          <div style={{ paddingBottom: "0.75rem", borderBottom: "1px solid rgba(25,30,46,0.08)" }}>
            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", fontWeight: 700, marginBottom: "0.3rem" }}>
              Reason for Visit
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.85rem", color: "var(--navy)", lineHeight: 1.5 }}>
              {(animal as any).reasonForVisit ?? "—"}
            </p>
          </div>

          {/* Recent history */}
          <div style={{ padding: "0.75rem 0", borderBottom: "1px solid rgba(25,30,46,0.08)" }}>
            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(25,30,46,0.72)", fontWeight: 700, marginBottom: "0.3rem" }}>
              Recent History
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.8rem", color: "rgba(25,30,46,0.82)", lineHeight: 1.65 }}>
              {(animal as any).recentHistory ?? "—"}
            </p>
          </div>

          {/* Clinical background */}
          <div style={{ paddingTop: "0.75rem" }}>
            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(25,30,46,0.65)", fontWeight: 700, marginBottom: "0.3rem" }}>
              Clinical Background
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.8rem", color: "rgba(25,30,46,0.82)", lineHeight: 1.65 }}>
              {(animal as any).clinicalBackground ?? "—"}
            </p>
          </div>

        </div>
      </div>

      {/* ── Two-column layout ───────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "1.25rem", alignItems: "start" }}>

        {/* ── LEFT: Unified timeline ────────────────────────────────────── */}
        <div>
          {/* Timeline header + filters */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <div>
              <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: "0.3rem" }}>
                Longitudinal health record · All providers · All time
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.76rem", color: "rgba(25,30,46,0.80)", lineHeight: 1.5 }}>
                {filteredRecords.length} records · click any event to open
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <Filter style={{ width: 12, height: 12, color: "rgba(25,30,46,0.55)" }} />
              {filterTypes.map(t => (
                <button
                  key={t}
                  data-testid={`vet-filter-${t}`}
                  onClick={() => setFilterType(t)}
                  style={{
                    fontFamily: "var(--font-courier)", fontSize: "0.5625rem",
                    fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                    padding: "0.25rem 0.75rem", borderRadius: 4, border: "1px solid",
                    cursor: "pointer", transition: "all 0.15s",
                    background: filterType === t ? "var(--navy)" : "white",
                    color: filterType === t ? "white" : "rgba(25,30,46,0.55)",
                    borderColor: filterType === t ? "var(--navy)" : "rgba(25,30,46,0.15)",
                  }}
                >
                  {filterLabels[t]}
                </button>
              ))}
            </div>
          </div>

          {/* Source key */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(25,30,46,0.70)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--amber)", display: "inline-block" }} /> Significant event
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(25,30,46,0.70)" }}>
              <span style={{ width: 8, height: 3, borderRadius: 1, background: "#9b8ea0", display: "inline-block" }} /> Prior provider record
            </span>
          </div>

          {seasons.map(season => (
            <div key={season} style={{ marginBottom: "1.1rem" }}>
              {/* Year divider */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(25,30,46,0.55)", whiteSpace: "nowrap" }}>{season}</span>
                <div style={{ flex: 1, height: 1, background: "rgba(25,30,46,0.08)" }} />
              </div>

              {(grouped[season] ?? []).sort((a, b) => b.date.localeCompare(a.date)).map(record => {
                const isPrior = isPriorProvider(record, currentProviders);
                return (
                  <button
                    key={record.id}
                    data-testid={`vet-timeline-event-${record.id}`}
                    onClick={() => setSelectedRecord(record)}
                    style={{ width: "100%", textAlign: "left", background: "none", border: "none", padding: 0, cursor: "pointer", marginBottom: "0.35rem" }}
                  >
                    <div style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start" }}>
                      <div style={{ flexShrink: 0, paddingTop: 5 }}>
                        <div style={{
                          width: 10, height: 10, borderRadius: "50%",
                          background: record.isSignificant ? "var(--amber)" : "var(--linen-dark)",
                          border: "2px solid var(--linen)",
                          boxShadow: record.isSignificant ? "0 0 0 2px rgba(177,93,0,0.3)" : "none",
                        }} />
                      </div>
                      <div
                        className="card"
                        style={{
                          flex: 1, padding: "0.6rem 0.875rem",
                          borderLeft: isPrior ? "3px solid #9b8ea0" : "none",
                          transition: "box-shadow var(--transition), border-color var(--transition)",
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-lift)";
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-card)";
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.375rem" }}>
                              {record.isSignificant && <Star style={{ width: 11, height: 11, fill: "var(--amber)", color: "var(--amber)", flexShrink: 0 }} />}
                              <TypeBadge type={record.type} />
                              {isPrior && (
                                <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.48rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "#9b8ea0", background: "rgba(155,142,160,0.12)", borderRadius: 3, padding: "0.12rem 0.35rem" }}>
                                  Prior provider
                                </span>
                              )}
                              <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.5625rem", color: "rgba(25,30,46,0.58)", letterSpacing: "0.04em" }}>
                                {record.date}
                              </span>
                            </div>
                            <p style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", color: "var(--navy)", fontWeight: 400, marginBottom: "0.2rem", lineHeight: 1.3 }}>
                              {record.title}
                            </p>
                            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.56rem", letterSpacing: "0.04em", color: "rgba(25,30,46,0.68)", textTransform: "uppercase", marginBottom: "0.3rem" }}>
                              {record.provider} · {record.practice}
                            </p>
                            <p style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.8rem", color: "rgba(25,30,46,0.82)", lineHeight: 1.65 }}>
                              {record.summary}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* ── RIGHT: Clinical sidebar ───────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* 1. PATIENT SUMMARY — top */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>

            {/* Header band */}
            <div style={{ background: "var(--navy)", padding: "0.65rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.6rem", letterSpacing: "0.11em", textTransform: "uppercase", color: "white", fontWeight: 700 }}>Patient Summary</span>
              <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>At a glance</span>
            </div>

            <div style={{ padding: "0.9rem 1rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>

              {/* ── Clinical flags from review ── */}
              {review && (
                <div>
                  <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.56rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--amber)", fontWeight: 700, marginBottom: "0.55rem" }}>Clinical Status</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                    {review.items.slice(0, 5).map((item, i) => {
                      const dotColor =
                        item.status === "warning"    ? "var(--amber)" :
                        item.status === "monitoring" ? "var(--amber)" :
                        item.status === "active"     ? "var(--blue)"  :
                        item.status === "cleared"    ? "#2a7a4f"      :
                        "rgba(25,30,46,0.35)";
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: dotColor, flexShrink: 0, marginTop: 5 }} />
                          <div>
                            <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.8rem", color: "var(--navy)", lineHeight: 1.35 }}>{item.label}</p>
                            <p style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.78rem", color: "rgba(25,30,46,0.82)", lineHeight: 1.4 }}>{item.detail}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Divider ── */}
              {review && medications.length > 0 && <div style={{ height: 1, background: "rgba(25,30,46,0.08)" }} />}

              {/* ── Active medications ── */}
              {medications.length > 0 && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.55rem" }}>
                    <Pill size={11} color="var(--blue)" />
                    <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.56rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--blue)", fontWeight: 700 }}>Active Medications</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                    {medications.map((med, i) => (
                      <div key={i} style={{
                        display: "flex", alignItems: "flex-start", gap: "0.5rem",
                        background: "rgba(67,110,179,0.06)", borderRadius: 5,
                        padding: "0.35rem 0.6rem",
                        borderLeft: "2px solid var(--blue)",
                      }}>
                        <p style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.78rem", color: "var(--navy)", lineHeight: 1.45 }}>{med}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Divider ── */}
              {healthStats.length > 0 && <div style={{ height: 1, background: "rgba(25,30,46,0.08)" }} />}

              {/* ── Recent health statistics ── */}
              {healthStats.length > 0 && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.6rem" }}>
                    <TestTube size={11} color="rgba(25,30,46,0.6)" />
                    <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.56rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(25,30,46,0.65)", fontWeight: 700 }}>Recent Lab & Vitals</p>
                  </div>
                  {(() => {
                    const sourceGroups = healthStats.reduce<Record<string, HealthStat[]>>((acc, s) => {
                      acc[s.source] = acc[s.source] ?? [];
                      acc[s.source].push(s);
                      return acc;
                    }, {});
                    return Object.entries(sourceGroups).map(([src, stats]) => (
                      <div key={src} style={{ marginBottom: "0.75rem" }}>
                        <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(25,30,46,0.62)", marginBottom: "0.35rem", fontWeight: 700 }}>
                          {src} · {stats[0].date}
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                          {stats.map((stat, si) => {
                            const flagColor =
                              stat.flag === "high"  ? "#8a1a10" :
                              stat.flag === "low"   ? "#5a4800" :
                              stat.flag === "watch" ? "var(--amber)" :
                              "#2a7a4f";
                            return (
                              <div key={si} style={{
                                display: "flex", alignItems: "center",
                                justifyContent: "space-between",
                                padding: "0.3rem 0.5rem",
                                borderRadius: 4,
                                background: stat.flag !== "normal" ? `${flagColor}12` : "rgba(25,30,46,0.025)",
                              }}>
                                <span style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.8rem", color: "rgba(25,30,46,0.82)" }}>{stat.label}</span>
                                <span style={{ display: "flex", alignItems: "baseline", gap: "0.22rem", flexShrink: 0 }}>
                                  <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.84rem", color: flagColor }}>{stat.value}</span>
                                  {stat.unit && <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", color: "rgba(25,30,46,0.58)", letterSpacing: "0.04em" }}>{stat.unit}</span>}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ));
                  })()}
                  <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", color: "rgba(25,30,46,0.55)", letterSpacing: "0.05em", textTransform: "uppercase", marginTop: "0.15rem" }}>
                    Values from most recent encounter
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* 2. ACTIVE CLINICAL STATUS */}
          {(conditions.length > 0 || medications.length > 0) && (
            <div className="card" style={{ padding: "1rem 1.1rem" }}>
              <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--navy)", fontWeight: 700, marginBottom: "0.75rem", borderBottom: "2px solid var(--amber)", paddingBottom: "0.4rem" }}>Active Clinical Status</p>
              {conditions.length > 0 && (
                <div style={{ marginBottom: "0.75rem" }}>
                  <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.55rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--amber)", marginBottom: "0.4rem", fontWeight: 700 }}>Conditions</p>
                  {conditions.map((c, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem", marginBottom: "0.3rem" }}>
                      <AlertTriangle size={10} color="var(--amber)" style={{ flexShrink: 0, marginTop: 2 }} />
                      <p style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.8rem", color: "var(--navy)", lineHeight: 1.5 }}>{c}</p>
                    </div>
                  ))}
                </div>
              )}
              {medications.length > 0 && (
                <div>
                  <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.55rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--blue)", marginBottom: "0.4rem", fontWeight: 700 }}>Medications & Supplements</p>
                  {medications.map((m, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem", marginBottom: "0.3rem" }}>
                      <Activity size={10} color="var(--blue)" style={{ flexShrink: 0, marginTop: 2 }} />
                      <p style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.8rem", color: "rgba(25,30,46,0.85)", lineHeight: 1.5 }}>{m}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. SCHEDULED CARE */}
          {nextCare.length > 0 && (
            <div className="card" style={{ padding: "1rem 1.1rem" }}>
              <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--navy)", fontWeight: 700, marginBottom: "0.75rem", borderBottom: "2px solid var(--blue)", paddingBottom: "0.4rem" }}>Scheduled Care</p>
              {nextCare.map((n, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem", marginBottom: "0.5rem" }}>
                  <Clock size={10} color="var(--blue)" style={{ flexShrink: 0, marginTop: 3 }} />
                  <p style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.8rem", color: "rgba(25,30,46,0.85)", lineHeight: 1.5 }}>{n}</p>
                </div>
              ))}
            </div>
          )}

          {/* 4. CARE NETWORK */}
          <div className="card" style={{ padding: "1rem 1.1rem" }}>
            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--navy)", fontWeight: 700, marginBottom: "0.75rem", borderBottom: "2px solid rgba(25,30,46,0.12)", paddingBottom: "0.4rem" }}>Care Network</p>
            {careTeam.map(m => (
              <div key={m.id} style={{ marginBottom: "0.75rem", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(25,30,46,0.08)" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "0.84rem", color: "var(--navy)", fontWeight: 600 }}>{m.name}</p>
                <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(25,30,46,0.65)", marginBottom: "0.25rem" }}>{m.role}</p>
                {m.phone && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Phone size={9} color="var(--blue)" />
                    <span style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.7rem", color: "rgba(25,30,46,0.80)" }}>{m.phone}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 5. PRIOR CARE TEAM */}
          {priorCareTeam.length > 0 && (
            <div className="card" style={{ overflow: "hidden" }}>
              <div style={{ background: "rgba(155,142,160,0.18)", padding: "0.65rem 1rem", borderBottom: "2px solid rgba(155,142,160,0.35)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <History size={11} color="#6b5c78" />
                <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.6rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "#6b5c78", fontWeight: 700 }}>Prior Care Team</span>
              </div>
              <div style={{ padding: "0.6rem 0.85rem" }}>
                <p style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.76rem", color: "rgba(25,30,46,0.80)", lineHeight: 1.5, marginBottom: "0.55rem" }}>
                  Providers whose records appear in this timeline. Click any to view their history and records.
                </p>
                {priorCareTeam.map((prior: any) => {
                  const initials = prior.name.replace("Dr. ", "").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
                  return (
                    <button
                      key={prior.name}
                      onClick={() => setSelectedPriorProvider(prior)}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.5rem",
                        background: "none", border: "none", padding: "0.35rem 0.25rem",
                        cursor: "pointer", textAlign: "left", width: "100%",
                        borderRadius: 4, transition: "background 0.15s",
                      }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(155,142,160,0.14)")}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "none")}
                    >
                      <div style={{
                        width: 26, height: 26, borderRadius: "50%",
                        background: "rgba(107,92,120,0.15)", border: "1.5px solid rgba(107,92,120,0.4)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "var(--font-body)", fontSize: "0.5rem",
                        fontWeight: 700, color: "#6b5c78", flexShrink: 0,
                      }}>{initials}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 600, color: "var(--navy)", lineHeight: 1.3 }}>{prior.name}</p>
                        <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.58rem", color: "rgba(25,30,46,0.72)", letterSpacing: "0.04em" }}>{prior.role} · {prior.yearsActive}</p>
                      </div>
                      <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", color: "#6b5c78", fontWeight: 600 }}>
                        {prior.recordIds.length} rec{prior.recordIds.length !== 1 ? "s" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Record slide-over ───────────────────────────────────────────── */}
      {selectedRecord && <RecordSlideOver record={selectedRecord} onClose={() => setSelectedRecord(null)} />}

      {/* ── Prior provider modal ─────────────────────────────────────────── */}
      {selectedPriorProvider && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(25,30,46,0.4)" }} onClick={() => setSelectedPriorProvider(null)} />
          <div style={{ position: "relative", width: 460, height: "100vh", background: "var(--linen)", boxShadow: "-4px 0 32px rgba(25,30,46,0.18)", display: "flex", flexDirection: "column", overflowY: "auto" }}>
            <div style={{ background: "var(--navy)", padding: "1.25rem 1.5rem", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>Prior care team</span>
                <button onClick={() => setSelectedPriorProvider(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "1.1rem" }}>&times;</button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(155,142,160,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem", color: "white" }}>
                  {selectedPriorProvider.name.replace("Dr. ", "").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", color: "white", fontWeight: 400 }}>{selectedPriorProvider.name}</p>
                  <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "#9b8ea0", marginTop: "0.15rem" }}>{selectedPriorProvider.role}</p>
                  <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", color: "rgba(255,255,255,0.4)", marginTop: "0.1rem" }}>{selectedPriorProvider.practice}</p>
                </div>
              </div>
            </div>
            <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              <div className="card" style={{ padding: "1rem 1.1rem" }}>
                {[{ label: "Specialty", value: selectedPriorProvider.specialty }, { label: "Active period", value: selectedPriorProvider.yearsActive }, { label: "Relationship", value: selectedPriorProvider.relationship }].map((row: any) => (
                  <div key={row.label} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.6rem" }}>
                    <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--amber)", flexShrink: 0, minWidth: 85 }}>{row.label}</span>
                    <span style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.76rem", color: "var(--navy)", lineHeight: 1.5 }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding: "1rem 1.1rem" }}>
                <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(25,30,46,0.58)", marginBottom: "0.5rem" }}>Clinical context</p>
                <p style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.76rem", color: "rgba(25,30,46,0.7)", lineHeight: 1.7 }}>{selectedPriorProvider.notes}</p>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.55rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(25,30,46,0.58)", marginBottom: "0.6rem" }}>
                  Records on file &mdash; {records.filter((r: any) => selectedPriorProvider.recordIds.includes(r.id)).length}
                </p>
                {records.filter((r: any) => selectedPriorProvider.recordIds.includes(r.id)).map((rec: any) => (
                  <button key={rec.id} onClick={() => { setSelectedPriorProvider(null); setSelectedRecord(rec); }}
                    style={{ width: "100%", textAlign: "left", background: "white", border: "1px solid rgba(25,30,46,0.1)", borderLeft: "3px solid #9b8ea0", borderRadius: 6, padding: "0.75rem 1rem", marginBottom: "0.5rem", cursor: "pointer" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-lift)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = "none")}
                  >
                    <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", color: "rgba(25,30,46,0.58)", textTransform: "uppercase", marginBottom: "0.2rem" }}>{rec.date} &middot; {rec.type.replace("_", " ")}</p>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "0.875rem", color: "var(--navy)", fontWeight: 400 }}>{rec.title}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.71rem", color: "rgba(25,30,46,0.70)", marginTop: "0.2rem", lineHeight: 1.5 }}>{rec.summary}</p>
                    <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.48rem", color: "var(--blue)", marginTop: "0.35rem" }}>Open full record &rarr;</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SOAP composer ───────────────────────────────────────────────── */}
      {showSoap && <SoapComposer animalName={animal.name} onClose={() => setShowSoap(false)} />}
    </div>
  );
}
