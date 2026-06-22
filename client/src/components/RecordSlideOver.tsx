import { X, Star, FileText, FlaskConical, Scan, Scissors } from "lucide-react";
import type { Record } from "@shared/schema";

interface Props {
  record: Record | null;
  onClose: () => void;
}

/* ── Label helper ────────────────────────────────────────────────── */
function MetaLabel({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: "var(--font-courier)",
      fontSize: "0.5625rem",
      fontWeight: 700,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--amber)",
      display: "block",
      marginBottom: "0.25rem",
    }}>
      {children}
    </span>
  );
}

function MetaValue({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "var(--font-body)",
      fontWeight: 400,
      fontSize: "0.8125rem",
      color: "var(--navy)",
    }}>
      {children}
    </p>
  );
}

function SectionBox({
  label, children, accent = "linen",
}: {
  label: string;
  children: React.ReactNode;
  accent?: "linen" | "blue" | "amber" | "navy";
}) {
  const styles = {
    linen: { bg: "var(--linen)",       border: "var(--linen-dark)", label: "rgba(25,30,46,0.5)" },
    blue:  { bg: "var(--blue-light)",  border: "#9eb8e0",           label: "var(--blue)" },
    amber: { bg: "var(--amber-light)", border: "#e8c89a",           label: "var(--amber)" },
    navy:  { bg: "rgba(25,30,46,0.04)", border: "rgba(25,30,46,0.12)", label: "var(--navy)" },
  }[accent];

  return (
    <div style={{
      background: styles.bg,
      border: `1px solid ${styles.border}`,
      borderRadius: "var(--radius-md)",
      padding: "0.875rem 1rem",
    }}>
      <p style={{
        fontFamily: "var(--font-courier)", fontSize: "0.5625rem",
        fontWeight: 700, letterSpacing: "0.1em",
        textTransform: "uppercase", color: styles.label,
        marginBottom: "0.5rem",
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: "var(--font-body)", fontWeight: 300,
        fontSize: "0.8125rem", color: "var(--navy)", lineHeight: 1.75,
      }}>
        {children}
      </p>
    </div>
  );
}

/* ── Lab Result Renderer ─────────────────────────────────────────── */
function LabResultView({ content }: { content: any }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div><MetaLabel>Collected</MetaLabel><MetaValue>{content.collectedDate}</MetaValue></div>
        <div><MetaLabel>Reported</MetaLabel><MetaValue>{content.reportedDate}</MetaValue></div>
        <div style={{ gridColumn: "span 2" }}>
          <MetaLabel>Laboratory</MetaLabel><MetaValue>{content.lab}</MetaValue>
        </div>
      </div>

      {content.panels?.map((panel: any, pi: number) => (
        <div key={pi}>
          <p style={{
            fontFamily: "var(--font-courier)", fontSize: "0.5625rem",
            fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "var(--navy)",
            marginBottom: "0.5rem",
          }}>
            {panel.name}
          </p>
          <div style={{ border: "1px solid rgba(25,30,46,0.10)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
              <thead>
                <tr style={{ background: "var(--linen)", borderBottom: "1px solid rgba(25,30,46,0.08)" }}>
                  {["Analyte", "Value", "Unit", "Ref Range", ""].map((h, i) => (
                    <th key={i} style={{
                      padding: "0.5rem 0.75rem",
                      textAlign: i === 0 ? "left" : "right",
                      fontFamily: "var(--font-courier)", fontSize: "0.5625rem",
                      fontWeight: 700, letterSpacing: "0.08em",
                      color: "rgba(25,30,46,0.5)", textTransform: "uppercase",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {panel.results?.map((r: any, ri: number) => (
                  <tr key={ri} style={{
                    borderBottom: "1px solid rgba(25,30,46,0.06)",
                    background: r.flag ? "var(--amber-light)" : "white",
                  }}>
                    <td style={{ padding: "0.5rem 0.75rem", fontFamily: "var(--font-body)", fontWeight: 400, color: "var(--navy)" }}>{r.analyte}</td>
                    <td style={{ padding: "0.5rem 0.75rem", textAlign: "right", fontFamily: "var(--font-courier)", fontWeight: 700, color: r.flag ? "var(--amber)" : "var(--navy)" }}>{r.value}</td>
                    <td style={{ padding: "0.5rem 0.75rem", textAlign: "right", fontFamily: "var(--font-courier)", color: "rgba(25,30,46,0.4)" }}>{r.unit}</td>
                    <td style={{ padding: "0.5rem 0.75rem", textAlign: "right", fontFamily: "var(--font-courier)", color: "rgba(25,30,46,0.4)" }}>{r.refRange}</td>
                    <td style={{ padding: "0.5rem 0.75rem", textAlign: "center" }}>
                      {r.flag && <span style={{ color: "var(--amber)", fontWeight: 700, fontSize: "0.625rem" }}>▲</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <SectionBox label="Interpretation" accent="linen">{content.interpretation}</SectionBox>
    </div>
  );
}

/* ── Vet Note SOAP Renderer ──────────────────────────────────────── */
function VetNoteView({ content }: { content: any }) {
  const sections = [
    { key: "subjective", label: "S — Subjective", accent: "linen" as const },
    { key: "objective",  label: "O — Objective",  accent: "navy" as const },
    { key: "assessment", label: "A — Assessment", accent: "amber" as const },
    { key: "plan",       label: "P — Plan",       accent: "blue" as const },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div><MetaLabel>Visit Date</MetaLabel><MetaValue>{content.visitDate}</MetaValue></div>
        <div><MetaLabel>Visit Type</MetaLabel><MetaValue>{content.visitType}</MetaValue></div>
        <div><MetaLabel>Provider</MetaLabel><MetaValue>{content.provider}</MetaValue></div>
        <div><MetaLabel>Practice</MetaLabel><MetaValue>{content.practice}</MetaValue></div>
      </div>

      {sections.map(({ key, label, accent }) =>
        content[key] ? (
          <div key={key} style={{ paddingLeft: "0.875rem", borderLeft: "2px solid var(--amber)" }}>
            <p style={{
              fontFamily: "var(--font-courier)", fontSize: "0.5625rem",
              fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "var(--amber)", marginBottom: "0.375rem",
            }}>
              {label}
            </p>
            <p style={{
              fontFamily: "var(--font-body)", fontWeight: 300,
              fontSize: "0.8125rem", color: "var(--navy)", lineHeight: 1.75,
            }}>
              {content[key]}
            </p>
          </div>
        ) : null
      )}
    </div>
  );
}

/* ── Imaging / Radiology Renderer ────────────────────────────────── */
function ImagingView({ content }: { content: any }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div><MetaLabel>Study Date</MetaLabel><MetaValue>{content.studyDate}</MetaValue></div>
        <div><MetaLabel>Modality</MetaLabel><MetaValue>{content.modality}</MetaValue></div>
        <div><MetaLabel>Region</MetaLabel><MetaValue>{content.region}</MetaValue></div>
        {content.views && <div><MetaLabel>Views / Protocol</MetaLabel><MetaValue>{content.views}</MetaValue></div>}
        <div style={{ gridColumn: "span 2" }}>
          <MetaLabel>Clinical Indication</MetaLabel><MetaValue>{content.indication}</MetaValue>
        </div>
      </div>

      {/* DICOM-style viewer placeholder — navy background */}
      <div style={{
        borderRadius: "var(--radius-md)",
        background: "var(--navy)",
        border: "1px solid rgba(255,255,255,0.08)",
        height: 160,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ textAlign: "center" }}>
          <Scan style={{ width: 32, height: 32, color: "var(--blue)", marginBottom: 8 }} />
          <p style={{
            fontFamily: "var(--font-courier)", fontSize: "0.5625rem",
            color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}>
            {content.modality}
          </p>
          <p style={{
            fontFamily: "var(--font-courier)", fontSize: "0.5rem",
            color: "rgba(255,255,255,0.28)", marginTop: 4,
          }}>
            {content.imageNote ?? "Images archived in PACS"}
          </p>
          <button style={{
            marginTop: 10, fontFamily: "var(--font-body)", fontWeight: 400,
            fontSize: "0.6875rem", color: "var(--blue)",
            border: "1px solid rgba(67,110,179,0.4)",
            borderRadius: "var(--radius-sm)", padding: "0.25rem 0.75rem",
            background: "none", cursor: "pointer",
          }}>
            Request Image Access
          </button>
        </div>
        <div style={{
          position: "absolute", top: 8, left: 10,
          fontFamily: "var(--font-courier)", fontSize: "0.5rem",
          color: "rgba(67,110,179,0.5)", lineHeight: 1.6,
        }}>
          <div>ID: {content.studyDate?.replace(/[,\s]/g, "") ?? "N/A"}</div>
          <div>EQOS ark · Demo Patient</div>
        </div>
      </div>

      <SectionBox label="Findings"   accent="linen">{content.findings}</SectionBox>
      <SectionBox label="Impression" accent="amber">{content.impression}</SectionBox>
      {content.recommendation && (
        <SectionBox label="Recommendation" accent="blue">{content.recommendation}</SectionBox>
      )}

      <div style={{ fontFamily: "var(--font-courier)", fontSize: "0.5625rem", color: "rgba(25,30,46,0.35)", lineHeight: 1.7 }}>
        {content.radiologist && <p>Radiologist: {content.radiologist}</p>}
        {content.referredBy   && <p>Referred by: {content.referredBy}</p>}
        {content.practice     && <p>Practice: {content.practice}</p>}
      </div>
    </div>
  );
}

/* ── Routine Care Renderer ───────────────────────────────────────── */
function RoutineView({ content }: { content: any }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div><MetaLabel>Service</MetaLabel><MetaValue>{content.serviceType ?? content.type}</MetaValue></div>
        <div><MetaLabel>Date</MetaLabel><MetaValue>{content.date}</MetaValue></div>
        <div><MetaLabel>Next Due</MetaLabel><MetaValue>{content.nextDue}</MetaValue></div>
        <div><MetaLabel>Provider</MetaLabel><MetaValue>{content.provider}</MetaValue></div>
        {content.practice && (
          <div style={{ gridColumn: "span 2" }}>
            <MetaLabel>Practice</MetaLabel><MetaValue>{content.practice}</MetaValue>
          </div>
        )}
      </div>

      {content.findings  && <SectionBox label="Findings"           accent="linen">{content.findings}</SectionBox>}
      {content.treatment && <SectionBox label="Treatment Performed" accent="blue">{content.treatment}</SectionBox>}
      {content.notes     && <SectionBox label="Notes"              accent="amber">{content.notes}</SectionBox>}

      {content.sedation && (
        <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.5625rem", color: "rgba(25,30,46,0.4)" }}>
          Sedation: {content.sedation}
        </p>
      )}
    </div>
  );
}

/* ── Record type badge in header ─────────────────────────────────── */
function HeaderTypeBadge({ type }: { type: string }) {
  const meta: Record<string, { icon: JSX.Element; label: string }> = {
    lab:      { icon: <FlaskConical style={{ width: 13, height: 13 }} />, label: "Laboratory" },
    imaging:  { icon: <Scan        style={{ width: 13, height: 13 }} />, label: "Imaging / Radiology" },
    vet_note: { icon: <FileText    style={{ width: 13, height: 13 }} />, label: "Veterinary Note" },
    routine:  { icon: <Scissors    style={{ width: 13, height: 13 }} />, label: "Routine Care" },
  };
  const m = meta[type] ?? { icon: <FileText style={{ width: 13, height: 13 }} />, label: type };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "0.375rem",
      fontFamily: "var(--font-courier)", fontSize: "0.5625rem",
      fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
      padding: "0.25rem 0.625rem", borderRadius: "2px",
      background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.9)",
    }}>
      {m.icon} {m.label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Main Slide-Over
═══════════════════════════════════════════════════════════════════ */
export default function RecordSlideOver({ record, onClose }: Props) {
  if (!record) return null;

  const content = (() => {
    try { return JSON.parse(record.content); } catch { return {}; }
  })();

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 40,
          background: "rgba(25,30,46,0.5)",
          backdropFilter: "blur(3px)",
        }}
        onClick={onClose}
        data-testid="slideover-backdrop"
      />

      {/* Panel */}
      <div
        data-testid="record-slideover"
        style={{
          position: "fixed", top: 0, right: 0, height: "100%",
          width: "100%", maxWidth: 520,
          zIndex: 50, display: "flex", flexDirection: "column",
          overflow: "hidden", animation: "slideIn 0.25s ease-out",
          boxShadow: "-8px 0 40px rgba(25,30,46,0.25)",
        }}
      >
        {/* Header — navy brand color */}
        <div style={{
          background: "var(--navy)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "1.25rem 1.5rem",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ flex: 1, minWidth: 0, paddingRight: "1rem" }}>
              {/* Type badge + star */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.625rem" }}>
                {record.isSignificant && (
                  <Star style={{ width: 13, height: 13, fill: "var(--amber)", color: "var(--amber)", flexShrink: 0 }} />
                )}
                <HeaderTypeBadge type={record.type} />
              </div>

              {/* Title */}
              <h2 style={{
                fontFamily: "var(--font-display)", fontStyle: "italic",
                fontSize: "1.125rem", fontWeight: 400,
                color: "white", lineHeight: 1.25,
              }}>
                {record.title}
              </h2>

              {/* Date / season / provider */}
              <p style={{
                fontFamily: "var(--font-courier)", fontSize: "0.5625rem",
                color: "rgba(255,255,255,0.45)", marginTop: "0.375rem",
                letterSpacing: "0.06em",
              }}>
                {record.date} · {record.season} · {record.provider}
              </p>
              {record.practice && (
                <p style={{
                  fontFamily: "var(--font-courier)", fontSize: "0.5rem",
                  color: "rgba(255,255,255,0.28)", letterSpacing: "0.06em",
                }}>
                  {record.practice}
                </p>
              )}
            </div>

            {/* Close button */}
            <button
              data-testid="btn-close-slideover"
              onClick={onClose}
              style={{
                width: 30, height: 30, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(255,255,255,0.10)",
                border: "none", cursor: "pointer", flexShrink: 0,
                transition: "background var(--transition)",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.20)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.10)")}
            >
              <X style={{ width: 14, height: 14, color: "white" }} />
            </button>
          </div>

          {/* Summary box */}
          <div style={{
            marginTop: "0.875rem",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "var(--radius-sm)",
            padding: "0.75rem 1rem",
            borderLeft: "2px solid var(--amber)",
          }}>
            <p style={{
              fontFamily: "var(--font-body)", fontWeight: 300,
              fontSize: "0.8125rem", color: "rgba(255,255,255,0.82)",
              lineHeight: 1.7,
            }}>
              {record.summary}
            </p>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{
          flex: 1, overflowY: "auto",
          background: "var(--linen)",
          padding: "1.25rem 1.5rem",
        }}>
          {record.type === "lab"      && <LabResultView  content={content} />}
          {record.type === "vet_note" && <VetNoteView    content={content} />}
          {record.type === "imaging"  && <ImagingView    content={content} />}
          {record.type === "routine"  && <RoutineView    content={content} />}
        </div>

        {/* Footer */}
        <div style={{
          borderTop: "1px solid rgba(25,30,46,0.10)",
          background: "white",
          padding: "0.875rem 1.5rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <p style={{
            fontFamily: "var(--font-courier)", fontSize: "0.5rem",
            color: "rgba(25,30,46,0.35)", letterSpacing: "0.04em",
          }}>
            {!record.isSorted && (
              <span style={{ color: "var(--amber)", fontWeight: 700 }}>
                Unsorted — pending review ·{" "}
              </span>
            )}
            Record ID: {record.id}
          </p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="btn btn-outline btn-sm">Share with Vet</button>
            <button className="btn btn-amber btn-sm">Download PDF</button>
          </div>
        </div>
      </div>
    </>
  );
}
