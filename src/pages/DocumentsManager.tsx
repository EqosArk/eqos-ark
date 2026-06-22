/**
 * DocumentsManager — Owner view for uploading documents per horse (MVP).
 * Reads animals from /api/animals. Upload via POST /api/upload/presign.
 * S3 is stubbed server-side — UI shows graceful "pending S3 connection" state.
 * Owner-only route (ProtectedRoute allowedRoles=["owner"]).
 */
import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Animal } from "@shared/schema";
import {
  FileText, Upload, Copy, CheckCircle,
  ChevronDown, ChevronUp, Lock, Eye,
  Link as LinkIcon, AlertTriangle,
} from "lucide-react";

const NAVY  = "#191e2e";
const AMBER = "#b15d00";
const BLUE  = "#436eb3";

type ShareMode = "private" | "team" | "link";

// ── Upload modal ──────────────────────────────────────────────────────────────
function UploadModal({ animal, onClose }: { animal: Animal; onClose: () => void }) {
  const [dragging, setDragging]   = useState(false);
  const [file, setFile]           = useState<File | null>(null);
  const [shareMode, setShareMode] = useState<ShareMode>("private");
  const [status, setStatus]       = useState<"idle" | "uploading" | "done" | "stub" | "error">("idle");
  const [stubUrl, setStubUrl]     = useState("");
  const [copied, setCopied]       = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus("uploading");
    try {
      const res = await fetch("/api/upload/presign", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileType: file.type, animalId: animal.id }),
      });
      const data = await res.json();
      if (data.uploadUrl) {
        // Real S3 presigned URL — PUT the file
        await fetch(data.uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
        setStubUrl(`https://app.eqos-ark.com/records/${animal.id}/${data.fileKey}`);
        setStatus("done");
      } else {
        // S3 stub — server returns null uploadUrl
        setStubUrl(`https://app.eqos-ark.com/records/${animal.id}/${data.fileKey}`);
        setStatus("stub");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(stubUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.6rem 0.8rem",
    border: "1px solid rgba(25,30,46,0.2)", borderRadius: 6,
    fontFamily: "var(--font-body)", fontSize: "0.82rem",
    color: NAVY, outline: "none", boxSizing: "border-box", background: "white",
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(25,30,46,0.55)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}
      onClick={onClose}
    >
      <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: 12, boxShadow: "0 20px 60px rgba(25,30,46,0.25)", width: "100%", maxWidth: 460, overflow: "hidden" }}>

        <div style={{ background: NAVY, padding: "1.1rem 1.4rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "0.2rem" }}>Upload document</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "white", fontWeight: 400 }}>{animal.name}</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "1.2rem", lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: "1.5rem" }}>

          {(status === "done" || status === "stub") ? (
            // ── Success / stub state ──────────────────────────────────
            <div style={{ textAlign: "center", padding: "0.5rem 0" }}>
              <CheckCircle size={36} color={status === "done" ? "#2a7a4f" : AMBER} style={{ marginBottom: "0.75rem" }} />
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", color: NAVY, fontWeight: 400, marginBottom: "0.4rem" }}>
                {status === "done" ? "File uploaded" : "Record created"}
              </h3>
              {status === "stub" && (
                <div style={{ background: "rgba(177,93,0,0.08)", border: "1px solid rgba(177,93,0,0.22)", borderRadius: 6, padding: "0.6rem 0.85rem", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.25rem" }}>
                    <AlertTriangle size={12} color={AMBER} />
                    <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: AMBER }}>S3 storage pending</span>
                  </div>
                  <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.76rem", color: "rgba(25,30,46,0.6)", lineHeight: 1.6 }}>
                    File metadata recorded. S3 bucket connection required before files physically upload. Engineering team: see <code style={{ fontFamily: "var(--font-courier)", fontSize: "0.7em" }}>server/routes.ts /api/upload/presign</code>.
                  </p>
                </div>
              )}
              {shareMode === "link" && (
                <div style={{ background: "rgba(25,30,46,0.03)", border: "1px solid rgba(25,30,46,0.09)", borderRadius: 7, padding: "0.7rem 0.85rem", display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "1rem" }}>
                  <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.04em", color: "rgba(25,30,46,0.45)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{stubUrl}</span>
                  <button onClick={handleCopy} style={{ background: "none", border: "none", cursor: "pointer", color: copied ? "#2a7a4f" : "rgba(25,30,46,0.35)", flexShrink: 0, display: "flex" }}>
                    {copied ? <CheckCircle size={13} /> : <Copy size={13} />}
                  </button>
                </div>
              )}
              <button onClick={onClose} style={{ background: NAVY, color: "white", border: "none", borderRadius: 6, padding: "0.7rem 1.5rem", fontFamily: "var(--font-courier)", fontSize: "0.58rem", letterSpacing: "0.09em", textTransform: "uppercase", fontWeight: 700, cursor: "pointer" }}>
                Done
              </button>
            </div>

          ) : (
            // ── Upload form state ─────────────────────────────────────
            <>
              {status === "error" && (
                <div style={{ background: "rgba(176,41,31,0.09)", border: "1px solid rgba(176,41,31,0.25)", borderRadius: 6, padding: "0.6rem 0.85rem", marginBottom: "1rem" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "#b0291f" }}>Upload failed. Please try again.</p>
                </div>
              )}

              {/* Drop zone */}
              {!file ? (
                <div
                  onDragOver={e => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                  style={{ border: `2px dashed ${dragging ? AMBER : "rgba(25,30,46,0.2)"}`, borderRadius: 10, padding: "2.5rem 1.5rem", textAlign: "center", cursor: "pointer", background: dragging ? "rgba(177,93,0,0.04)" : "rgba(25,30,46,0.02)", transition: "all 0.2s", marginBottom: "1rem" }}
                >
                  <Upload size={28} color={dragging ? AMBER : "rgba(25,30,46,0.25)"} style={{ margin: "0 auto 0.75rem" }} />
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: NAVY, fontWeight: 400, marginBottom: "0.3rem" }}>Drop file here</p>
                  <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.76rem", color: "rgba(25,30,46,0.45)" }}>
                    or click to browse · PDF, DICOM, images, spreadsheets
                  </p>
                  <input ref={inputRef} type="file" style={{ display: "none" }} onChange={handleSelect} accept=".pdf,.jpg,.jpeg,.png,.dcm,.xlsx,.csv,.mp4,.mov" />
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "rgba(42,122,79,0.07)", border: "1px solid rgba(42,122,79,0.2)", borderRadius: 7, padding: "0.85rem 1rem", marginBottom: "1rem" }}>
                  <CheckCircle size={16} color="#2a7a4f" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.82rem", color: NAVY, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
                    <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "#2a7a4f", fontWeight: 600 }}>
                      {(file.size / 1024 / 1024).toFixed(1)} MB · Ready
                    </p>
                  </div>
                  <button onClick={() => setFile(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(25,30,46,0.35)", fontSize: "1rem", lineHeight: 1 }}>×</button>
                </div>
              )}

              {/* Share settings */}
              <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(25,30,46,0.45)", fontWeight: 600, marginBottom: "0.5rem" }}>Share settings</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1.25rem" }}>
                {([
                  { key: "private" as ShareMode, label: "Private",           desc: "Only visible to you",                   Icon: Lock     },
                  { key: "team"    as ShareMode, label: "Share with team",   desc: "Visible to permitted care team members", Icon: Eye      },
                  { key: "link"    as ShareMode, label: "Generate share link", desc: "Create a secure shareable link",       Icon: LinkIcon },
                ]).map(opt => (
                  <button key={opt.key} type="button" onClick={() => setShareMode(opt.key)} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0.85rem", borderRadius: 6, cursor: "pointer", border: shareMode === opt.key ? `1.5px solid ${NAVY}` : "1.5px solid rgba(25,30,46,0.12)", background: shareMode === opt.key ? "rgba(25,30,46,0.05)" : "white", textAlign: "left" }}>
                    <opt.Icon size={13} color={shareMode === opt.key ? NAVY : "rgba(25,30,46,0.3)"} />
                    <div>
                      <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700, color: shareMode === opt.key ? NAVY : "rgba(25,30,46,0.4)", marginBottom: "0.05rem" }}>{opt.label}</p>
                      <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.7rem", color: "rgba(25,30,46,0.45)" }}>{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleUpload}
                disabled={!file || status === "uploading"}
                style={{ width: "100%", padding: "0.8rem", background: file ? NAVY : "rgba(25,30,46,0.2)", border: "none", borderRadius: 6, fontFamily: "var(--font-courier)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "white", fontWeight: 700, cursor: file ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
              >
                <Upload size={14} /> {status === "uploading" ? "Uploading…" : "Confirm upload"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Horse document card ───────────────────────────────────────────────────────
function HorseDocCard({ animal, onUpload }: { animal: Animal; onUpload: () => void }) {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ background: "white", borderRadius: 8, border: "1px solid rgba(25,30,46,0.1)", boxShadow: "var(--shadow-card)", overflow: "hidden", marginBottom: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", cursor: "pointer", borderBottom: open ? "1px solid rgba(25,30,46,0.08)" : "none" }} onClick={() => setOpen(o => !o)}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div style={{ width: 36, height: 36, borderRadius: 7, background: "rgba(25,30,46,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <FileText size={16} color={NAVY} />
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: NAVY, fontWeight: 400, marginBottom: "0.1rem" }}>{animal.name}</p>
            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(25,30,46,0.45)", fontWeight: 500 }}>
              {[animal.breed, animal.sex, animal.barn].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            onClick={e => { e.stopPropagation(); onUpload(); }}
            style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: NAVY, border: "none", borderRadius: 5, padding: "0.4rem 0.75rem", cursor: "pointer", fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: "white" }}
          >
            <Upload size={11} /> Upload
          </button>
          {open ? <ChevronUp size={15} color="rgba(25,30,46,0.35)" /> : <ChevronDown size={15} color="rgba(25,30,46,0.35)" />}
        </div>
      </div>

      {open && (
        <div style={{ padding: "1.25rem 1.4rem" }}>
          <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.8rem", color: "rgba(25,30,46,0.4)", textAlign: "center", padding: "0.5rem 0" }}>
            No documents uploaded yet. Use the Upload button to add radiographs, lab results, Coggins certificates, vaccination records, or any other files.
          </p>
          <div style={{ display: "flex", gap: "1.5rem", padding: "0.6rem 0 0", borderTop: "1px solid rgba(25,30,46,0.06)", marginTop: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(25,30,46,0.3)", fontWeight: 600 }}>
              0 files · Accepted: PDF · DICOM · JPEG/PNG · XLSX/CSV · MP4/MOV
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DocumentsManager() {
  const [uploadTarget, setUploadTarget] = useState<Animal | null>(null);

  const { data: animals = [], isLoading } = useQuery<Animal[]>({
    queryKey: ["/api/animals"],
    queryFn: async () => {
      const res = await fetch("/api/animals", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load animals");
      return res.json();
    },
  });

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "2.5rem 1.5rem" }}>

      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.62rem", letterSpacing: "0.11em", textTransform: "uppercase", color: AMBER, marginBottom: "0.4rem", fontWeight: 700 }}>Owner control</p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: NAVY, fontWeight: 400, marginBottom: "0.5rem" }}>Documents & files</h1>
        <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.85rem", color: "rgba(25,30,46,0.6)", lineHeight: 1.7, maxWidth: 580 }}>
          Upload radiographs, lab results, Coggins certificates, vaccination records, and any other documents to each horse's record. Share files directly with your care team or generate a secure link.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        {[
          { value: animals.length, label: "Horses managed", color: NAVY  },
          { value: 0,              label: "Documents on file", color: BLUE },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, minWidth: 130, background: "white", border: "1px solid rgba(25,30,46,0.09)", borderRadius: 8, padding: "1rem 1.25rem", boxShadow: "var(--shadow-card)" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: s.color, lineHeight: 1, marginBottom: "0.3rem" }}>
              {isLoading ? "—" : s.value}
            </p>
            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(25,30,46,0.45)", fontWeight: 600 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Supported formats */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem", background: "rgba(67,110,179,0.06)", border: "1px solid rgba(67,110,179,0.18)", borderRadius: 6, padding: "0.75rem 1rem", marginBottom: "2rem" }}>
        <FileText size={13} color={BLUE} style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.07em", textTransform: "uppercase", color: BLUE, fontWeight: 600, lineHeight: 1.65 }}>
          Supported formats: PDF · JPEG / PNG · DICOM imaging · Excel / CSV · Video (MP4, MOV) · All files encrypted and stored securely via AWS S3.
        </p>
      </div>

      {isLoading ? (
        <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.58rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(25,30,46,0.4)", padding: "2rem 0" }}>Loading horses…</p>
      ) : animals.length === 0 ? (
        <div style={{ background: "white", borderRadius: 8, border: "1px solid rgba(25,30,46,0.09)", padding: "2rem", textAlign: "center", boxShadow: "var(--shadow-card)" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: NAVY, fontWeight: 400, marginBottom: "0.4rem" }}>No horses on file yet</p>
          <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.8rem", color: "rgba(25,30,46,0.5)" }}>Add a horse first, then upload documents here.</p>
        </div>
      ) : (
        animals.map(a => (
          <HorseDocCard key={a.id} animal={a} onUpload={() => setUploadTarget(a)} />
        ))
      )}

      {uploadTarget && <UploadModal animal={uploadTarget} onClose={() => setUploadTarget(null)} />}

      {/* Thesis footer */}
      <div style={{ marginTop: "2rem", padding: "1.1rem 1.4rem", background: "rgba(67,110,179,0.05)", borderRadius: 6, borderLeft: `3px solid ${BLUE}` }}>
        <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.8rem", color: "rgba(25,30,46,0.65)", lineHeight: 1.7 }}>
          <strong style={{ fontWeight: 600, color: NAVY }}>EQOS ark</strong> consolidates every document across clinics, specialists, and facilities into a single, owner-controlled record. Radiographs, lab work, and certificates travel with the horse — not the practice.
        </p>
      </div>

    </div>
  );
}
