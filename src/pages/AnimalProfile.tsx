import { useState } from "react";
import { useParams, Link } from "wouter";
import { mockAnimals, mockRecords, mockCareTeam, mockPatientReview, mockPriorCareTeam } from "@/lib/mockData";
import type { PriorProvider } from "@/lib/mockData";
import type { Record, CareTeamMember } from "@shared/schema";
import RecordSlideOver from "@/components/RecordSlideOver";
import ProviderModal from "@/components/ProviderModal";
import {
  ChevronLeft, Star, CheckCircle, Activity, AlertTriangle,
  FlaskConical, FileText, Scan, Scissors, Clock, Filter,
  History, ExternalLink, ChevronDown, ChevronUp,
} from "lucide-react";
import horseCopperfieldVDLImg from "@assets/horse-copperfield-vdl.jpg";
import horseSacardaImg from "@assets/horse-sacarda.jpg";

const horsePhotos: Record<string, string> = {
  "raloma":           horseCopperfieldVDLImg,
  "illusive-z":       horseSacardaImg,
  "independence-vdl": horseSacardaImg,
};

const SEASON_ORDER = [
  "Spring 2026", "Early 2026", "Autumn 2025", "Late 2025",
  "Spring 2025", "Early 2025", "Summer 2023", "Autumn 2023",
  "Spring 2023", "Summer 2022", "Autumn 2022", "Summer 2021",
  "Autumn 2021", "Summer 2020",
];

/* ── Record type badge — brand tokens ─────────────────────────────── */
function TypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    lab:      "type-lab",
    imaging:  "type-imaging",
    vet_note: "type-vet_note",
    routine:  "type-routine",
  };
  const labels: Record<string, string> = {
    lab: "Lab", imaging: "Imaging", vet_note: "Vet Note", routine: "Routine",
  };
  return (
    <span className={`type-badge ${map[type] ?? "type-vet_note"}`}>
      <TypeIcon type={type} size={10} />
      {labels[type] ?? type}
    </span>
  );
}

function TypeIcon({ type, size = 12 }: { type: string; size?: number }) {
  const s = { width: size, height: size };
  const map: Record<string, JSX.Element> = {
    lab:      <FlaskConical style={s} />,
    imaging:  <Scan style={s} />,
    vet_note: <FileText style={s} />,
    routine:  <Scissors style={s} />,
  };
  return map[type] ?? <FileText style={s} />;
}

/* ── Timeline card ────────────────────────────────────────────────── */
function TimelineCard({ record, onClick }: { record: Record; onClick: (r: Record) => void }) {
  return (
    <button
      data-testid={`timeline-event-${record.id}`}
      onClick={() => onClick(record)}
      style={{
        width: "100%", textAlign: "left",
        background: "none", border: "none", padding: 0,
        cursor: "pointer", marginBottom: "0.625rem",
      }}
    >
      <div style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start" }}>
        {/* Timeline dot */}
        <div style={{ flexShrink: 0, paddingTop: 5 }}>
          <div style={{
            width: 10, height: 10, borderRadius: "50%",
            background: record.isSignificant ? "var(--amber)" : "var(--linen-dark)",
            border: "2px solid var(--linen)",
            boxShadow: record.isSignificant ? "0 0 0 2px rgba(177,93,0,0.3)" : "none",
          }} />
        </div>

        {/* Card */}
        <div
          className="card"
          style={{ flex: 1, padding: "0.875rem 1rem", transition: "box-shadow var(--transition), border-color var(--transition)" }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.boxShadow = "var(--shadow-lift)";
            el.style.borderColor = "var(--blue)";
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.boxShadow = "var(--shadow-card)";
            el.style.borderColor = "rgba(25,30,46,0.10)";
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.375rem" }}>
                {record.isSignificant && (
                  <Star style={{ width: 11, height: 11, fill: "var(--amber)", color: "var(--amber)", flexShrink: 0 }} />
                )}
                <TypeBadge type={record.type} />
                <span style={{
                  fontFamily: "var(--font-courier)", fontSize: "0.58rem",
                  color: "rgba(25,30,46,0.58)", letterSpacing: "0.04em",
                }}>
                  {record.date}
                </span>
              </div>
              <p style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.9375rem",
                color: "var(--navy)",
                fontWeight: 400,
                marginBottom: "0.25rem",
                lineHeight: 1.3,
              }}>
                {record.title}
              </p>
              <p style={{
                fontFamily: "var(--font-body)", fontWeight: 400,
                fontSize: "0.78rem", color: "rgba(25,30,46,0.78)",
                lineHeight: 1.65,
              }}>
                {record.summary}
              </p>
              <p style={{
                fontFamily: "var(--font-courier)", fontSize: "0.58rem",
                color: "rgba(25,30,46,0.55)", marginTop: "0.375rem",
                letterSpacing: "0.04em",
              }}>
                {record.provider}{record.practice ? ` · ${record.practice}` : ""}
              </p>
            </div>
            <span style={{
              fontFamily: "var(--font-body)", fontSize: "0.75rem",
              color: "var(--blue)", flexShrink: 0, marginLeft: "0.75rem",
            }}>
              Open →
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */

/* ── Prior Provider Modal ──────────────────────────────────────────── */
function PriorProviderModal({ provider, records, onClose, onOpenRecord }: {
  provider: any;
  records: any[];
  onClose: () => void;
  onOpenRecord: (r: any) => void;
}) {
  const providerRecords = records.filter((r: any) => provider.recordIds.includes(r.id));
  const initials = provider.name.replace("Dr. ", "").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(25,30,46,0.4)" }} onClick={onClose} />
      <div style={{
        position: "relative", width: 460, height: "100vh",
        background: "var(--linen)", boxShadow: "-4px 0 32px rgba(25,30,46,0.18)",
        display: "flex", flexDirection: "column", overflowY: "auto",
      }}>
        <div style={{ background: "var(--navy)", padding: "1.25rem 1.5rem", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
              Prior care team
            </span>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "1.1rem", lineHeight: 1 }}>&times;</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
            <div style={{
              width: 42, height: 42, borderRadius: "50%",
              background: "rgba(155,142,160,0.35)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem", color: "white",
            }}>{initials}</div>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", color: "white", fontWeight: 400 }}>{provider.name}</p>
              <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "#9b8ea0", marginTop: "0.15rem" }}>{provider.role}</p>
              <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.05em", color: "rgba(255,255,255,0.4)", marginTop: "0.1rem" }}>{provider.practice}</p>
            </div>
          </div>
        </div>
        <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          <div className="card" style={{ padding: "1rem 1.1rem" }}>
            {[
              { label: "Specialty", value: provider.specialty },
              { label: "Active period", value: provider.yearsActive },
              { label: "Relationship", value: provider.relationship },
            ].map((row: any) => (
              <div key={row.label} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.6rem", alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--amber)", flexShrink: 0, minWidth: 85, paddingTop: 1 }}>{row.label}</span>
                <span style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.8rem", color: "var(--navy)", lineHeight: 1.5 }}>{row.value}</span>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: "1rem 1.1rem" }}>
            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(25,30,46,0.62)", marginBottom: "0.5rem" }}>Clinical context</p>
            <p style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.8rem", color: "rgba(25,30,46,0.82)", lineHeight: 1.7 }}>{provider.notes}</p>
          </div>
          {providerRecords.length > 0 && (
            <div>
              <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.58rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(25,30,46,0.62)", marginBottom: "0.6rem" }}>
                Records on file &mdash; {providerRecords.length}
              </p>
              {providerRecords.map((rec: any) => (
                <button
                  key={rec.id}
                  onClick={() => onOpenRecord(rec)}
                  style={{
                    width: "100%", textAlign: "left", background: "white",
                    border: "1px solid rgba(25,30,46,0.1)", borderLeft: "3px solid #9b8ea0",
                    borderRadius: 6, padding: "0.75rem 1rem", marginBottom: "0.5rem",
                    cursor: "pointer", transition: "box-shadow 0.15s",
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-lift)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = "none")}
                >
                  <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.05em", color: "rgba(25,30,46,0.38)", textTransform: "uppercase", marginBottom: "0.2rem" }}>{rec.date} &middot; {rec.type.replace("_", " ")}</p>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "0.875rem", color: "var(--navy)", fontWeight: 400 }}>{rec.title}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.76rem", color: "rgba(25,30,46,0.72)", marginTop: "0.2rem", lineHeight: 1.5 }}>{rec.summary}</p>
                  <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.48rem", color: "var(--blue)", marginTop: "0.35rem", letterSpacing: "0.04em" }}>Open full record &rarr;</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AnimalProfile() {
  const { id } = useParams();
  const animal = mockAnimals.find(a => a.id === id);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [selectedProvider, setSelectedProvider] = useState<CareTeamMember | null>(null);
  const [selectedPriorProvider, setSelectedPriorProvider] = useState<any | null>(null);
  const animalCareTeam = mockCareTeam.filter(m => m.animalId === id);
  const priorCareTeam = mockPriorCareTeam[id ?? ""] ?? [];

  if (!animal) {
    return (
      <div style={{ maxWidth: 600, margin: "4rem auto", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-body)", color: "rgba(25,30,46,0.55)", marginBottom: "1rem" }}>
          Animal not found.
        </p>
        <Link href="/">
          <a className="btn btn-blue btn-sm">← Back to Dashboard</a>
        </Link>
      </div>
    );
  }

  const photo      = horsePhotos[animal.id];
  const conditions = JSON.parse(animal.activeConditions)  as string[];
  const medications= JSON.parse(animal.activeMedications) as string[];
  const nextCare   = JSON.parse(animal.nextScheduledCare)  as string[];

  const allRecords     = mockRecords.filter(r => r.animalId === id);
  const unsortedRecords= allRecords.filter(r => !r.isSorted);
  const sortedRecords  = allRecords.filter(r => r.isSorted);
  const filteredSorted = filterType === "all"
    ? sortedRecords
    : sortedRecords.filter(r => r.type === filterType);

  const grouped: Record<string, Record[]> = {};
  for (const rec of filteredSorted) {
    if (!grouped[rec.season]) grouped[rec.season] = [];
    grouped[rec.season].push(rec);
  }

  const filterTypes  = ["all", "vet_note", "lab", "imaging", "routine"];
  const filterLabels: Record<string, string> = {
    all: "All", vet_note: "Vet Notes", lab: "Lab", imaging: "Imaging", routine: "Routine",
  };

  const statusIcon = {
    stable:     <CheckCircle style={{ width: 13, height: 13, color: "var(--blue)" }} />,
    monitoring: <Activity    style={{ width: 13, height: 13, color: "var(--amber)" }} />,
    urgent:     <AlertTriangle style={{ width: 13, height: 13, color: "#c53030" }} />,
  }[animal.patientStatus];

  const age = new Date().getFullYear() - new Date(animal.dob).getFullYear();

  return (
    <div style={{ maxWidth: 1160, margin: "0 auto", padding: "1.5rem 1rem" }}>

      {/* Back nav + Health Analytics toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <Link href="/">
          <button style={{
            display: "flex", alignItems: "center", gap: 5,
            fontFamily: "var(--font-body)", fontWeight: 300,
            fontSize: "0.8125rem", color: "rgba(25,30,46,0.5)",
            background: "none", border: "none", cursor: "pointer",
          }}
            data-testid="btn-back"
          >
            <ChevronLeft style={{ width: 15, height: 15 }} />
            My Animals
          </button>
        </Link>
        <Link href={`/animals/${id}/health`}>
          <button
            className="btn btn-outline btn-sm"
            style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}
            data-testid="btn-health-analytics"
          >
            Health Analytics ›
          </button>
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "1.5rem" }}>

        {/* ═══════ LEFT — Photo + Opening Summary (sticky) ═══════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ position: "sticky", top: 76, display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Horse photo — smaller */}
            {photo && (
              <div style={{
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                boxShadow: "var(--shadow-lift)",
                border: "1px solid rgba(25,30,46,0.10)",
              }}>
                <img
                  src={photo}
                  alt={animal.name}
                  style={{
                    width: "100%",
                    aspectRatio: "2/1",
                    objectFit: "cover",
                    objectPosition: "center 20%",
                    display: "block",
                  }}
                />
              </div>
            )}

            {/* Opening Summary card */}
            <div className="card" style={{ overflow: "hidden" }}>
              {/* Navy header */}
              <div style={{ background: "var(--navy)", padding: "1rem 1.125rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span style={{
                      fontFamily: "var(--font-courier)", fontSize: "0.5625rem",
                      color: "var(--amber)", textTransform: "uppercase",
                      letterSpacing: "0.1em", display: "block", marginBottom: "0.25rem",
                    }}>
                      Opening Summary
                    </span>
                    <h1 style={{
                      fontFamily: "var(--font-display)", fontStyle: "italic",
                      fontSize: "1.125rem", fontWeight: 400, color: "white",
                    }}>
                      {animal.name}
                    </h1>
                  </div>
                  {statusIcon && (
                    <div style={{
                      background: "rgba(255,255,255,0.12)", borderRadius: "50%",
                      width: 26, height: 26, display: "flex",
                      alignItems: "center", justifyContent: "center",
                    }}>
                      {statusIcon}
                    </div>
                  )}
                </div>
                <p style={{
                  fontFamily: "var(--font-courier)", fontSize: "0.5625rem",
                  color: "rgba(255,255,255,0.42)", marginTop: "0.375rem",
                  letterSpacing: "0.04em",
                }}>
                  {animal.breed} · {animal.sex} · {age}y · {animal.color}
                </p>
                {/* Foal date + microchip */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", marginTop: "0.5rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <span style={{
                      fontFamily: "var(--font-courier)", fontSize: "0.4375rem",
                      fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                      color: "var(--amber)",
                    }}>Foaled</span>
                    <span style={{
                      fontFamily: "var(--font-courier)", fontSize: "0.5rem",
                      color: "rgba(255,255,255,0.55)", letterSpacing: "0.04em",
                    }}>
                      {new Date(animal.dob).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <span style={{
                      fontFamily: "var(--font-courier)", fontSize: "0.4375rem",
                      fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                      color: "var(--amber)",
                    }}>Microchip</span>
                    <span style={{
                      fontFamily: "var(--font-courier)", fontSize: "0.5rem",
                      color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em",
                    }}>
                      {animal.microchip}
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary prose */}
              <div style={{ padding: "0.875rem 1.125rem", borderBottom: "1px solid rgba(25,30,46,0.08)" }}>
                <p style={{
                  fontFamily: "var(--font-body)", fontWeight: 300,
                  fontSize: "0.75rem", color: "rgba(25,30,46,0.65)", lineHeight: 1.75,
                }}>
                  {animal.openingSummary}
                </p>
              </div>

              {/* Conditions */}
              {conditions.length > 0 && (
                <div style={{ padding: "0.75rem 1.125rem", borderBottom: "1px solid rgba(25,30,46,0.08)" }}>
                  <span className="section-label" style={{ fontSize: "0.5625rem", marginBottom: "0.375rem" }}>
                    Active Conditions
                  </span>
                  {conditions.map((c, i) => (
                    <div key={i} style={{
                      display: "flex", gap: 5,
                      fontFamily: "var(--font-body)", fontWeight: 400,
                      fontSize: "0.78rem", color: "rgba(25,30,46,0.82)",
                      marginBottom: 3, lineHeight: 1.5,
                    }}>
                      <span style={{ color: "var(--amber)", flexShrink: 0 }}>•</span>{c}
                    </div>
                  ))}
                </div>
              )}

              {/* Medications */}
              {medications.length > 0 && (
                <div style={{ padding: "0.75rem 1.125rem", borderBottom: "1px solid rgba(25,30,46,0.08)" }}>
                  <span className="section-label" style={{ fontSize: "0.5625rem", marginBottom: "0.375rem" }}>
                    Active Medications
                  </span>
                  {medications.map((m, i) => (
                    <div key={i} style={{
                      display: "flex", gap: 5,
                      fontFamily: "var(--font-body)", fontWeight: 400,
                      fontSize: "0.78rem", color: "rgba(25,30,46,0.82)",
                      marginBottom: 3, lineHeight: 1.5,
                    }}>
                      <span style={{ color: "var(--blue)", flexShrink: 0 }}>•</span>{m}
                    </div>
                  ))}
                </div>
              )}

              {/* Upcoming care */}
              {nextCare.length > 0 && (
                <div style={{ padding: "0.75rem 1.125rem" }}>
                  <span className="section-label" style={{ fontSize: "0.5625rem", marginBottom: "0.375rem" }}>
                    Upcoming Care
                  </span>
                  {nextCare.map((n, i) => (
                    <div key={i} style={{
                      display: "flex", gap: 5, alignItems: "flex-start",
                      fontFamily: "var(--font-body)", fontWeight: 400,
                      fontSize: "0.78rem", color: "rgba(25,30,46,0.82)",
                      marginBottom: 5, lineHeight: 1.5,
                    }}>
                      <Clock style={{ width: 10, height: 10, color: "var(--amber)", flexShrink: 0, marginTop: 2 }} />
                      {n}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Care Team mini-card */}
            {animalCareTeam.length > 0 && (
              <div className="card card-amber-top">
                <div className="card-body">
                  <span className="section-label" style={{ marginBottom: "0.625rem" }}>Care Team</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {animalCareTeam.map(member => {
                      const initials = member.name
                        .replace("Dr. ", "").split(" ")
                        .map(w => w[0]).join("").slice(0, 2).toUpperCase();
                      return (
                        <button
                          key={member.id}
                          data-testid={`profile-care-team-${member.id}`}
                          onClick={() => setSelectedProvider(member)}
                          style={{
                            display: "flex", alignItems: "center", gap: "0.5rem",
                            background: "none", border: "none", padding: "0.3rem 0.25rem",
                            cursor: "pointer", textAlign: "left", width: "100%",
                            borderRadius: "var(--radius-sm)", transition: "background var(--transition)",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(67,110,179,0.07)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "none")}
                        >
                          <div style={{
                            width: 24, height: 24, borderRadius: "50%",
                            background: "var(--blue-light)", border: "1px solid #9eb8e0",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "var(--font-body)", fontSize: "0.5625rem",
                            fontWeight: 600, color: "var(--blue)", flexShrink: 0,
                          }}>{initials}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.6875rem", fontWeight: 500, color: "var(--navy)", lineHeight: 1.3 }}>
                              {member.name}
                            </p>
                            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", color: "rgba(25,30,46,0.45)", letterSpacing: "0.04em" }}>
                              {member.role}
                            </p>
                          </div>
                          <span style={{ color: "var(--blue)", fontSize: "0.875rem" }}>›</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Prior Care Team */}
            {priorCareTeam.length > 0 && (
              <div className="card" style={{ overflow: "hidden" }}>
                <div style={{ background: "rgba(155,142,160,0.15)", padding: "0.625rem 1rem", borderBottom: "1px solid rgba(155,142,160,0.2)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <History size={11} color="#9b8ea0" />
                    <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "#9b8ea0" }}>
                      Prior Care Team
                    </span>
                  </div>
                  <p style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.75rem", color: "rgba(25,30,46,0.72)", marginTop: "0.3rem", lineHeight: 1.5 }}>
                    Providers whose records appear in this horse's timeline. Click to view history and records.
                  </p>
                </div>
                <div style={{ padding: "0.625rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  {priorCareTeam.map((prior: any) => {
                    const initials = prior.name.replace("Dr. ", "").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
                    return (
                      <button
                        key={prior.name}
                        data-testid={`prior-provider-${prior.name.replace(/\s/g, "-")}`}
                        onClick={() => setSelectedPriorProvider(prior)}
                        style={{
                          display: "flex", alignItems: "center", gap: "0.5rem",
                          background: "none", border: "none", padding: "0.3rem 0.25rem",
                          cursor: "pointer", textAlign: "left", width: "100%",
                          borderRadius: "var(--radius-sm)", transition: "background var(--transition)",
                        }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(155,142,160,0.12)")}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "none")}
                      >
                        <div style={{
                          width: 24, height: 24, borderRadius: "50%",
                          background: "rgba(155,142,160,0.2)", border: "1px solid rgba(155,142,160,0.4)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "var(--font-body)", fontSize: "0.5rem",
                          fontWeight: 600, color: "#9b8ea0", flexShrink: 0,
                        }}>{initials}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", lineHeight: 1.3 }}>
                            {prior.name}
                          </p>
                          <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.56rem", color: "rgba(25,30,46,0.62)", letterSpacing: "0.04em" }}>
                            {prior.role} &middot; {prior.yearsActive}
                          </p>
                        </div>
                        <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.48rem", color: "#9b8ea0", letterSpacing: "0.04em" }}>
                          {prior.recordIds.length} rec{prior.recordIds.length !== 1 ? "s" : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Patient Review mini-card */}
            <div className="card card-blue-top">
              <div className="card-body">
                <span className="section-label" style={{ marginBottom: "0.625rem" }}>Patient Review</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  {mockPatientReview.items.map((item, i) => {
                    const colorMap: Record<string, { border: string; bg: string; text: string }> = {
                      medication:  { border: "#9eb8e0", bg: "var(--blue-light)", text: "var(--blue)" },
                      restriction: { border: "#e8c89a", bg: "var(--amber-light)", text: "var(--amber)" },
                      condition:   { border: "#e8c89a", bg: "var(--amber-light)", text: "var(--amber)" },
                      clearance:   { border: "#9eb8e0", bg: "var(--blue-light)", text: "var(--blue)" },
                      upcoming:    { border: "var(--linen-dark)", bg: "var(--linen)", text: "var(--navy)" },
                    };
                    const s = colorMap[item.type] ?? { border: "rgba(25,30,46,0.1)", bg: "white", text: "var(--navy)" };
                    return (
                      <div key={i} style={{
                        display: "flex", gap: 6, padding: "0.375rem 0.625rem",
                        borderRadius: "var(--radius-sm)",
                        border: `1px solid ${s.border}`, background: s.bg,
                      }}>
                        <span style={{
                          fontFamily: "var(--font-body)", fontSize: "0.6875rem",
                          fontWeight: 500, color: s.text, flexShrink: 0,
                        }}>
                          {item.label}
                        </span>
                        <span style={{
                          fontFamily: "var(--font-body)", fontWeight: 400,
                          fontSize: "0.78rem", color: "rgba(25,30,46,0.78)",
                        }}>
                          {item.detail}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ═══════ RIGHT — Timeline ═══════════════════════════════ */}
        <div>

          {/* Timeline header + filters */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-start", flexWrap: "wrap",
            gap: "0.75rem", marginBottom: "1.5rem",
          }}>
            <div>
              <span className="section-label">Longitudinal Record Timeline</span>
              <h2 style={{
                fontFamily: "var(--font-display)", fontSize: "1.25rem",
                fontWeight: 400, color: "var(--navy)",
              }}>
                {animal.name}
              </h2>
              <p style={{
                fontFamily: "var(--font-body)", fontWeight: 400,
                fontSize: "0.78rem", color: "rgba(25,30,46,0.65)", marginTop: "0.25rem",
              }}>
                {sortedRecords.length} records · newest to oldest · click any event to open
              </p>
            </div>

            {/* Filter pills */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <Filter style={{ width: 12, height: 12, color: "rgba(25,30,46,0.35)" }} />
              {filterTypes.map(t => (
                <button
                  key={t}
                  data-testid={`filter-${t}`}
                  onClick={() => setFilterType(t)}
                  style={{
                    fontFamily: "var(--font-courier)", fontSize: "0.5625rem",
                    fontWeight: 700, letterSpacing: "0.08em",
                    textTransform: "uppercase" as const,
                    padding: "0.25rem 0.75rem",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid",
                    cursor: "pointer",
                    transition: "all var(--transition)",
                    background: filterType === t ? "var(--navy)" : "white",
                    color: filterType === t ? "white" : "rgba(25,30,46,0.5)",
                    borderColor: filterType === t ? "var(--navy)" : "rgba(25,30,46,0.15)",
                  }}
                >
                  {filterLabels[t]}
                </button>
              ))}
            </div>
          </div>

          {/* Unsorted tray */}
          {unsortedRecords.length > 0 && (
            <div style={{
              background: "var(--amber-light)",
              border: "1px solid #e8c89a",
              borderRadius: "var(--radius-lg)",
              padding: "1rem 1.25rem",
              marginBottom: "1.5rem",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.5rem" }}>
                <div style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: "var(--amber)", animation: "pulse 2s infinite",
                }} />
                <span className="section-label" style={{ marginBottom: 0 }}>
                  Unsorted — Pending Review
                </span>
                <span style={{
                  fontFamily: "var(--font-courier)", fontSize: "0.5625rem",
                  background: "var(--amber)", color: "white",
                  borderRadius: "2px", padding: "0.1rem 0.4rem",
                }}>
                  {unsortedRecords.length}
                </span>
              </div>
              <p style={{
                fontFamily: "var(--font-body)", fontWeight: 400,
                fontSize: "0.78rem", color: "rgba(25,30,46,0.75)", marginBottom: "0.875rem",
              }}>
                Records uploaded by care team members not yet placed in the timeline.
              </p>
              {unsortedRecords.map(rec => (
                <button
                  key={rec.id}
                  data-testid={`unsorted-event-${rec.id}`}
                  onClick={() => setSelectedRecord(rec)}
                  className="card"
                  style={{
                    width: "100%", textAlign: "left", background: "white",
                    padding: "0.75rem 1rem", marginBottom: "0.5rem",
                    cursor: "pointer", border: "none", borderRadius: "var(--radius-md)",
                    boxShadow: "var(--shadow-card)", display: "block",
                    transition: "box-shadow var(--transition)",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-lift)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)"}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <TypeBadge type={rec.type} />
                        <span style={{
                          fontFamily: "var(--font-courier)", fontSize: "0.5625rem",
                          color: "rgba(25,30,46,0.38)", letterSpacing: "0.04em",
                        }}>
                          {rec.date}
                        </span>
                      </div>
                      <p style={{
                        fontFamily: "var(--font-display)", fontSize: "0.875rem",
                        color: "var(--navy)", fontWeight: 400,
                      }}>
                        {rec.title}
                      </p>
                      <p style={{
                        fontFamily: "var(--font-body)", fontWeight: 400,
                        fontSize: "0.78rem", color: "rgba(25,30,46,0.82)",
                      }}>
                        {rec.provider}
                      </p>
                    </div>
                    <span style={{
                      fontFamily: "var(--font-body)", fontSize: "0.75rem",
                      color: "var(--amber)",
                    }}>
                      Open →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Vertical timeline */}
          <div style={{ position: "relative" }}>
            {/* Spine line */}
            <div style={{
              position: "absolute", left: 4, top: 0, bottom: 0, width: 2,
              background: `linear-gradient(to bottom, var(--amber) 0%, var(--blue) 100%)`,
              opacity: 0.25, borderRadius: 2,
            }} />

            <div style={{ paddingLeft: "1.5rem" }}>
              {SEASON_ORDER.map(season => {
                const recs = grouped[season];
                if (!recs || recs.length === 0) return null;

                // Season label color — navy/blue/amber rotation
                const seasonColors: Record<string, { bg: string; text: string }> = {
                  "Spring 2026": { bg: "var(--navy)", text: "white" },
                  "Early 2026":  { bg: "var(--blue)", text: "white" },
                  "Late 2025":   { bg: "var(--amber)", text: "white" },
                  "Spring 2025": { bg: "var(--navy)", text: "white" },
                  "Early 2025":  { bg: "var(--linen-dark)", text: "var(--navy)" },
                };
                const sc = seasonColors[season] ?? { bg: "var(--navy)", text: "white" };

                return (
                  <div key={season} style={{ marginBottom: "1.5rem" }}>
                    {/* Season label row */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: "0.625rem",
                      marginLeft: "-1.5rem", marginBottom: "0.875rem",
                    }}>
                      <div style={{
                        width: 10, height: 10, borderRadius: "50%",
                        background: sc.bg,
                        border: "2px solid var(--linen)",
                        boxShadow: `0 0 0 2px ${sc.bg}50`,
                        flexShrink: 0,
                      }} />
                      <span style={{
                        fontFamily: "var(--font-courier)",
                        fontSize: "0.5625rem", fontWeight: 700,
                        letterSpacing: "0.08em", textTransform: "uppercase",
                        color: sc.text, background: sc.bg,
                        padding: "0.15rem 0.625rem",
                        borderRadius: "2px",
                      }}>
                        {season}
                      </span>
                      <span style={{
                        fontFamily: "var(--font-body)", fontWeight: 400,
                        fontSize: "0.75rem", color: "rgba(25,30,46,0.58)",
                      }}>
                        {recs.length} record{recs.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {recs
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .map(rec => (
                        <TimelineCard key={rec.id} record={rec} onClick={setSelectedRecord} />
                      ))
                    }
                  </div>
                );
              })}

              {filterType !== "all" && Object.keys(grouped).length === 0 && (
                <div style={{
                  textAlign: "center", padding: "3rem",
                  fontFamily: "var(--font-body)", fontWeight: 300,
                  color: "rgba(25,30,46,0.45)",
                }}>
                  No {filterLabels[filterType]} records found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <RecordSlideOver record={selectedRecord} onClose={() => setSelectedRecord(null)} />
      {selectedPriorProvider && (
        <PriorProviderModal
          provider={selectedPriorProvider}
          records={allRecords}
          onClose={() => setSelectedPriorProvider(null)}
          onOpenRecord={(rec) => { setSelectedPriorProvider(null); setSelectedRecord(rec); }}
        />
      )}
      <ProviderModal
        member={selectedProvider}
        records={allRecords}
        onClose={() => setSelectedProvider(null)}
        onOpenRecord={(rec) => { setSelectedProvider(null); setSelectedRecord(rec); }}
      />
    </div>
  );
}
