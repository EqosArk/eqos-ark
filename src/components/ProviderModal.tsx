import { X, Phone, Mail, Building2, CalendarDays, FileText, FlaskConical, Scan, Scissors } from "lucide-react";
import type { CareTeamMember, Record } from "@shared/schema";

interface Props {
  member: CareTeamMember | null;
  records: Record[];        // all records for the animal — filtered here
  onClose: () => void;
  onOpenRecord: (r: Record) => void;
}

function TypeBadge({ type }: { type: string }) {
  const map: Record<string, { cls: string; icon: React.ReactNode; label: string }> = {
    lab:      { cls: "type-lab",      icon: <FlaskConical size={9} />, label: "Lab" },
    imaging:  { cls: "type-imaging",  icon: <Scan size={9} />,        label: "Imaging" },
    vet_note: { cls: "type-vet_note", icon: <FileText size={9} />,    label: "Vet Note" },
    routine:  { cls: "type-routine",  icon: <Scissors size={9} />,    label: "Routine" },
  };
  const m = map[type] ?? map.vet_note;
  return <span className={`type-badge ${m.cls}`}>{m.icon} {m.label}</span>;
}

function AccessChip({ level }: { level: string }) {
  if (level === "READ+WRITE")  return <span className="access-tag access-rw">READ + WRITE</span>;
  if (level === "READ+APPEND") return <span className="access-tag access-ra">READ + APPEND</span>;
  return <span className="access-tag access-r">READ ONLY</span>;
}

export default function ProviderModal({ member, records, onClose, onOpenRecord }: Props) {
  if (!member) return null;

  // Provider's initials avatar
  const initials = member.name
    .replace("Dr. ", "").split(" ")
    .map(w => w[0]).join("").slice(0, 2).toUpperCase();

  // Filter records to this provider (match on name, partial match works)
  const providerRecords = records.filter(r =>
    r.provider.toLowerCase().includes(member.name.toLowerCase()) ||
    member.name.toLowerCase().includes(r.provider.toLowerCase().replace("dr. ", "").trim())
  ).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 40,
          background: "rgba(25,30,46,0.45)",
          backdropFilter: "blur(3px)",
        }}
        onClick={onClose}
        data-testid="provider-modal-backdrop"
      />

      {/* Modal panel — centred */}
      <div
        data-testid="provider-modal"
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(92vw, 560px)",
          maxHeight: "85vh",
          zIndex: 50,
          display: "flex", flexDirection: "column",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(25,30,46,0.35)",
          animation: "fadeUp 0.2s ease-out",
        }}
      >
        {/* ── Header — navy ───────────────────────────────────────── */}
        <div style={{
          background: "var(--navy)",
          padding: "1.25rem 1.5rem",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {/* Avatar */}
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: "var(--blue)",
                border: "2px solid rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-display)", fontSize: "1.125rem",
                fontWeight: 400, color: "white", flexShrink: 0,
              }}>
                {initials}
              </div>

              <div>
                <span style={{
                  fontFamily: "var(--font-courier)", fontSize: "0.5625rem",
                  fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "var(--amber)", display: "block", marginBottom: "0.2rem",
                }}>
                  Care Team Member
                </span>
                <h2 style={{
                  fontFamily: "var(--font-display)", fontStyle: "italic",
                  fontSize: "1.125rem", fontWeight: 400, color: "white",
                }}>
                  {member.name}
                </h2>
                <p style={{
                  fontFamily: "var(--font-courier)", fontSize: "0.5625rem",
                  color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em",
                }}>
                  {member.role}
                </p>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              data-testid="btn-close-provider-modal"
              style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "rgba(255,255,255,0.1)", border: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0,
                transition: "background var(--transition)",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            >
              <X style={{ width: 13, height: 13, color: "white" }} />
            </button>
          </div>
        </div>

        {/* ── Body ────────────────────────────────────────────────── */}
        <div style={{
          background: "var(--linen)", flex: 1, overflowY: "auto",
          padding: "1.25rem 1.5rem",
          display: "flex", flexDirection: "column", gap: "1.25rem",
        }}>

          {/* Contact card */}
          <div className="card card-amber-top">
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <span className="section-label" style={{ marginBottom: 0 }}>Contact Information</span>

              {/* Practice */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem" }}>
                <Building2 size={14} style={{ color: "var(--blue)", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.8125rem", color: "var(--navy)" }}>
                    {member.practice}
                  </p>
                  <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.5625rem", color: "rgba(25,30,46,0.45)", letterSpacing: "0.04em" }}>
                    Practice / Organisation
                  </p>
                </div>
              </div>

              <hr className="divider" style={{ margin: "0.25rem 0" }} />

              {/* Phone */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                <Phone size={14} style={{ color: "var(--blue)", flexShrink: 0 }} />
                <a href={`tel:${member.phone}`} style={{
                  fontFamily: "var(--font-body)", fontWeight: 400,
                  fontSize: "0.8125rem", color: "var(--amber)",
                  textDecoration: "none",
                }}>
                  {member.phone}
                </a>
              </div>

              {/* Email */}
              {member.email && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                  <Mail size={14} style={{ color: "var(--blue)", flexShrink: 0 }} />
                  <a href={`mailto:${member.email}`} style={{
                    fontFamily: "var(--font-body)", fontWeight: 400,
                    fontSize: "0.8125rem", color: "var(--amber)",
                    textDecoration: "none",
                  }}>
                    {member.email}
                  </a>
                </div>
              )}

              <hr className="divider" style={{ margin: "0.25rem 0" }} />

              {/* Last contact + access level */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CalendarDays size={13} style={{ color: "rgba(25,30,46,0.4)" }} />
                  <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.5625rem", color: "rgba(25,30,46,0.5)", letterSpacing: "0.04em" }}>
                    Last contact: {member.lastContact}
                  </p>
                </div>
                <AccessChip level={member.accessLevel} />
              </div>
            </div>
          </div>

          {/* Provider's records */}
          <div>
            <span className="section-label" style={{ marginBottom: "0.75rem" }}>
              Records by {member.name.split(" ").slice(-1)[0]} — {providerRecords.length} {providerRecords.length === 1 ? "entry" : "entries"}
            </span>

            {providerRecords.length === 0 ? (
              <div style={{
                background: "white", border: "1px solid rgba(25,30,46,0.08)",
                borderRadius: "var(--radius-md)", padding: "1.5rem",
                textAlign: "center",
              }}>
                <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.8125rem", color: "rgba(25,30,46,0.4)" }}>
                  No records on file for this provider yet.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {providerRecords.map(rec => (
                  <button
                    key={rec.id}
                    data-testid={`provider-record-${rec.id}`}
                    onClick={() => { onClose(); onOpenRecord(rec); }}
                    className="card"
                    style={{
                      width: "100%", textAlign: "left", border: "none",
                      padding: "0.875rem 1rem", cursor: "pointer",
                      background: "white", borderRadius: "var(--radius-md)",
                      boxShadow: "var(--shadow-card)", display: "block",
                      transition: "box-shadow var(--transition)",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-lift)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                          <TypeBadge type={rec.type} />
                          <span style={{
                            fontFamily: "var(--font-courier)", fontSize: "0.5rem",
                            color: "rgba(25,30,46,0.38)", letterSpacing: "0.04em",
                          }}>
                            {rec.date} · {rec.season}
                          </span>
                          {!rec.isSorted && (
                            <span style={{
                              fontFamily: "var(--font-courier)", fontSize: "0.5rem",
                              color: "var(--amber)", fontWeight: 700, letterSpacing: "0.04em",
                            }}>
                              UNSORTED
                            </span>
                          )}
                        </div>
                        <p style={{
                          fontFamily: "var(--font-display)", fontSize: "0.875rem",
                          color: "var(--navy)", fontWeight: 400, lineHeight: 1.3,
                          marginBottom: "0.2rem",
                        }}>
                          {rec.title}
                        </p>
                        <p style={{
                          fontFamily: "var(--font-body)", fontWeight: 300,
                          fontSize: "0.6875rem", color: "rgba(25,30,46,0.5)",
                          lineHeight: 1.5,
                        }}>
                          {rec.summary}
                        </p>
                      </div>
                      <span style={{
                        fontFamily: "var(--font-body)", fontSize: "0.75rem",
                        color: "var(--blue)", flexShrink: 0, marginLeft: "0.75rem",
                      }}>
                        Open →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Footer actions ───────────────────────────────────────── */}
        <div style={{
          background: "white",
          borderTop: "1px solid rgba(25,30,46,0.08)",
          padding: "0.875rem 1.5rem",
          display: "flex", justifyContent: "flex-end", gap: "0.5rem",
          flexShrink: 0,
        }}>
          {member.phone && (
            <a href={`tel:${member.phone}`} className="btn btn-outline btn-sm" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
              <Phone size={11} /> Call
            </a>
          )}
          {member.email && (
            <a href={`mailto:${member.email}`} className="btn btn-amber btn-sm" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
              <Mail size={11} /> Email
            </a>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 12px)); }
          to   { opacity: 1; transform: translate(-50%, -50%); }
        }
      `}</style>
    </>
  );
}
