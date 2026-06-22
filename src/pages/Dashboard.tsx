import { useState } from "react";
import { Link } from "wouter";
import { mockAnimals, mockCareTeam, mockPatientReviews, mockRecords } from "@/lib/mockData";
import type { Animal, CareTeamMember } from "@shared/schema";
import ProviderModal from "@/components/ProviderModal";
import RecordSlideOver from "@/components/RecordSlideOver";
import type { Record } from "@shared/schema";
import {
  AlertTriangle, CheckCircle, Clock, Activity,
  ChevronRight, Shield, ArrowRight, ChevronLeft,
} from "lucide-react";
import horseCopperfieldVDLImg from "@assets/horse-copperfield-vdl.jpg";
import horseSacardaImg from "@assets/horse-sacarda.jpg";

const horsePhotos: Record<string, string> = {
  "raloma":           horseCopperfieldVDLImg,
  "illusive-z":       horseSacardaImg,
  "independence-vdl": horseSacardaImg,   // placeholder until real photo added
};

/* ── Status badge ──────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  if (status === "stable")
    return <span className="status-badge badge-stable"><CheckCircle size={9} /> Stable</span>;
  if (status === "monitoring")
    return <span className="status-badge badge-monitor"><Activity size={9} /> Monitoring</span>;
  if (status === "warning")
    return <span className="status-badge badge-warning"><AlertTriangle size={9} /> Attention</span>;
  return <span className="status-badge badge-stable">{status}</span>;
}

/* ── Access tag ────────────────────────────────────────────────────── */
function AccessTag({ level }: { level: string }) {
  if (level === "READ+WRITE")  return <span className="access-tag access-rw">RW</span>;
  if (level === "READ+APPEND") return <span className="access-tag access-ra">R+A</span>;
  return <span className="access-tag access-r">READ</span>;
}

/* ── Review item helpers ───────────────────────────────────────────── */
function reviewColor(type: string) {
  if (type === "restriction") return { bg: "var(--amber-light)", border: "#e8c89a",          text: "var(--amber)" };
  if (type === "clearance")   return { bg: "var(--blue-light)",  border: "#9eb8e0",           text: "var(--blue)"  };
  if (type === "upcoming")    return { bg: "var(--linen)",       border: "var(--linen-dark)", text: "var(--navy)"  };
  if (type === "condition")   return { bg: "var(--amber-light)", border: "#e8c89a",           text: "var(--amber)" };
  if (type === "medication")  return { bg: "var(--blue-light)",  border: "#9eb8e0",           text: "var(--blue)"  };
  return { bg: "var(--linen)", border: "var(--linen-dark)", text: "var(--navy)" };
}

function ReviewIcon({ type }: { type: string }) {
  if (type === "restriction" || type === "condition") return <AlertTriangle size={11} style={{ color: "var(--amber)" }} />;
  if (type === "clearance" || type === "medication")  return <CheckCircle   size={11} style={{ color: "var(--blue)"  }} />;
  if (type === "upcoming")                            return <Clock         size={11} style={{ color: "var(--navy)"  }} />;
  return <Activity size={11} style={{ color: "var(--navy)" }} />;
}

/* ═══════════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<CareTeamMember | null>(null);
  const [selectedRecord,   setSelectedRecord]   = useState<Record | null>(null);

  const careTeam     = selectedAnimal ? mockCareTeam.filter(m => m.animalId === selectedAnimal.id) : [];
  const review       = selectedAnimal ? (mockPatientReviews[selectedAnimal.id] ?? null) : null;
  const animalRecords= selectedAnimal ? mockRecords.filter(r => r.animalId === selectedAnimal.id) : [];

  const conditions:  string[] = selectedAnimal ? JSON.parse(selectedAnimal.activeConditions  || "[]") : [];
  const medications: string[] = selectedAnimal ? JSON.parse(selectedAnimal.activeMedications || "[]") : [];
  const nextCare:    string[] = selectedAnimal ? JSON.parse(selectedAnimal.nextScheduledCare  || "[]") : [];

  return (
    <div className="page-wrap">

      {/* ── Page header ───────────────────────────────────────────── */}
      <div style={{ marginBottom: "2rem" }}>
        <span className="section-label">Owner Dashboard</span>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.75rem, 2.5vw + 0.75rem, 2.25rem)",
          fontWeight: 400, color: "var(--navy)", lineHeight: 1.15, marginBottom: "0.25rem",
        }}>
          Good evening, Leonard
        </h1>
        <p style={{
          fontFamily: "var(--font-courier)", fontSize: "0.6875rem",
          color: "var(--amber)", letterSpacing: "0.06em", textTransform: "uppercase",
        }}>
          Saturday, June 14, 2026 · EQOS Performance Sport
        </p>
      </div>

      {/* ── Main grid ─────────────────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "200px 1fr",
        gap: "2rem",
        alignItems: "start",
      }}>

        {/* ═══════ LEFT — Horse list + care team ═══════════════════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Horse list */}
          <div className="card card-navy-top" style={{ overflow: "hidden" }}>
            <div style={{ background: "var(--navy)", padding: "0.75rem 1rem" }}>
              <span style={{
                fontFamily: "var(--font-courier)", fontSize: "0.5rem",
                fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--amber)",
              }}>My Horses</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {mockAnimals.map((animal, idx) => {
                const photo    = horsePhotos[animal.id];
                const isActive = selectedAnimal?.id === animal.id;
                return (
                  <button
                    key={animal.id}
                    data-testid={`animal-card-${animal.id}`}
                    onClick={() => setSelectedAnimal(isActive ? null : animal)}
                    style={{
                      display: "block", width: "100%", textAlign: "left",
                      background: isActive ? "var(--navy)" : "white",
                      border: "none", padding: 0, cursor: "pointer",
                      borderTop: idx > 0 ? "1px solid rgba(25,30,46,0.08)" : "none",
                      transition: "background var(--transition)",
                    }}
                  >
                    {/* Photo strip */}
                    <div style={{ position: "relative" }}>
                      <img
                        src={photo}
                        alt={animal.name}
                        style={{
                          width: "100%",
                          aspectRatio: "5/3",
                          objectFit: "cover",
                          objectPosition: "center 20%",
                          display: "block",
                          opacity: isActive ? 0.85 : 1,
                        }}
                      />
                      {/* Status badge */}
                      <div style={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}>
                        <StatusBadge status={animal.patientStatus} />
                      </div>
                      {/* Name overlay */}
                      <div style={{
                        position: "absolute", bottom: 0, left: 0, right: 0,
                        background: "linear-gradient(to top, rgba(25,30,46,0.85) 0%, transparent 100%)",
                        padding: "1rem 0.75rem 0.5rem",
                      }}>
                        <p style={{
                          fontFamily: "var(--font-display)", fontSize: "0.9375rem",
                          color: "white", fontWeight: 400, lineHeight: 1.2,
                        }}>{animal.name}</p>
                        <p style={{
                          fontFamily: "var(--font-courier)", fontSize: "0.5rem",
                          color: "rgba(255,255,255,0.6)", letterSpacing: "0.06em",
                          textTransform: "uppercase",
                        }}>{animal.breed} · {animal.sex}</p>
                      </div>
                      {/* Active indicator */}
                      {isActive && (
                        <div style={{
                          position: "absolute", left: 0, top: 0, bottom: 0,
                          width: 3, background: "var(--amber)",
                        }} />
                      )}
                    </div>
                    {/* Footer */}
                    <div style={{
                      padding: "0.5rem 0.75rem",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                    }}>
                      <p style={{
                        fontFamily: "var(--font-body)", fontSize: "0.625rem",
                        fontWeight: 300,
                        color: isActive ? "rgba(255,255,255,0.5)" : "rgba(25,30,46,0.45)",
                      }}>
                        {animal.barn.split(" ").slice(0, 1).join("")} Center
                      </p>
                      <span style={{
                        fontFamily: "var(--font-body)", fontSize: "0.6875rem",
                        color: isActive ? "var(--amber)" : "var(--blue)",
                        fontWeight: 500,
                      }}>
                        {isActive ? "Selected" : "View ›"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Care team — only when animal selected */}
          {selectedAnimal && careTeam.length > 0 && (
            <div className="card card-amber-top">
              <div className="card-body">
                <span className="section-label" style={{ marginBottom: "0.75rem" }}>
                  {selectedAnimal.name} — Care Team
                </span>
                <hr className="divider" style={{ marginTop: 0 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  {careTeam.map(member => {
                    const initials = member.name
                      .replace("Dr. ", "").split(" ")
                      .map(w => w[0]).join("").slice(0, 2).toUpperCase();
                    return (
                      <button
                        key={member.id}
                        data-testid={`care-team-member-${member.id}`}
                        onClick={() => setSelectedProvider(member)}
                        style={{
                          display: "flex", alignItems: "flex-start", gap: "0.625rem",
                          background: "none", border: "none", padding: "0.375rem 0.25rem",
                          cursor: "pointer", textAlign: "left", borderRadius: "var(--radius-sm)",
                          width: "100%", transition: "background var(--transition)",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(67,110,179,0.07)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "none")}
                      >
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%",
                          background: "var(--blue-light)", border: "1px solid #9eb8e0",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "var(--font-body)", fontSize: "0.625rem",
                          fontWeight: 600, color: "var(--blue)", flexShrink: 0,
                        }}>{initials}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flexWrap: "wrap", marginBottom: "0.125rem" }}>
                            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 500, color: "var(--navy)" }}>
                              {member.name}
                            </p>
                            <AccessTag level={member.accessLevel} />
                          </div>
                          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.6875rem", fontWeight: 300, color: "rgba(25,30,46,0.55)" }}>
                            {member.role}
                          </p>
                          <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.5625rem", color: "rgba(25,30,46,0.38)", marginTop: "0.0625rem", letterSpacing: "0.04em" }}>
                            {member.lastContact}
                          </p>
                        </div>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--blue)", flexShrink: 0, alignSelf: "center" }}>›</span>
                      </button>
                    );
                  })}
                </div>
                <div style={{ marginTop: "1rem", paddingTop: "0.875rem", borderTop: "1px solid rgba(25,30,46,0.09)" }}>
                  <Link href="/access" style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--amber)", textDecoration: "none", fontWeight: 500 }}>
                    <Shield size={12} /> Manage Access
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ═══════ RIGHT — Content panel ═══════════════════════════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* No animal selected — prompt */}
          {!selectedAnimal && (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              minHeight: 320, background: "white",
              borderRadius: "var(--radius-lg)", border: "1px solid rgba(25,30,46,0.08)",
              boxShadow: "var(--shadow-card)", padding: "3rem 2rem", textAlign: "center",
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: "var(--linen)", border: "1px solid var(--linen-dark)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "1.25rem",
              }}>
                <ChevronLeft size={20} style={{ color: "var(--navy)", opacity: 0.35 }} />
              </div>
              <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.25rem", color: "var(--navy)", marginBottom: "0.5rem" }}>
                Select a horse to begin
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.8125rem", color: "rgba(25,30,46,0.45)", maxWidth: 280, lineHeight: 1.7 }}>
                Choose any horse from the list on the left to view their opening summary, patient review, and full record.
              </p>
            </div>
          )}

          {/* Opening Summary — navy card */}
          {selectedAnimal && (
            <div style={{
              background: "var(--navy)", borderRadius: "var(--radius-lg)",
              padding: "1.75rem", boxShadow: "var(--shadow-lift)",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div>
                  <span className="section-label-light" style={{ color: "var(--amber)", marginBottom: "0.375rem" }}>Opening Summary</span>
                  <h2 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.5rem", fontWeight: 400, color: "white", lineHeight: 1.15 }}>
                    {selectedAnimal.name}
                  </h2>
                </div>
                <StatusBadge status={selectedAnimal.patientStatus} />
              </div>

              <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.875rem", color: "var(--text-on-dark)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
                {selectedAnimal.openingSummary}
              </p>

              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem",
                paddingTop: "1.25rem", borderTop: "1px solid rgba(255,255,255,0.12)",
              }}>
                {[
                  { title: "Active Conditions", items: conditions },
                  { title: "Medications",       items: medications },
                  { title: "Upcoming Care",     items: nextCare },
                ].map(({ title, items }) => (
                  <div key={title}>
                    <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.5625rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)", marginBottom: "0.5rem" }}>
                      {title}
                    </p>
                    {items.length === 0 ? (
                      <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>None noted</p>
                    ) : (
                      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                        {items.map((item, i) => (
                          <li key={i} style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.8125rem", color: "var(--text-on-dark)", paddingLeft: "0.875rem", position: "relative", lineHeight: 1.55 }}>
                            <span style={{ position: "absolute", left: 0, color: "rgba(255,255,255,0.3)" }}>—</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Patient Review */}
          {selectedAnimal && review && (
            <div className="card card-navy-top">
              <div className="card-body">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div>
                    <span className="section-label" style={{ marginBottom: "0.125rem" }}>
                      Patient Review — {selectedAnimal.name}
                    </span>
                    <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.8125rem", color: "rgba(25,30,46,0.55)" }}>
                      Active items requiring owner awareness
                    </p>
                  </div>
                  <Link
                    href={`/animals/${selectedAnimal.id}`}
                    className="btn btn-outline btn-sm"
                    style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.25rem" }}
                    data-testid="link-view-record"
                  >
                    Full Record <ChevronRight size={12} />
                  </Link>
                </div>

                {/* Review items — two-column grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  {review.items.map((item, i) => {
                    const c = reviewColor(item.type);
                    return (
                      <div key={i} style={{
                        display: "flex", alignItems: "flex-start", gap: "0.5rem",
                        padding: "0.5rem 0.75rem",
                        background: c.bg, border: `1px solid ${c.border}`,
                        borderRadius: "var(--radius-sm)",
                      }}>
                        <span style={{ flexShrink: 0, marginTop: 2 }}><ReviewIcon type={item.type} /></span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 600, color: c.text, display: "block", lineHeight: 1.3 }}>
                            {item.label}
                          </span>
                          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.6875rem", fontWeight: 300, color: "rgba(25,30,46,0.55)", lineHeight: 1.4 }}>
                            {item.detail}
                          </span>
                          {item.date && (
                            <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", color: "rgba(25,30,46,0.35)", letterSpacing: "0.04em", display: "block", marginTop: 2 }}>
                              {item.date}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* CTA row: Timeline + Health Analytics */}
          {selectedAnimal && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Link href={`/animals/${selectedAnimal.id}`} style={{ textDecoration: "none", display: "block" }}>
                <div
                  className="card"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "1.25rem 1.5rem", cursor: "pointer",
                    transition: "box-shadow var(--transition)", borderLeft: "3px solid var(--blue)",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-lift)"}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-card)"}
                  data-testid="link-timeline"
                >
                  <div>
                    <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.0625rem", color: "var(--navy)", marginBottom: "0.25rem" }}>
                      Longitudinal Timeline
                    </p>
                    <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.5625rem", color: "var(--amber)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Full record history · click any event to open
                    </p>
                  </div>
                  <ArrowRight size={18} style={{ color: "var(--blue)", flexShrink: 0 }} />
                </div>
              </Link>

              <Link href={`/animals/${selectedAnimal.id}/health`} style={{ textDecoration: "none", display: "block" }}>
                <div
                  className="card"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "1.25rem 1.5rem", cursor: "pointer",
                    transition: "box-shadow var(--transition)", borderLeft: "3px solid var(--amber)",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-lift)"}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-card)"}
                  data-testid="link-health-dashboard"
                >
                  <div>
                    <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.0625rem", color: "var(--navy)", marginBottom: "0.25rem" }}>
                      Health Analytics
                    </p>
                    <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.5625rem", color: "var(--amber)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Weight · Lameness · Labs · Meds
                    </p>
                  </div>
                  <ArrowRight size={18} style={{ color: "var(--amber)", flexShrink: 0 }} />
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ──────────────────────────────────────────────────── */}
      <ProviderModal
        member={selectedProvider}
        records={animalRecords}
        onClose={() => setSelectedProvider(null)}
        onOpenRecord={(rec) => { setSelectedProvider(null); setSelectedRecord(rec); }}
      />
      <RecordSlideOver record={selectedRecord} onClose={() => setSelectedRecord(null)} />

    </div>
  );
}
