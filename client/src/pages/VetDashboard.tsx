import { useState, useMemo } from "react";
import { Link } from "wouter";
import { mockVetPractice, mockVetCaseload } from "@/lib/mockData";
import { Activity, Clock, CalendarCheck, ChevronRight, Stethoscope, Search, Building2, X } from "lucide-react";

/* ── Status dot ─────────────────────────────────────────────────────────── */
function StatusDot({ status }: { status: "monitoring" | "stable" | "urgent" }) {
  const map = {
    monitoring: { bg: "var(--amber)", label: "Monitoring" },
    stable:     { bg: "#2a7a4f",     label: "Stable" },
    urgent:     { bg: "#b0291f",     label: "Urgent" },
  };
  const s = map[status] ?? map.stable;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.bg, flexShrink: 0 }} />
      <span style={{
        fontFamily: "var(--font-courier)", fontSize: "0.58rem",
        letterSpacing: "0.08em", textTransform: "uppercase", color: s.bg, fontWeight: 700,
      }}>
        {s.label}
      </span>
    </span>
  );
}

/* ── Urgency badge ──────────────────────────────────────────────────────── */
function UrgencyBadge({ urgency }: { urgency: "low" | "medium" | "high" }) {
  const map = {
    low:    { color: "rgba(25,30,46,0.4)", bg: "rgba(25,30,46,0.05)", label: "Routine" },
    medium: { color: "#8a4700",            bg: "rgba(177,93,0,0.08)", label: "Follow-up" },
    high:   { color: "#8a1a10",            bg: "rgba(176,41,31,0.08)", label: "Urgent" },
  };
  const u = map[urgency];
  return (
    <span style={{
      fontFamily: "var(--font-courier)", fontSize: "0.52rem",
      letterSpacing: "0.09em", textTransform: "uppercase",
      color: u.color, background: u.bg,
      border: `1px solid ${u.color}`,
      borderRadius: 4, padding: "0.2rem 0.5rem", fontWeight: 700,
    }}>
      {u.label}
    </span>
  );
}

/* ── Individual caseload card ───────────────────────────────────────────── */
type CaseloadEntry = typeof mockVetCaseload[number];

function CaseloadCard({ c }: { c: CaseloadEntry }) {
  const age = Math.floor((Date.now() - new Date(c.dob).getTime()) / (365.25 * 24 * 3600 * 1000));
  const isEPS = c.ownerName === "EPS Sport Horses";

  return (
    <Link href={`/vet/animals/${c.animalId}`} style={{ textDecoration: "none" }}>
      <div
        className="card"
        style={{
          padding: "1.25rem 1.4rem",
          cursor: "pointer",
          borderLeft: c.urgency === "medium" ? "3px solid var(--amber)"
                    : c.urgency === "high"   ? "3px solid #b0291f"
                    : "3px solid transparent",
          transition: "box-shadow 0.18s, border-color 0.18s",
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.boxShadow = "var(--shadow-lift)";
          if (c.urgency === "low") el.style.borderColor = "var(--blue)";
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.boxShadow = "var(--shadow-card)";
          if (c.urgency === "low") el.style.borderColor = "transparent";
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>

          {/* Icon */}
          <div style={{
            width: 42, height: 42, borderRadius: 8,
            background: isEPS ? "rgba(67,110,179,0.1)" : "hsl(38,33%,91%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, marginTop: 2,
          }}>
            <Stethoscope size={17} color="var(--navy)" style={{ opacity: 0.55 }} />
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Row 1: name + status + urgency */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap", marginBottom: "0.3rem" }}>
              <span style={{
                fontFamily: "var(--font-display)", fontSize: "1.05rem",
                color: "var(--navy)", fontWeight: 400, lineHeight: 1.2,
              }}>
                {c.animalName}
              </span>
              <StatusDot status={c.patientStatus} />
              <UrgencyBadge urgency={c.urgency} />
            </div>

            {/* Row 2: breed · age · sex */}
            <p style={{
              fontFamily: "var(--font-courier)", fontSize: "0.6rem",
              letterSpacing: "0.07em", textTransform: "uppercase",
              color: "rgba(25,30,46,0.5)", marginBottom: "0.55rem", fontWeight: 500,
            }}>
              {c.breed} · {age} yrs · {c.sex}
            </p>

            {/* Row 3: clinical note — much darker, larger */}
            <p style={{
              fontFamily: "var(--font-body)", fontWeight: 400,
              fontSize: "0.82rem", color: "rgba(25,30,46,0.78)",
              lineHeight: 1.6, marginBottom: "0.7rem",
            }}>
              {c.clinicalNote}
            </p>

            {/* Row 4: visit meta */}
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{
                display: "flex", alignItems: "center", gap: "0.3rem",
                fontFamily: "var(--font-courier)", fontSize: "0.56rem",
                letterSpacing: "0.05em", textTransform: "uppercase",
                color: "rgba(25,30,46,0.5)", fontWeight: 500,
              }}>
                <Clock size={11} color="rgba(25,30,46,0.45)" />
                Last visit {c.lastVisit}
              </span>
              <span style={{
                display: "flex", alignItems: "center", gap: "0.3rem",
                fontFamily: "var(--font-courier)", fontSize: "0.56rem",
                letterSpacing: "0.05em", textTransform: "uppercase",
                color: "rgba(25,30,46,0.5)", fontWeight: 500,
              }}>
                <CalendarCheck size={11} color="rgba(25,30,46,0.45)" />
                Next: {c.nextDue}
              </span>
              <span style={{
                display: "flex", alignItems: "center", gap: "0.3rem",
                fontFamily: "var(--font-courier)", fontSize: "0.56rem",
                letterSpacing: "0.05em", textTransform: "uppercase",
                color: "var(--blue)", fontWeight: 600,
              }}>
                <Activity size={11} color="var(--blue)" />
                {c.accessLevel}
              </span>
            </div>
          </div>

          <ChevronRight size={17} color="rgba(25,30,46,0.3)" style={{ flexShrink: 0, marginTop: 6 }} />
        </div>
      </div>
    </Link>
  );
}

/* ── Main page ──────────────────────────────────────────────────────────── */
export default function VetDashboard() {
  const { vetName, name: practiceName, initials } = mockVetPractice;
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<"flat" | "grouped">("grouped");

  const sorted = useMemo(() => {
    const rank: Record<string, number> = { high: 0, medium: 1, low: 2 };
    return [...mockVetCaseload].sort((a, b) => rank[a.urgency] - rank[b.urgency]);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(c =>
      c.animalName.toLowerCase().includes(q) ||
      c.ownerName.toLowerCase().includes(q) ||
      c.breed.toLowerCase().includes(q)
    );
  }, [query, sorted]);

  const grouped = useMemo(() => {
    const map = new Map<string, CaseloadEntry[]>();
    for (const c of filtered) {
      if (!map.has(c.ownerName)) map.set(c.ownerName, []);
      map.get(c.ownerName)!.push(c);
    }
    return map;
  }, [filtered]);

  const totalHorses = sorted.length;
  const followUpCount = sorted.filter(c => c.urgency === "medium" || c.urgency === "high").length;
  const hasResults = filtered.length > 0;
  const isSearching = query.trim().length > 0;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 1.5rem" }}>

      {/* ── Vet context banner ───────────────────────────────────────────── */}
      <div style={{
        background: "var(--navy)", borderRadius: 8,
        padding: "1.4rem 1.6rem", marginBottom: "2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "0.75rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "var(--blue)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "white",
          }}>
            {initials}
          </div>
          <div>
            <p style={{
              fontFamily: "var(--font-display)", fontSize: "1.05rem",
              color: "white", fontWeight: 400, marginBottom: "0.15rem",
            }}>
              {vetName}
            </p>
            <p style={{
              fontFamily: "var(--font-courier)", fontSize: "0.58rem",
              letterSpacing: "0.09em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.55)",
            }}>
              {practiceName}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "2rem" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.7rem", color: "white", lineHeight: 1 }}>
              {totalHorses}
            </p>
            <p style={{
              fontFamily: "var(--font-courier)", fontSize: "0.52rem",
              letterSpacing: "0.07em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)", marginTop: "0.25rem",
            }}>
              Active patients
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.7rem", color: "var(--amber)", lineHeight: 1 }}>
              {followUpCount}
            </p>
            <p style={{
              fontFamily: "var(--font-courier)", fontSize: "0.52rem",
              letterSpacing: "0.07em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)", marginTop: "0.25rem",
            }}>
              Need follow-up
            </p>
          </div>
        </div>
      </div>

      {/* ── Section header ───────────────────────────────────────────────── */}
      <div style={{ marginBottom: "1.5rem" }}>
        <p style={{
          fontFamily: "var(--font-courier)", fontSize: "0.62rem",
          letterSpacing: "0.11em", textTransform: "uppercase",
          color: "var(--amber)", marginBottom: "0.4rem", fontWeight: 700,
        }}>
          Permissioned caseload
        </p>
        <h1 style={{
          fontFamily: "var(--font-display)", fontSize: "1.5rem",
          color: "var(--navy)", fontWeight: 400, marginBottom: "0.4rem",
        }}>
          Your patients
        </h1>
        <p style={{
          fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.82rem",
          color: "rgba(25,30,46,0.6)", lineHeight: 1.65,
        }}>
          Each record below was shared with you by the horse's owner. You see the full longitudinal history — all providers, all time — on every patient.
        </p>
      </div>

      {/* ── Search bar + view toggle ─────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>

        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 260px", minWidth: 200 }}>
          <Search
            size={13}
            color="rgba(25,30,46,0.4)"
            style={{ position: "absolute", left: "0.8rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          />
          <input
            type="text"
            placeholder="Search by horse name or barn…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 2.3rem 0.6rem 2.2rem",
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              fontSize: "0.82rem",
              color: "var(--navy)",
              background: "white",
              border: "1px solid rgba(25,30,46,0.16)",
              borderRadius: 6,
              outline: "none",
              boxSizing: "border-box",
              boxShadow: "var(--shadow-card)",
              transition: "border-color 0.15s",
            }}
            onFocus={e => { e.currentTarget.style.borderColor = "var(--blue)"; }}
            onBlur={e => { e.currentTarget.style.borderColor = "rgba(25,30,46,0.16)"; }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{
                position: "absolute", right: "0.65rem", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", padding: 0,
                display: "flex", alignItems: "center",
              }}
            >
              <X size={13} color="rgba(25,30,46,0.4)" />
            </button>
          )}
        </div>

        {/* View toggle */}
        <div style={{
          display: "flex",
          border: "1px solid rgba(25,30,46,0.16)", borderRadius: 6,
          overflow: "hidden", flexShrink: 0,
          boxShadow: "var(--shadow-card)",
        }}>
          {(["grouped", "flat"] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: "0.5rem 0.9rem",
                fontFamily: "var(--font-courier)",
                fontSize: "0.54rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                border: "none",
                background: viewMode === mode ? "var(--navy)" : "white",
                color: viewMode === mode ? "white" : "rgba(25,30,46,0.5)",
                transition: "background 0.15s, color 0.15s",
                fontWeight: 600,
              }}
            >
              {mode === "grouped" ? (
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Building2 size={11} />
                  By Barn
                </span>
              ) : (
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Stethoscope size={11} />
                  All
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Result count while searching ─────────────────────────────────── */}
      {isSearching && (
        <p style={{
          fontFamily: "var(--font-courier)", fontSize: "0.56rem",
          letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 600,
          color: hasResults ? "rgba(25,30,46,0.45)" : "var(--amber)",
          marginBottom: "1rem",
        }}>
          {hasResults
            ? `${filtered.length} patient${filtered.length !== 1 ? "s" : ""} matching "${query}"`
            : `No patients match "${query}"`}
        </p>
      )}

      {/* ── Caseload list ────────────────────────────────────────────────── */}
      {hasResults ? (
        viewMode === "grouped" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {Array.from(grouped.entries()).map(([barnName, cases]) => (
              <div key={barnName}>
                {/* Barn header */}
                <div style={{
                  display: "flex", alignItems: "center", gap: "0.55rem",
                  marginBottom: "0.85rem",
                  paddingBottom: "0.6rem",
                  borderBottom: "2px solid rgba(25,30,46,0.1)",
                }}>
                  <Building2 size={14} color="var(--blue)" style={{ flexShrink: 0 }} />
                  <span style={{
                    fontFamily: "var(--font-display)", fontSize: "0.95rem",
                    color: "var(--navy)", fontWeight: 400,
                  }}>
                    {barnName}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-courier)", fontSize: "0.52rem",
                    letterSpacing: "0.07em", textTransform: "uppercase",
                    color: "rgba(25,30,46,0.38)", marginLeft: "0.2rem", fontWeight: 500,
                  }}>
                    · {cases.length} horse{cases.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {cases.map(c => <CaseloadCard key={c.animalId} c={c} />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {filtered.map(c => <CaseloadCard key={c.animalId} c={c} />)}
          </div>
        )
      ) : (
        /* Empty state */
        <div style={{
          padding: "3rem 1.5rem", textAlign: "center",
          background: "white", borderRadius: 8,
          border: "1px solid rgba(25,30,46,0.1)",
        }}>
          <Search size={26} color="rgba(25,30,46,0.2)" style={{ marginBottom: "0.85rem" }} />
          <p style={{
            fontFamily: "var(--font-display)", fontSize: "1.05rem",
            color: "var(--navy)", fontWeight: 400, marginBottom: "0.4rem",
          }}>
            No patients found
          </p>
          <p style={{
            fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.78rem",
            color: "rgba(25,30,46,0.45)", lineHeight: 1.65,
          }}>
            Try a different name or barn.
          </p>
          <button
            onClick={() => setQuery("")}
            style={{
              marginTop: "1.1rem",
              fontFamily: "var(--font-courier)", fontSize: "0.54rem",
              letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600,
              color: "var(--blue)", background: "none",
              border: "1px solid var(--blue)",
              borderRadius: 4, padding: "0.4rem 0.85rem", cursor: "pointer",
            }}
          >
            Clear search
          </button>
        </div>
      )}

      {/* ── Thesis footer ─────────────────────────────────────────────────── */}
      <div style={{
        marginTop: "2.5rem", padding: "1.1rem 1.4rem",
        background: "rgba(67,110,179,0.06)", borderRadius: 6,
        borderLeft: "3px solid var(--blue)",
      }}>
        <p style={{
          fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.8rem",
          color: "rgba(25,30,46,0.65)", lineHeight: 1.7,
        }}>
          <strong style={{ fontWeight: 600, color: "var(--navy)" }}>EQOS ark</strong> gives you a complete, structured history before you begin — imaging, labs, vet notes, and certificates from every provider, in one place. No scrambling for prior results. No relying on memory.
        </p>
      </div>

    </div>
  );
}
