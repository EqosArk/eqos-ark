/**
 * ProviderAnimalView — Stable manager individual horse view (MVP).
 * Pulls animal data + records from real API. Read-only clinical records;
 * provider can view feeding/care info and vet status but cannot author clinical notes.
 */
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Animal, Record } from "@shared/schema";
import {
  ArrowLeft, Utensils, Sun, AlertTriangle, CalendarCheck,
  Lock, CheckCircle, FlaskConical, FileText, Scan, Scissors,
} from "lucide-react";

const BURG = "#8b1a2f";
const AMBER = "#b15d00";
const NAVY = "#191e2e";

// ── Record type badge ─────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = { lab: "Lab", imaging: "Imaging", vet_note: "Vet Note", routine: "Routine", document: "Document" };
  const icons: Record<string, React.ReactNode> = {
    lab:      <FlaskConical size={10} />,
    imaging:  <Scan size={10} />,
    vet_note: <FileText size={10} />,
    routine:  <Scissors size={10} />,
    document: <FileText size={10} />,
  };
  const colors: Record<string, { color: string; bg: string }> = {
    lab:      { color: "#2a7a4f", bg: "rgba(42,122,79,0.09)"   },
    imaging:  { color: "#5a4da8", bg: "rgba(90,77,168,0.09)"   },
    vet_note: { color: "#436eb3", bg: "rgba(67,110,179,0.09)"  },
    routine:  { color: "#7a5230", bg: "rgba(122,82,48,0.09)"   },
    document: { color: "rgba(25,30,46,0.5)", bg: "rgba(25,30,46,0.06)" },
  };
  const c = colors[type] ?? colors.document;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontFamily: "var(--font-courier)", fontSize: "0.48rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700, color: c.color, background: c.bg, borderRadius: 4, padding: "0.2rem 0.45rem" }}>
      {icons[type] ?? <FileText size={10} />} {labels[type] ?? type}
    </span>
  );
}

// ── Section wrapper ────────────────────────────────────────────────────────────
function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: "white", borderRadius: 8, border: "1px solid rgba(25,30,46,0.09)", boxShadow: "var(--shadow-card)", overflow: "hidden", marginBottom: "1rem" }}>
      <div style={{ background: NAVY, padding: "0.7rem 1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ color: AMBER, display: "flex", alignItems: "center" }}>{icon}</span>
        <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.1em", textTransform: "uppercase", color: AMBER, fontWeight: 700 }}>{title}</span>
      </div>
      <div style={{ padding: "1.25rem 1.4rem" }}>{children}</div>
    </div>
  );
}

// ── Info row ──────────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: "1rem", paddingBottom: "0.65rem", marginBottom: "0.65rem", borderBottom: "1px solid rgba(25,30,46,0.07)" }}>
      <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(25,30,46,0.45)", fontWeight: 600, minWidth: 110, flexShrink: 0 }}>{label}</span>
      <span style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.82rem", color: "rgba(25,30,46,0.82)", lineHeight: 1.6 }}>{value}</span>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ProviderAnimalView() {
  const { id } = useParams<{ id: string }>();

  const { data: animal, isLoading: loadingAnimal } = useQuery<Animal>({
    queryKey: [`/api/animals/${id}`],
    queryFn: async () => {
      const res = await fetch(`/api/animals/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
  });

  const { data: records = [], isLoading: loadingRecords } = useQuery<Record[]>({
    queryKey: [`/api/animals/${id}/records`],
    queryFn: async () => {
      const res = await fetch(`/api/animals/${id}/records`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load records");
      return res.json();
    },
    enabled: !!animal,
  });

  if (loadingAnimal) {
    return (
      <div style={{ maxWidth: 820, margin: "3rem auto", padding: "0 1.5rem", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(25,30,46,0.4)" }}>Loading…</p>
      </div>
    );
  }

  if (!animal) {
    return (
      <div style={{ maxWidth: 820, margin: "3rem auto", padding: "0 1.5rem", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: NAVY }}>Horse not found or access not granted.</p>
        <Link href="/provider">
          <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.58rem", color: AMBER, cursor: "pointer", letterSpacing: "0.07em", textTransform: "uppercase" }}>← Back to stable</span>
        </Link>
      </div>
    );
  }

  const age = animal.dob
    ? Math.floor((Date.now() - new Date(animal.dob).getTime()) / (365.25 * 24 * 3600 * 1000))
    : null;

  const conditions: string[] = (() => { try { return JSON.parse(animal.activeConditions ?? "[]"); } catch { return []; } })();
  const medications: string[] = (() => { try { return JSON.parse(animal.activeMedications ?? "[]"); } catch { return []; } })();
  const nextCare: string[] = (() => { try { return JSON.parse(animal.nextScheduledCare ?? "[]"); } catch { return []; } })();

  // Sort records newest first
  const sortedRecords = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "2.5rem 1.5rem" }}>

      {/* Back */}
      <Link href="/provider">
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontFamily: "var(--font-courier)", fontSize: "0.56rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(25,30,46,0.45)", cursor: "pointer", marginBottom: "1.5rem" }}>
          <ArrowLeft size={12} /> Back to stable
        </span>
      </Link>

      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 400, color: NAVY, marginBottom: "0.3rem" }}>
              {animal.name}
            </h1>
            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.6rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(25,30,46,0.5)", fontWeight: 500 }}>
              {[animal.breed, animal.sex, age != null ? `${age} yrs` : null, animal.barn].filter(Boolean).join(" · ")}
            </p>
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.08em", textTransform: "uppercase", color: BURG, background: "rgba(139,26,47,0.08)", border: "1px solid rgba(139,26,47,0.2)", borderRadius: 5, padding: "0.3rem 0.7rem", fontWeight: 700 }}>
            <Lock size={10} /> Read only
          </span>
        </div>
      </div>

      {/* Access notice */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: "rgba(139,26,47,0.06)", border: "1px solid rgba(139,26,47,0.15)", borderRadius: 6, padding: "0.65rem 1rem", marginBottom: "1.5rem" }}>
        <CheckCircle size={13} color={BURG} style={{ flexShrink: 0 }} />
        <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.07em", textTransform: "uppercase", color: BURG, fontWeight: 600 }}>
          Permissioned access · {animal.primaryVet ?? "Assigned vet"} · READ — stable management view
        </p>
      </div>

      {/* Active conditions banner */}
      {conditions.length > 0 && (
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", background: "rgba(177,93,0,0.08)", border: "1.5px solid rgba(177,93,0,0.3)", borderRadius: 7, padding: "1rem 1.2rem", marginBottom: "1.5rem" }}>
          <AlertTriangle size={16} color={AMBER} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.09em", textTransform: "uppercase", color: AMBER, fontWeight: 700, marginBottom: "0.4rem" }}>Active conditions — veterinary review</p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              {conditions.map((c, i) => (
                <li key={i} style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.82rem", color: "rgba(25,30,46,0.82)", paddingLeft: "0.8rem", position: "relative", lineHeight: 1.55 }}>
                  <span style={{ position: "absolute", left: 0, color: AMBER }}>—</span>{c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Two-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>

        {/* LEFT — daily care info */}
        <div>
          <Section title="Veterinary Status" icon={<CheckCircle size={13} />}>
            <InfoRow label="Primary Vet" value={animal.primaryVet ?? "—"} />
            <InfoRow label="Status" value={animal.patientStatus ? animal.patientStatus.charAt(0).toUpperCase() + animal.patientStatus.slice(1) : "—"} />
            <InfoRow label="Barn" value={animal.barn ?? "—"} />
            <InfoRow label="Discipline" value={animal.discipline ?? "—"} />
          </Section>

          {medications.length > 0 && (
            <Section title="Active Medications" icon={<Utensils size={13} />}>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {medications.map((m, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                    <span style={{ color: BURG, fontFamily: "var(--font-body)", fontSize: "0.82rem", flexShrink: 0, marginTop: 1 }}>—</span>
                    <span style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.82rem", color: "rgba(25,30,46,0.78)", lineHeight: 1.55 }}>{m}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {animal.recentHistory && (
            <Section title="Recent History" icon={<Sun size={13} />}>
              <p style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.82rem", color: "rgba(25,30,46,0.78)", lineHeight: 1.75 }}>{animal.recentHistory}</p>
            </Section>
          )}
        </div>

        {/* RIGHT — vet records read-only */}
        <div>
          {nextCare.length > 0 && (
            <Section title="Upcoming Care Schedule" icon={<CalendarCheck size={13} />}>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {nextCare.map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                    <CalendarCheck size={12} color={AMBER} style={{ flexShrink: 0, marginTop: 3 }} />
                    <span style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.8rem", color: "rgba(25,30,46,0.75)", lineHeight: 1.55 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Clinical records — read only */}
          <Section title="Clinical Records — Read Only" icon={<Lock size={13} />}>
            {loadingRecords ? (
              <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.56rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(25,30,46,0.35)" }}>Loading records…</p>
            ) : sortedRecords.length === 0 ? (
              <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.8rem", color: "rgba(25,30,46,0.45)", lineHeight: 1.6 }}>No records on file yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {sortedRecords.slice(0, 6).map(r => (
                  <div key={r.id} style={{ paddingBottom: "0.65rem", borderBottom: "1px solid rgba(25,30,46,0.07)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem", flexWrap: "wrap" }}>
                      <TypeBadge type={r.type} />
                      <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.05em", color: "rgba(25,30,46,0.4)" }}>
                        {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                    <p style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.82rem", color: NAVY, marginBottom: "0.15rem" }}>{r.title}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.76rem", color: "rgba(25,30,46,0.55)", lineHeight: 1.55 }}>
                      {r.summary?.slice(0, 120)}{r.summary && r.summary.length > 120 ? "…" : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Read-only lockout notice */}
          <div style={{ background: "rgba(25,30,46,0.04)", border: "1px solid rgba(25,30,46,0.1)", borderRadius: 7, padding: "0.9rem 1.1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
              <Lock size={12} color="rgba(25,30,46,0.4)" />
              <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(25,30,46,0.45)", fontWeight: 700 }}>Clinical notes — read only</span>
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.76rem", color: "rgba(25,30,46,0.5)", lineHeight: 1.6 }}>
              Full veterinary records are visible but cannot be edited. Clinical notes and medical entries are authored by the attending veterinarian only.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
