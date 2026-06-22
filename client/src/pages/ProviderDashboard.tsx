/**
 * ProviderDashboard — Stable manager view (MVP).
 * Pulls the provider's accessible animals from /api/animals (same endpoint
 * vets use via access_grants). Shows a horse list with care notes and
 * a daily schedule built from the horse data. No mock data — all real auth.
 */
import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import type { Animal } from "@shared/schema";
import {
  Clock, CalendarCheck, ChevronRight, AlertTriangle,
  CheckCircle, Activity, Utensils, Sun, Clipboard, Heart,
} from "lucide-react";

const BURG = "#8b1a2f";

// ── Status dot ───────────────────────────────────────────────────────────────
function StatusDot({ status }: { status: string }) {
  const map: Record<string, { bg: string; label: string }> = {
    monitoring: { bg: "var(--amber)", label: "Monitoring" },
    stable:     { bg: "#2a7a4f",     label: "Stable"     },
    urgent:     { bg: "#b0291f",     label: "Urgent"     },
  };
  const s = map[status] ?? map.stable;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.bg, flexShrink: 0 }} />
      <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.58rem", letterSpacing: "0.08em", textTransform: "uppercase", color: s.bg, fontWeight: 700 }}>
        {s.label}
      </span>
    </span>
  );
}

// ── Horse card ───────────────────────────────────────────────────────────────
function HorseCard({ animal }: { animal: Animal }) {
  const age = animal.dob
    ? Math.floor((Date.now() - new Date(animal.dob).getTime()) / (365.25 * 24 * 3600 * 1000))
    : null;

  const conditions: string[] = (() => {
    try { return JSON.parse(animal.activeConditions ?? "[]"); } catch { return []; }
  })();

  const hasConditions = conditions.length > 0;

  return (
    <Link href={`/provider/animals/${animal.id}`} style={{ textDecoration: "none" }}>
      <div
        className="card"
        style={{
          padding: "1.25rem 1.4rem", cursor: "pointer",
          borderLeft: animal.patientStatus === "monitoring" ? "3px solid var(--amber)"
                    : animal.patientStatus === "urgent"     ? "3px solid #b0291f"
                    : "3px solid transparent",
          transition: "box-shadow 0.18s, border-color 0.18s",
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.boxShadow = "var(--shadow-lift)";
          if (animal.patientStatus === "stable") el.style.borderColor = BURG;
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.boxShadow = "var(--shadow-card)";
          if (animal.patientStatus === "stable") el.style.borderColor = "transparent";
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>

          {/* Barn badge */}
          <div style={{
            width: 42, height: 42, borderRadius: 8, flexShrink: 0, marginTop: 2,
            background: `rgba(139,26,47,0.08)`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.44rem", letterSpacing: "0.05em", textTransform: "uppercase", color: BURG, fontWeight: 700 }}>Barn</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "0.65rem", color: BURG, lineHeight: 1.1, textAlign: "center", padding: "0 2px" }}>
              {animal.barn?.split(" ").slice(-1)[0] ?? "—"}
            </span>
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap", marginBottom: "0.25rem" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", color: "var(--navy)", fontWeight: 400 }}>
                {animal.name}
              </span>
              {animal.patientStatus && <StatusDot status={animal.patientStatus} />}
              {hasConditions && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "0.25rem",
                  fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.08em",
                  textTransform: "uppercase", color: "#8a4700",
                  background: "rgba(177,93,0,0.09)", border: "1px solid rgba(177,93,0,0.25)",
                  borderRadius: 4, padding: "0.2rem 0.5rem", fontWeight: 700,
                }}>
                  <AlertTriangle size={9} /> Active conditions
                </span>
              )}
            </div>

            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.6rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(25,30,46,0.5)", marginBottom: "0.5rem", fontWeight: 500 }}>
              {[animal.breed, age != null ? `${age} yrs` : null, animal.sex].filter(Boolean).join(" · ")}
            </p>

            {animal.recentHistory && (
              <p style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.82rem", color: "rgba(25,30,46,0.75)", lineHeight: 1.6, marginBottom: "0.6rem" }}>
                {animal.recentHistory.slice(0, 140)}{animal.recentHistory.length > 140 ? "…" : ""}
              </p>
            )}

            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
              {animal.primaryVet && (
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontFamily: "var(--font-courier)", fontSize: "0.56rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(25,30,46,0.5)", fontWeight: 500 }}>
                  <CalendarCheck size={11} color="rgba(25,30,46,0.4)" />
                  {animal.primaryVet}
                </span>
              )}
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontFamily: "var(--font-courier)", fontSize: "0.56rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(25,30,46,0.45)", fontWeight: 500 }}>
                <Activity size={11} color="rgba(25,30,46,0.35)" />
                Read access
              </span>
            </div>
          </div>

          <ChevronRight size={17} color="rgba(25,30,46,0.3)" style={{ flexShrink: 0, marginTop: 6 }} />
        </div>
      </div>
    </Link>
  );
}

// ── Schedule items — derived from animals ────────────────────────────────────
function buildSchedule(animals: Animal[]) {
  const items: { time: string; task: string; category: "feeding" | "turnout" | "health" | "facility" }[] = [
    { time: "06:30", task: "AM feeding — all horses", category: "feeding" },
  ];
  animals.forEach((a, i) => {
    const hr = 7 + i;
    const hh = hr.toString().padStart(2, "0");
    items.push({ time: `${hh}:00`, task: `${a.name} — morning turnout`, category: "turnout" });
  });
  items.push({ time: "09:00", task: "Stall cleaning — all blocks", category: "facility" });
  animals.forEach((a, i) => {
    if (a.patientStatus === "monitoring" || a.patientStatus === "urgent") {
      items.push({ time: `${10 + i}:00`, task: `${a.name} — health check per vet instructions`, category: "health" });
    }
  });
  items.push(
    { time: "12:00", task: "Midday hay check — replenish as needed", category: "feeding" },
    { time: "16:00", task: "PM feeding — all horses", category: "feeding" },
    { time: "16:30", task: "Evening barn check — water, bedding, observation", category: "facility" },
    { time: "17:00", task: "Log daily notes in EQOS ark", category: "health" },
  );
  return items.sort((a, b) => a.time.localeCompare(b.time));
}

function categoryStyle(cat: string): { icon: React.ReactNode; color: string; bg: string } {
  switch (cat) {
    case "feeding":  return { icon: <Utensils size={11} />,  color: "#5a7a3a", bg: "rgba(90,122,58,0.09)"   };
    case "turnout":  return { icon: <Sun size={11} />,        color: "var(--blue)", bg: "rgba(67,110,179,0.09)" };
    case "health":   return { icon: <Heart size={11} />,      color: BURG,     bg: "rgba(139,26,47,0.09)"   };
    case "facility": return { icon: <Clipboard size={11} />,  color: "rgba(25,30,46,0.5)", bg: "rgba(25,30,46,0.05)" };
    default:         return { icon: <Clock size={11} />,      color: "rgba(25,30,46,0.4)", bg: "rgba(25,30,46,0.05)" };
  }
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ProviderDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"horses" | "schedule">("horses");

  const { data: animals = [], isLoading, isError } = useQuery<Animal[]>({
    queryKey: ["/api/animals"],
    queryFn: async () => {
      const res = await fetch("/api/animals", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load animals");
      return res.json();
    },
  });

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const monitoringCount = animals.filter(a => a.patientStatus === "monitoring").length;
  const displayName = user ? `${user.firstName} ${user.lastName}` : "Care Provider";
  const initials = user ? (user.firstName[0] + (user.lastName[0] ?? "")).toUpperCase() : "CP";

  const schedule = buildSchedule(animals);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 1.5rem" }}>

      {/* ── Provider context banner ────────────────────────────────────── */}
      <div style={{
        background: "var(--navy)", borderRadius: 8, padding: "1.4rem 1.6rem",
        marginBottom: "2rem", display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%", background: BURG,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "white",
          }}>
            {initials}
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", color: "white", fontWeight: 400, marginBottom: "0.15rem" }}>
              {displayName}
            </p>
            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.58rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
              {user?.credentialType ?? "Care Provider"} · Stable Manager
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "2rem" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.7rem", color: "white", lineHeight: 1 }}>
              {isLoading ? "—" : animals.length}
            </p>
            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginTop: "0.25rem" }}>
              Assigned horses
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.7rem", color: monitoringCount > 0 ? "var(--amber)" : "white", lineHeight: 1 }}>
              {isLoading ? "—" : monitoringCount}
            </p>
            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginTop: "0.25rem" }}>
              Monitoring
            </p>
          </div>
        </div>
      </div>

      {/* ── Access notice ─────────────────────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center", gap: "0.6rem",
        background: "rgba(139,26,47,0.06)", border: "1px solid rgba(139,26,47,0.18)",
        borderRadius: 6, padding: "0.65rem 1rem", marginBottom: "1.75rem",
      }}>
        <CheckCircle size={13} color={BURG} style={{ flexShrink: 0 }} />
        <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.07em", textTransform: "uppercase", color: BURG, fontWeight: 600 }}>
          Permissioned access · {displayName} · Read only · Access controlled by horse owner
        </p>
      </div>

      {/* ── Tab bar ──────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 0, marginBottom: "1.5rem", border: "1px solid rgba(25,30,46,0.14)", borderRadius: 7, overflow: "hidden", width: "fit-content", boxShadow: "var(--shadow-card)" }}>
        {([
          { key: "horses",   label: "My Horses",       icon: <Heart size={12} /> },
          { key: "schedule", label: "Today's Schedule", icon: <Clock size={12} /> },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "0.55rem 1.1rem",
              fontFamily: "var(--font-courier)", fontSize: "0.56rem",
              letterSpacing: "0.09em", textTransform: "uppercase",
              fontWeight: 700, cursor: "pointer", border: "none",
              display: "flex", alignItems: "center", gap: "0.35rem",
              background: activeTab === tab.key ? "var(--navy)" : "white",
              color: activeTab === tab.key ? "white" : "rgba(25,30,46,0.5)",
              transition: "background 0.15s, color 0.15s",
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── Horses tab ──────────────────────────────────────────────── */}
      {activeTab === "horses" && (
        <>
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.62rem", letterSpacing: "0.11em", textTransform: "uppercase", color: BURG, marginBottom: "0.4rem", fontWeight: 700 }}>
              Assigned horses
            </p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--navy)", fontWeight: 400, marginBottom: "0.4rem" }}>
              Your stable
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.82rem", color: "rgba(25,30,46,0.6)", lineHeight: 1.65 }}>
              Each horse below has been permissioned to you by the owner. You can view veterinary status, health records, and exercise restrictions.
            </p>
          </div>

          {isLoading && (
            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.58rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(25,30,46,0.4)", padding: "2rem 0" }}>
              Loading horses…
            </p>
          )}
          {isError && (
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "#b0291f", padding: "1rem 0" }}>
              Unable to load assigned horses. Please refresh.
            </p>
          )}
          {!isLoading && !isError && animals.length === 0 && (
            <div style={{ background: "white", borderRadius: 8, border: "1px solid rgba(25,30,46,0.09)", padding: "2rem", textAlign: "center", boxShadow: "var(--shadow-card)" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "var(--navy)", fontWeight: 400, marginBottom: "0.4rem" }}>No horses assigned yet</p>
              <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.8rem", color: "rgba(25,30,46,0.5)" }}>
                Ask the horse owner to send you an invitation from their Access panel.
              </p>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {animals.map(a => <HorseCard key={a.id} animal={a} />)}
          </div>
        </>
      )}

      {/* ── Schedule tab ────────────────────────────────────────────── */}
      {activeTab === "schedule" && (
        <>
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.62rem", letterSpacing: "0.11em", textTransform: "uppercase", color: BURG, marginBottom: "0.4rem", fontWeight: 700 }}>
              Daily routine
            </p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--navy)", fontWeight: 400, marginBottom: "0.25rem" }}>
              Today's schedule
            </h1>
            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.58rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--amber)", fontWeight: 600 }}>
              {today}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {schedule.map((item, i) => {
              const cat = categoryStyle(item.category);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", background: "white", borderRadius: 7, border: "1px solid rgba(25,30,46,0.09)", padding: "0.8rem 1.1rem", boxShadow: "var(--shadow-card)" }}>
                  <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.7rem", fontWeight: 700, color: "var(--navy)", flexShrink: 0, minWidth: 38 }}>
                    {item.time}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", background: cat.bg, color: cat.color, fontFamily: "var(--font-courier)", fontSize: "0.48rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700, borderRadius: 4, padding: "0.2rem 0.5rem", flexShrink: 0 }}>
                    {cat.icon} {item.category}
                  </span>
                  <span style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.82rem", color: "rgba(25,30,46,0.8)", lineHeight: 1.4, flex: 1 }}>
                    {item.task}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── Thesis footer ─────────────────────────────────────────────── */}
      <div style={{ marginTop: "2.5rem", padding: "1.1rem 1.4rem", background: `rgba(139,26,47,0.05)`, borderRadius: 6, borderLeft: `3px solid ${BURG}` }}>
        <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.8rem", color: "rgba(25,30,46,0.65)", lineHeight: 1.7 }}>
          <strong style={{ fontWeight: 600, color: "var(--navy)" }}>EQOS ark</strong> gives every member of the care team — owner, veterinarian, and stable manager — the same complete picture. Exercise restrictions, upcoming vet care, and daily protocols are always current and accessible from any device.
        </p>
      </div>

    </div>
  );
}
