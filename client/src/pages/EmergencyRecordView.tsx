/**
 * EmergencyRecordView — PUBLIC page, no login required.
 * Opened by a veterinarian via a shared emergency access link.
 * Route: /ea/:token
 *
 * Shows full read-only animal record: identity, conditions, medications,
 * care history timeline, and upcoming scheduled care.
 * Includes a non-blocking prompt to create an EQOS ark account.
 * Records each view on the server (access count + timestamp).
 */
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Animal, Record as HealthRecord } from "@shared/schema";
import {
  Zap, Shield, Clock, AlertTriangle, CheckCircle,
  FileText, FlaskConical, Scan, Scissors, Heart,
  ExternalLink, Stethoscope, CalendarCheck, Truck, Trophy,
  Lock,
} from "lucide-react";
import eqosLogo from "../assets/eqos-ark-logo-white.png";

const NAVY  = "#191e2e";
const AMBER = "#b15d00";
const BLUE  = "#436eb3";
const RED   = "#b0291f";

// ── API response shape ────────────────────────────────────────────────────────
interface EAResponse {
  animal: Animal;
  records: HealthRecord[];
  emergencyAccess: {
    label: string;
    context: string;
    expiresAt: string;
    durationDays: number;
    issuedBy: string;
  };
}

interface EAError {
  error: string;
  code?: "REVOKED" | "EXPIRED" | "NOT_FOUND";
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function contextLabel(ctx: string): { icon: React.ReactNode; label: string; color: string } {
  switch (ctx) {
    case "show":          return { icon: <Trophy size={13} />,     label: "Competition access", color: AMBER };
    case "transit":       return { icon: <Truck size={13} />,      label: "In-transit access",  color: BLUE  };
    case "pre-authorized":return { icon: <Shield size={13} />,     label: "Pre-authorized access", color: NAVY };
    default:              return { icon: <Zap size={13} />,        label: "Emergency access",   color: RED   };
  }
}

function recordTypeConfig(type: string): { icon: React.ReactNode; color: string; label: string } {
  switch (type) {
    case "lab":      return { icon: <FlaskConical size={12} />, color: "#2a7a4f", label: "Lab"        };
    case "imaging":  return { icon: <Scan size={12} />,         color: "#5a4da8", label: "Imaging"    };
    case "vet_note": return { icon: <FileText size={12} />,     color: BLUE,      label: "Vet Note"   };
    case "routine":  return { icon: <Scissors size={12} />,     color: "#7a5230", label: "Routine"    };
    default:         return { icon: <FileText size={12} />,     color: "rgba(25,30,46,0.45)", label: "Document" };
  }
}

function daysRemaining(expiresAt: string): number {
  return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, icon, children, accent = NAVY }: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div style={{ background: "white", borderRadius: 8, border: "1px solid rgba(25,30,46,0.09)", boxShadow: "0 1px 4px rgba(25,30,46,0.08)", overflow: "hidden", marginBottom: "1rem" }}>
      <div style={{ background: NAVY, padding: "0.65rem 1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ color: accent, display: "flex", alignItems: "center" }}>{icon}</span>
        <span style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.54rem", letterSpacing: "0.1em", textTransform: "uppercase", color: accent, fontWeight: 700 }}>{title}</span>
      </div>
      <div style={{ padding: "1.25rem 1.4rem" }}>{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", gap: "1rem", paddingBottom: "0.6rem", marginBottom: "0.6rem", borderBottom: "1px solid rgba(25,30,46,0.07)" }}>
      <span style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.54rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(25,30,46,0.45)", fontWeight: 600, minWidth: 110, flexShrink: 0 }}>{label}</span>
      <span style={{ fontFamily: "Lato, sans-serif", fontWeight: 400, fontSize: "0.82rem", color: "rgba(25,30,46,0.8)", lineHeight: 1.6 }}>{value}</span>
    </div>
  );
}

// ── Error state ───────────────────────────────────────────────────────────────
function ErrorState({ code, message }: { code?: string; message: string }) {
  const isRevoked  = code === "REVOKED";
  const isExpired  = code === "EXPIRED";
  const color      = isRevoked ? RED : isRevoked ? AMBER : "rgba(25,30,46,0.4)";
  const Icon       = isRevoked ? Shield : isExpired ? Clock : AlertTriangle;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f2ee", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "Lato, sans-serif" }}>
      {/* Logo */}
      <div style={{ background: NAVY, borderRadius: 8, padding: "0.85rem 1.25rem", marginBottom: "2rem" }}>
        <img src={eqosLogo} alt="EQOS ark" style={{ height: 36, display: "block" }} />
      </div>

      <div style={{ background: "white", borderRadius: 10, boxShadow: "0 4px 24px rgba(25,30,46,0.12)", padding: "2.5rem", maxWidth: 420, textAlign: "center" }}>
        <Icon size={36} color={color} style={{ margin: "0 auto 1rem" }} />
        <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.35rem", fontWeight: 400, color: NAVY, marginBottom: "0.75rem" }}>
          {isRevoked ? "Access revoked" : isExpired ? "Link expired" : "Link not found"}
        </h2>
        <p style={{ fontFamily: "Lato, sans-serif", fontWeight: 300, fontSize: "0.85rem", color: "rgba(25,30,46,0.6)", lineHeight: 1.75, marginBottom: "1.5rem" }}>
          {isRevoked
            ? "The owner has revoked this access link. Contact the horse owner to request a new link."
            : isExpired
            ? "This emergency access link has expired. The horse owner can generate a new link if needed."
            : "This access link does not exist or could not be found. Check that the URL is complete and try again."}
        </p>
        <p style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.52rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(25,30,46,0.3)", fontWeight: 600 }}>
          EQOS ark · Owner-controlled equine health records
        </p>
      </div>
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────
export default function EmergencyRecordView() {
  const { token } = useParams<{ token: string }>();

  const { data, isLoading, error, isError } = useQuery<EAResponse, EAError>({
    queryKey: [`/api/ea/${token}`],
    queryFn: async () => {
      const res = await fetch(`/api/ea/${token}`);
      if (!res.ok) {
        const err = await res.json();
        throw err;
      }
      return res.json();
    },
    retry: false,
    staleTime: 60_000,
  });

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f2ee", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Courier Prime, monospace" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ background: NAVY, borderRadius: 8, padding: "0.85rem 1.25rem", marginBottom: "1.5rem", display: "inline-block" }}>
            <img src={eqosLogo} alt="EQOS ark" style={{ height: 36, display: "block" }} />
          </div>
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(25,30,46,0.4)" }}>
            Loading record…
          </p>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (isError) {
    const err = error as EAError;
    return <ErrorState code={err.code} message={err.error} />;
  }

  if (!data) return null;

  const { animal, records, emergencyAccess: ea } = data;
  const ctx    = contextLabel(ea.context);
  const days   = daysRemaining(ea.expiresAt);
  const expiry = new Date(ea.expiresAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const conditions: string[]  = (() => { try { return JSON.parse(animal.activeConditions ?? "[]"); } catch { return []; } })();
  const medications: string[] = (() => { try { return JSON.parse(animal.activeMedications ?? "[]"); } catch { return []; } })();
  const nextCare: string[]    = (() => { try { return JSON.parse(animal.nextScheduledCare ?? "[]"); } catch { return []; } })();

  const age = animal.dob
    ? Math.floor((Date.now() - new Date(animal.dob).getTime()) / (365.25 * 24 * 3600 * 1000))
    : null;

  const sortedRecords = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Fonts via Google Fonts inline style tag
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=Lato:wght@300;400;500;600&family=Courier+Prime:wght@400;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #ded8cd; font-family: 'Lato', sans-serif; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#ded8cd" }}>

        {/* ── Top banner ────────────────────────────────────────────────── */}
        <div style={{ background: NAVY, padding: "0 1.5rem" }}>
          <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0", flexWrap: "wrap", gap: "0.5rem" }}>
            <img src={eqosLogo} alt="EQOS ark" style={{ height: 36, objectFit: "contain" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontFamily: "Courier Prime, monospace", fontSize: "0.52rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: ctx.color }}>
                {ctx.icon} {ctx.label}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontFamily: "Courier Prime, monospace", fontSize: "0.5rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
                <Lock size={10} /> Read only
              </span>
              <span style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.5rem", letterSpacing: "0.06em", color: days <= 3 ? AMBER : "rgba(255,255,255,0.4)", fontWeight: 600 }}>
                {days === 0 ? "Expires today" : `Expires ${expiry}`}
              </span>
            </div>
          </div>
        </div>

        {/* ── Emergency context bar ─────────────────────────────────────── */}
        <div style={{ background: `rgba(25,30,46,0.92)`, padding: "0.7rem 1.5rem" }}>
          <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
            <span style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.52rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>
              Emergency access · Issued by: {ea.issuedBy} {ea.label ? `· ${ea.label}` : ""}
            </span>
            <span style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.5rem", letterSpacing: "0.05em", color: "rgba(255,255,255,0.35)" }}>
              This is a time-limited read-only record. Authorized by horse owner.
            </span>
          </div>
        </div>

        <div style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1.5rem" }}>

          {/* ── Animal header ────────────────────────────────────────── */}
          <div style={{ marginBottom: "1.75rem" }}>
            <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "2.25rem", fontWeight: 400, color: NAVY, marginBottom: "0.4rem" }}>
              {animal.name}
            </h1>
            <p style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.62rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(25,30,46,0.5)", fontWeight: 500 }}>
              {[animal.breed, animal.sex, age != null ? `${age} yrs` : null, animal.color, animal.barn].filter(Boolean).join(" · ")}
            </p>
            {animal.microchip && (
              <p style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.55rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(25,30,46,0.4)", marginTop: "0.25rem" }}>
                Microchip: {animal.microchip}
              </p>
            )}
          </div>

          {/* ── Active conditions alert ──────────────────────────────── */}
          {conditions.length > 0 && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem", background: "rgba(176,41,31,0.08)", border: "2px solid rgba(176,41,31,0.3)", borderRadius: 8, padding: "1.1rem 1.3rem", marginBottom: "1.5rem" }}>
              <AlertTriangle size={18} color={RED} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.56rem", letterSpacing: "0.1em", textTransform: "uppercase", color: RED, fontWeight: 700, marginBottom: "0.5rem" }}>
                  Active conditions — veterinary review required
                </p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {conditions.map((c, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                      <span style={{ color: RED, fontFamily: "Courier Prime, monospace", fontSize: "0.82rem", flexShrink: 0, marginTop: 1 }}>—</span>
                      <span style={{ fontFamily: "Lato, sans-serif", fontWeight: 400, fontSize: "0.84rem", color: "rgba(25,30,46,0.85)", lineHeight: 1.6 }}>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ── Two-column layout ────────────────────────────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>

            {/* LEFT — patient identity + meds */}
            <div>

              <Section title="Patient summary" icon={<Stethoscope size={13} />} accent={AMBER}>
                <InfoRow label="Primary Vet"  value={animal.primaryVet ?? ""} />
                <InfoRow label="Barn / Facility" value={animal.barn ?? ""} />
                <InfoRow label="Discipline"   value={animal.discipline ?? ""} />
                <InfoRow label="Status"       value={animal.patientStatus ? animal.patientStatus.charAt(0).toUpperCase() + animal.patientStatus.slice(1) : ""} />
                {animal.openingSummary && (
                  <p style={{ fontFamily: "Lato, sans-serif", fontWeight: 400, fontSize: "0.82rem", color: "rgba(25,30,46,0.75)", lineHeight: 1.75, marginTop: "0.5rem" }}>
                    {animal.openingSummary}
                  </p>
                )}
              </Section>

              {medications.length > 0 && (
                <Section title="Active medications" icon={<Heart size={13} />} accent={AMBER}>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {medications.map((m, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                        <span style={{ color: AMBER, fontFamily: "Lato, sans-serif", fontSize: "0.82rem", flexShrink: 0, marginTop: 1 }}>—</span>
                        <span style={{ fontFamily: "Lato, sans-serif", fontWeight: 400, fontSize: "0.82rem", color: "rgba(25,30,46,0.8)", lineHeight: 1.6 }}>{m}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {animal.recentHistory && (
                <Section title="Recent history" icon={<Clock size={13} />} accent={AMBER}>
                  <p style={{ fontFamily: "Lato, sans-serif", fontWeight: 400, fontSize: "0.82rem", color: "rgba(25,30,46,0.78)", lineHeight: 1.8 }}>
                    {animal.recentHistory}
                  </p>
                </Section>
              )}

            </div>

            {/* RIGHT — upcoming care + record timeline */}
            <div>

              {nextCare.length > 0 && (
                <Section title="Upcoming care" icon={<CalendarCheck size={13} />} accent={AMBER}>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {nextCare.map((item, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                        <CalendarCheck size={12} color={AMBER} style={{ flexShrink: 0, marginTop: 3 }} />
                        <span style={{ fontFamily: "Lato, sans-serif", fontWeight: 400, fontSize: "0.8rem", color: "rgba(25,30,46,0.75)", lineHeight: 1.6 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* Full record timeline */}
              <Section title="Health record timeline" icon={<FileText size={13} />} accent={AMBER}>
                {sortedRecords.length === 0 ? (
                  <p style={{ fontFamily: "Lato, sans-serif", fontWeight: 300, fontSize: "0.8rem", color: "rgba(25,30,46,0.4)" }}>No records on file.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                    {sortedRecords.map(r => {
                      const rt = recordTypeConfig(r.type);
                      return (
                        <div key={r.id} style={{ paddingBottom: "0.85rem", borderBottom: "1px solid rgba(25,30,46,0.07)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem", flexWrap: "wrap" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontFamily: "Courier Prime, monospace", fontSize: "0.48rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700, color: rt.color, background: `${rt.color}14`, borderRadius: 4, padding: "0.18rem 0.45rem" }}>
                              {rt.icon} {rt.label}
                            </span>
                            <span style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.5rem", letterSpacing: "0.05em", color: "rgba(25,30,46,0.4)" }}>
                              {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                            {r.isSignificant && (
                              <span style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.46rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700, color: AMBER, background: "rgba(177,93,0,0.1)", borderRadius: 4, padding: "0.18rem 0.45rem" }}>
                                Significant
                              </span>
                            )}
                          </div>
                          <p style={{ fontFamily: "Lato, sans-serif", fontWeight: 500, fontSize: "0.83rem", color: NAVY, marginBottom: "0.2rem" }}>{r.title}</p>
                          <p style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.52rem", letterSpacing: "0.04em", color: "rgba(25,30,46,0.45)", marginBottom: "0.3rem" }}>
                            {r.provider}{r.practice ? ` · ${r.practice}` : ""}
                          </p>
                          {r.summary && (
                            <p style={{ fontFamily: "Lato, sans-serif", fontWeight: 300, fontSize: "0.77rem", color: "rgba(25,30,46,0.6)", lineHeight: 1.6 }}>
                              {r.summary}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Section>

            </div>
          </div>

          {/* ── EQOS ark onboarding prompt ────────────────────────────── */}
          <div style={{
            marginTop: "2rem",
            background: NAVY, borderRadius: 10,
            padding: "1.75rem 2rem",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: "1.25rem",
          }}>
            <div style={{ maxWidth: 480 }}>
              <p style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", color: AMBER, fontWeight: 700, marginBottom: "0.4rem" }}>
                Join EQOS ark
              </p>
              <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.15rem", fontWeight: 400, color: "white", marginBottom: "0.5rem" }}>
                Want to add notes or access records for all your patients?
              </h3>
              <p style={{ fontFamily: "Lato, sans-serif", fontWeight: 300, fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.75 }}>
                Create a verified EQOS ark account to author records, receive invitations from owners, and build a longitudinal record across your entire caseload. Your first 60-day billing period begins when you accept your first owner invitation.
              </p>
            </div>
            <a
              href="/#/signup/vet"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                background: AMBER, color: "white", textDecoration: "none",
                border: "none", borderRadius: 7, padding: "0.85rem 1.5rem",
                fontFamily: "Courier Prime, monospace", fontSize: "0.6rem",
                letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700,
                flexShrink: 0, whiteSpace: "nowrap",
              }}
            >
              <Stethoscope size={14} /> Create vet account
            </a>
          </div>

          {/* ── Footer ──────────────────────────────────────────────────── */}
          <div style={{ textAlign: "center", marginTop: "1.5rem", paddingBottom: "2rem" }}>
            <p style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.5rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(25,30,46,0.4)", fontWeight: 600, lineHeight: 1.8 }}>
              EQOS ark · Owner-controlled equine health records<br />
              This record is read-only. Authorized by horse owner · {days > 0 ? `Expires in ${days} days` : "Expires today"}
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
