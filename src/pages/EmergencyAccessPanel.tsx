/**
 * EmergencyAccessPanel — Owner UI for managing emergency / time-limited access tokens.
 * Each token generates a public URL + QR code that any vet can open with no login.
 * Owner can create per-horse tokens, set context (emergency / show / transit /
 * pre-authorized), set duration (up to 60 days), and revoke at any time.
 *
 * Reached from AccessManager or directly via /emergency-access.
 * Owner-only route (ProtectedRoute allowedRoles=["owner"]).
 */
import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Animal } from "@shared/schema";
import {
  Zap, Copy, CheckCircle, Clock, Shield, ShieldOff,
  Plus, ExternalLink, AlertTriangle, ChevronDown, ChevronUp,
  Eye, ArrowLeft, QrCode, Truck, Trophy,
} from "lucide-react";

const NAVY  = "#191e2e";
const AMBER = "#b15d00";
const RED   = "#b0291f";
const BLUE  = "#436eb3";

// Context type and display config
type EAContext = "emergency" | "show" | "transit" | "pre-authorized";

function contextConfig(ctx: EAContext) {
  switch (ctx) {
    case "emergency":     return { icon: <Zap size={13} />,    color: RED,   bg: `rgba(176,41,31,0.09)`,  label: "Emergency"      };
    case "show":          return { icon: <Trophy size={13} />,  color: AMBER, bg: `rgba(177,93,0,0.09)`,   label: "Competition"    };
    case "transit":       return { icon: <Truck size={13} />,   color: BLUE,  bg: `rgba(67,110,179,0.09)`, label: "In transit"     };
    case "pre-authorized":return { icon: <Shield size={13} />,  color: NAVY,  bg: `rgba(25,30,46,0.07)`,   label: "Pre-authorized" };
  }
}

interface EmergencyToken {
  id: string;
  token: string;
  animalId: string;
  label: string;
  context: EAContext;
  durationDays: number;
  status: "active" | "revoked" | "expired";
  accessCount: number;
  lastAccessedAt?: string;
  createdAt: string;
  expiresAt: string;
}

// ── QR code using Google Charts API (no npm dep needed) ──────────────────────
function QRDisplay({ url }: { url: string }) {
  const encoded = encodeURIComponent(url);
  const src = `https://chart.googleapis.com/chart?chs=180x180&cht=qr&chl=${encoded}&choe=UTF-8&chld=H|1`;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
      <img
        src={src}
        alt="QR code for emergency access"
        width={140}
        height={140}
        style={{ borderRadius: 6, border: "1px solid rgba(25,30,46,0.12)", display: "block" }}
      />
      <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.46rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(25,30,46,0.4)", textAlign: "center" }}>
        Scan to open record
      </p>
    </div>
  );
}

// ── Days-remaining badge ──────────────────────────────────────────────────────
function DaysRemaining({ expiresAt }: { expiresAt: string }) {
  const ms = new Date(expiresAt).getTime() - Date.now();
  const days = Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  const color = days <= 3 ? RED : days <= 14 ? AMBER : "#2a7a4f";
  return (
    <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, color }}>
      {days === 0 ? "Expires today" : `${days}d remaining`}
    </span>
  );
}

// ── Create token modal ────────────────────────────────────────────────────────
function CreateTokenModal({
  animals,
  defaultAnimalId,
  onClose,
  onCreated,
}: {
  animals: Animal[];
  defaultAnimalId?: string;
  onClose: () => void;
  onCreated: (token: EmergencyToken, url: string) => void;
}) {
  const [animalId, setAnimalId]   = useState(defaultAnimalId ?? animals[0]?.id ?? "");
  const [label, setLabel]         = useState("");
  const [context, setContext]     = useState<EAContext>("emergency");
  const [duration, setDuration]   = useState(60);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/emergency-access", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ animalId, label, context, durationDays: duration }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json() as Promise<{ emergencyAccess: EmergencyToken; accessUrl: string }>;
    },
    onSuccess: (data) => onCreated(data.emergencyAccess, data.accessUrl),
  });

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.6rem 0.8rem",
    border: "1px solid rgba(25,30,46,0.2)", borderRadius: 6,
    fontFamily: "var(--font-body)", fontSize: "0.82rem",
    color: NAVY, background: "white", outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(25,30,46,0.6)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: 12, boxShadow: "0 24px 64px rgba(25,30,46,0.3)", width: "100%", maxWidth: 460, overflow: "hidden" }}>

        {/* Header */}
        <div style={{ background: NAVY, padding: "1.25rem 1.4rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
              <Zap size={14} color={AMBER} />
              <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.1em", textTransform: "uppercase", color: AMBER, fontWeight: 700 }}>
                Emergency access
              </p>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "white", fontWeight: 400 }}>
              Generate instant access link
            </h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "1.3rem", lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: "1.5rem" }}>

          {mutation.isError && (
            <div style={{ background: "rgba(176,41,31,0.09)", border: "1px solid rgba(176,41,31,0.25)", borderRadius: 6, padding: "0.65rem 0.9rem", marginBottom: "1rem" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: RED }}>Failed to create access link. Please try again.</p>
            </div>
          )}

          {/* Horse selector */}
          <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(25,30,46,0.45)", fontWeight: 600, marginBottom: "0.5rem" }}>Horse</p>
          <select style={{ ...inputStyle, marginBottom: "1rem", appearance: "none" }} value={animalId} onChange={e => setAnimalId(e.target.value)}>
            {animals.map(a => <option key={a.id} value={a.id}>{a.name} — {a.breed}</option>)}
          </select>

          {/* Context */}
          <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(25,30,46,0.45)", fontWeight: 600, marginBottom: "0.5rem" }}>Situation</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", marginBottom: "1rem" }}>
            {(["emergency", "show", "transit", "pre-authorized"] as EAContext[]).map(ctx => {
              const cc = contextConfig(ctx);
              return (
                <button key={ctx} type="button" onClick={() => setContext(ctx)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 0.75rem", borderRadius: 7, cursor: "pointer", border: context === ctx ? `1.5px solid ${cc.color}` : "1.5px solid rgba(25,30,46,0.12)", background: context === ctx ? cc.bg : "white", textAlign: "left" }}>
                  <span style={{ color: context === ctx ? cc.color : "rgba(25,30,46,0.3)" }}>{cc.icon}</span>
                  <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700, color: context === ctx ? cc.color : "rgba(25,30,46,0.4)" }}>{cc.label}</span>
                </button>
              );
            })}
          </div>

          {/* Label */}
          <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(25,30,46,0.45)", fontWeight: 600, marginBottom: "0.5rem" }}>Label (optional)</p>
          <input style={{ ...inputStyle, marginBottom: "1rem" }} value={label} onChange={e => setLabel(e.target.value)} placeholder={`e.g. "${context === "show" ? "WEF 2026 Week 10" : context === "transit" ? "Transport to Ocala" : "On-call emergency"}" `} />

          {/* Duration */}
          <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(25,30,46,0.45)", fontWeight: 600, marginBottom: "0.4rem" }}>
            Duration — <span style={{ color: AMBER }}>{duration} days</span>
          </p>
          <input
            type="range" min={1} max={60} step={1} value={duration}
            onChange={e => setDuration(Number(e.target.value))}
            style={{ width: "100%", marginBottom: "0.3rem", accentColor: AMBER }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            {[1, 3, 7, 14, 30, 60].map(d => (
              <button key={d} type="button" onClick={() => setDuration(d)} style={{ fontFamily: "var(--font-courier)", fontSize: "0.48rem", letterSpacing: "0.05em", color: duration === d ? AMBER : "rgba(25,30,46,0.4)", background: "none", border: "none", cursor: "pointer", fontWeight: duration === d ? 700 : 400 }}>
                {d}d
              </button>
            ))}
          </div>

          {/* Warning notice */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", background: "rgba(176,41,31,0.07)", border: "1px solid rgba(176,41,31,0.2)", borderRadius: 6, padding: "0.65rem 0.85rem", marginBottom: "1.25rem" }}>
            <AlertTriangle size={12} color={RED} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.07em", textTransform: "uppercase", color: RED, fontWeight: 600, lineHeight: 1.65 }}>
              This link gives read-only record access with no login required. Share only with a treating veterinarian. You can revoke it at any time.
            </p>
          </div>

          <button
            onClick={() => mutation.mutate()}
            disabled={!animalId || mutation.isPending}
            style={{ width: "100%", padding: "0.85rem", background: !animalId ? "rgba(25,30,46,0.15)" : NAVY, border: "none", borderRadius: 7, fontFamily: "var(--font-courier)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "white", fontWeight: 700, cursor: !animalId ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
          >
            <Zap size={14} /> {mutation.isPending ? "Generating…" : "Generate access link"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Token result sheet (shown after creation) ─────────────────────────────────
function TokenResultSheet({
  token,
  url,
  horseName,
  onClose,
}: {
  token: EmergencyToken;
  url: string;
  horseName: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const cc = contextConfig(token.context);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1001, background: "rgba(25,30,46,0.6)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: 12, boxShadow: "0 24px 64px rgba(25,30,46,0.3)", width: "100%", maxWidth: 500, overflow: "hidden" }}>

        {/* Success header */}
        <div style={{ background: NAVY, padding: "1.5rem 1.75rem", textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(42,122,79,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.75rem" }}>
            <Zap size={22} color="#5ecf8c" />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "white", fontWeight: 400, marginBottom: "0.3rem" }}>
            Access link ready
          </h2>
          <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.56rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
            {horseName} · {token.durationDays}-day {cc.label} access · Read only
          </p>
        </div>

        <div style={{ padding: "1.75rem" }}>

          {/* Two columns: URL + QR */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1.5rem", alignItems: "start", marginBottom: "1.5rem" }}>
            <div>
              <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(25,30,46,0.4)", fontWeight: 600, marginBottom: "0.5rem" }}>Share this link</p>
              <div style={{ background: "rgba(25,30,46,0.03)", border: "1px solid rgba(25,30,46,0.12)", borderRadius: 7, padding: "0.75rem 0.9rem", display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.65rem" }}>
                <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.04em", color: "rgba(25,30,46,0.55)", flex: 1, wordBreak: "break-all", lineHeight: 1.5 }}>
                  {url}
                </span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={handleCopy} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", background: copied ? "#2a7a4f" : NAVY, border: "none", borderRadius: 6, padding: "0.65rem", fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: "white", cursor: "pointer", transition: "background 0.2s" }}>
                  {copied ? <CheckCircle size={13} /> : <Copy size={13} />}
                  {copied ? "Copied!" : "Copy link"}
                </button>
                <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", background: "rgba(25,30,46,0.07)", border: "1px solid rgba(25,30,46,0.12)", borderRadius: 6, padding: "0.65rem 0.85rem", fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: NAVY, cursor: "pointer", textDecoration: "none" }}>
                  <ExternalLink size={12} /> Preview
                </a>
              </div>
            </div>
            <QRDisplay url={url} />
          </div>

          {/* What the vet sees */}
          <div style={{ background: "rgba(67,110,179,0.05)", border: "1px solid rgba(67,110,179,0.18)", borderRadius: 7, padding: "0.9rem 1.1rem", marginBottom: "1.25rem" }}>
            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.08em", textTransform: "uppercase", color: BLUE, fontWeight: 700, marginBottom: "0.4rem" }}>What the veterinarian sees</p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              {[
                "Full health record — conditions, medications, history",
                "Complete timeline of vet notes, lab work, and imaging",
                "No sign-in required · Immediate access on any device",
                "Soft prompt to create an EQOS ark account for full access",
                `Link expires in ${token.durationDays} days · You can revoke it any time`,
              ].map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                  <CheckCircle size={11} color={BLUE} style={{ flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.79rem", color: "rgba(25,30,46,0.7)", lineHeight: 1.55 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <button onClick={onClose} style={{ width: "100%", padding: "0.75rem", background: "rgba(25,30,46,0.06)", border: "1px solid rgba(25,30,46,0.12)", borderRadius: 7, fontFamily: "var(--font-courier)", fontSize: "0.58rem", letterSpacing: "0.09em", textTransform: "uppercase", fontWeight: 700, color: "rgba(25,30,46,0.6)", cursor: "pointer" }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Active token card ─────────────────────────────────────────────────────────
function TokenCard({
  token,
  animal,
  onRevoke,
}: {
  token: EmergencyToken;
  animal: Animal | undefined;
  onRevoke: (id: string) => void;
}) {
  const [open, setOpen]     = useState(false);
  const [copied, setCopied] = useState(false);
  const cc = contextConfig(token.context);
  const isExpired = token.status === "expired" || new Date(token.expiresAt) < new Date();
  const isActive  = token.status === "active" && !isExpired;
  const url = `${window.location.origin}/#/ea/${token.token}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const statusColor = isActive ? "#2a7a4f" : token.status === "revoked" ? RED : "rgba(25,30,46,0.4)";
  const statusLabel = isActive ? "Active" : token.status === "revoked" ? "Revoked" : "Expired";

  return (
    <div style={{ background: "white", borderRadius: 8, border: `1px solid ${isActive ? "rgba(25,30,46,0.1)" : "rgba(25,30,46,0.06)"}`, boxShadow: isActive ? "var(--shadow-card)" : "none", overflow: "hidden", marginBottom: "0.65rem", opacity: isActive ? 1 : 0.65 }}>
      {/* Row */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.9rem 1.2rem", cursor: "pointer", flexWrap: "wrap" }} onClick={() => setOpen(o => !o)}>

        {/* Context icon */}
        <div style={{ width: 34, height: 34, borderRadius: 7, background: cc.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ color: cc.color }}>{cc.icon}</span>
        </div>

        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.15rem" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", color: NAVY, fontWeight: 400 }}>
              {animal?.name ?? "—"}
            </span>
            {token.label && (
              <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(25,30,46,0.5)" }}>
                {token.label}
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontFamily: "var(--font-courier)", fontSize: "0.49rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700, color: cc.color, background: cc.bg, borderRadius: 4, padding: "0.18rem 0.45rem" }}>
              {cc.icon} {cc.label}
            </span>
            <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, color: statusColor }}>
              {statusLabel}
            </span>
            {isActive && <DaysRemaining expiresAt={token.expiresAt} />}
          </div>
        </div>

        {/* View count */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", flexShrink: 0 }}>
          <Eye size={11} color="rgba(25,30,46,0.35)" />
          <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.05em", color: "rgba(25,30,46,0.45)", fontWeight: 600 }}>
            {token.accessCount} {token.accessCount === 1 ? "view" : "views"}
          </span>
        </div>

        {open ? <ChevronUp size={14} color="rgba(25,30,46,0.35)" /> : <ChevronDown size={14} color="rgba(25,30,46,0.35)" />}
      </div>

      {/* Expanded detail */}
      {open && (
        <div style={{ padding: "0 1.2rem 1.1rem", borderTop: "1px solid rgba(25,30,46,0.07)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1.25rem", alignItems: "start", paddingTop: "1rem" }}>
            <div>
              <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(25,30,46,0.4)", fontWeight: 600, marginBottom: "0.45rem" }}>Access link</p>
              <div style={{ background: "rgba(25,30,46,0.03)", border: "1px solid rgba(25,30,46,0.1)", borderRadius: 6, padding: "0.6rem 0.8rem", display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.65rem" }}>
                <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.04em", color: "rgba(25,30,46,0.45)", flex: 1, wordBreak: "break-all", lineHeight: 1.5 }}>
                  {url}
                </span>
                <button onClick={handleCopy} style={{ background: "none", border: "none", cursor: "pointer", color: copied ? "#2a7a4f" : "rgba(25,30,46,0.35)", flexShrink: 0, display: "flex" }}>
                  {copied ? <CheckCircle size={13} /> : <Copy size={13} />}
                </button>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {isActive && (
                  <>
                    <button onClick={handleCopy} style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: copied ? "#2a7a4f" : NAVY, border: "none", borderRadius: 5, padding: "0.4rem 0.8rem", cursor: "pointer", fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: "white", transition: "background 0.2s" }}>
                      {copied ? <CheckCircle size={11} /> : <Copy size={11} />} {copied ? "Copied" : "Copy link"}
                    </button>
                    <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "rgba(25,30,46,0.06)", border: "1px solid rgba(25,30,46,0.12)", borderRadius: 5, padding: "0.4rem 0.8rem", cursor: "pointer", fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: NAVY, textDecoration: "none" }}>
                      <ExternalLink size={11} /> Preview
                    </a>
                    <button onClick={() => onRevoke(token.id)} style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "rgba(176,41,31,0.08)", border: "1px solid rgba(176,41,31,0.2)", borderRadius: 5, padding: "0.4rem 0.8rem", cursor: "pointer", fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: RED }}>
                      <ShieldOff size={11} /> Revoke
                    </button>
                  </>
                )}
              </div>
            </div>

            {isActive && <QRDisplay url={url} />}
          </div>

          {/* Meta */}
          <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.9rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(25,30,46,0.06)", flexWrap: "wrap" }}>
            {[
              { label: "Created", value: new Date(token.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
              { label: "Expires", value: new Date(token.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
              { label: "Duration", value: `${token.durationDays} days` },
              { label: "Views", value: String(token.accessCount) },
            ].map(m => (
              <div key={m.label}>
                <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.48rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(25,30,46,0.35)", fontWeight: 600 }}>{m.label}</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "rgba(25,30,46,0.7)", fontWeight: 400 }}>{m.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function EmergencyAccessPanel() {
  const qc = useQueryClient();
  const [showCreate, setShowCreate]   = useState(false);
  const [defaultAnimal, setDefaultAnimal] = useState<string | undefined>();
  const [resultToken, setResultToken] = useState<{ token: EmergencyToken; url: string } | null>(null);

  const { data: animals = [], isLoading: loadingAnimals } = useQuery<Animal[]>({
    queryKey: ["/api/animals"],
    queryFn: async () => {
      const res = await fetch("/api/animals", { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const { data: tokens = [], isLoading: loadingTokens } = useQuery<EmergencyToken[]>({
    queryKey: ["/api/emergency-access/mine"],
    queryFn: async () => {
      const res = await fetch("/api/emergency-access/mine", { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const revokeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/emergency-access/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/emergency-access/mine"] }),
  });

  const handleCreated = (token: EmergencyToken, url: string) => {
    setShowCreate(false);
    setResultToken({ token, url });
    qc.invalidateQueries({ queryKey: ["/api/emergency-access/mine"] });
  };

  const activeTokens  = tokens.filter(t => t.status === "active" && new Date(t.expiresAt) > new Date());
  const inactiveTokens = tokens.filter(t => t.status !== "active" || new Date(t.expiresAt) <= new Date());

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "2.5rem 1.5rem" }}>

      {/* Back */}
      <Link href="/access">
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontFamily: "var(--font-courier)", fontSize: "0.56rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(25,30,46,0.45)", cursor: "pointer", marginBottom: "1.5rem" }}>
          <ArrowLeft size={12} /> Back to access manager
        </span>
      </Link>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <Zap size={16} color={AMBER} />
            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.62rem", letterSpacing: "0.11em", textTransform: "uppercase", color: AMBER, fontWeight: 700 }}>Owner control</p>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: NAVY, fontWeight: 400, marginBottom: "0.5rem" }}>
            Emergency access
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.85rem", color: "rgba(25,30,46,0.6)", lineHeight: 1.75, maxWidth: 560 }}>
            Generate an instant, no-login read-only link to your horse's complete health record for any treating veterinarian. Critical for competitions, transport, and care events where your regular vet is unavailable. Links expire automatically and can be revoked at any time.
          </p>
        </div>
        <button
          onClick={() => { setDefaultAnimal(undefined); setShowCreate(true); }}
          disabled={loadingAnimals || animals.length === 0}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: NAVY, border: "none", borderRadius: 7, padding: "0.75rem 1.2rem", cursor: "pointer", fontFamily: "var(--font-courier)", fontSize: "0.58rem", letterSpacing: "0.09em", textTransform: "uppercase", fontWeight: 700, color: "white", flexShrink: 0 }}
        >
          <Plus size={14} /> New access link
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        {[
          { value: animals.length,        label: "Horses managed",    color: NAVY         },
          { value: activeTokens.length,   label: "Active links",      color: "#2a7a4f"    },
          { value: tokens.reduce((n, t) => n + t.accessCount, 0), label: "Total record views", color: BLUE },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, minWidth: 120, background: "white", border: "1px solid rgba(25,30,46,0.09)", borderRadius: 8, padding: "1rem 1.25rem", boxShadow: "var(--shadow-card)" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: s.color, lineHeight: 1, marginBottom: "0.3rem" }}>
              {loadingAnimals || loadingTokens ? "—" : s.value}
            </p>
            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(25,30,46,0.45)", fontWeight: 600 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Product thesis callout */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", background: "rgba(25,30,46,0.03)", border: "1px solid rgba(25,30,46,0.1)", borderRadius: 7, padding: "1rem 1.2rem", marginBottom: "2rem" }}>
        <Shield size={14} color={NAVY} style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.82rem", color: "rgba(25,30,46,0.7)", lineHeight: 1.75 }}>
          <strong style={{ fontWeight: 600, color: NAVY }}>EQOS ark</strong> is owner-controlled. A vet opening an emergency link sees the complete record immediately — no account, no delay, no friction. The link includes a soft prompt to join EQOS ark for full access and ongoing care collaboration.
        </p>
      </div>

      {/* Active tokens */}
      {loadingTokens ? (
        <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.58rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(25,30,46,0.4)", padding: "2rem 0" }}>Loading tokens…</p>
      ) : tokens.length === 0 ? (
        <div style={{ background: "white", borderRadius: 8, border: "1px solid rgba(25,30,46,0.09)", padding: "2.5rem", textAlign: "center", boxShadow: "var(--shadow-card)" }}>
          <Zap size={28} color="rgba(25,30,46,0.2)" style={{ margin: "0 auto 0.75rem" }} />
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", color: NAVY, fontWeight: 400, marginBottom: "0.4rem" }}>No active access links</p>
          <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.8rem", color: "rgba(25,30,46,0.5)", marginBottom: "1.25rem" }}>
            Generate a link before heading to a competition, scheduling transport, or in any care event where your regular vet may not be available.
          </p>
          <button onClick={() => setShowCreate(true)} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: NAVY, border: "none", borderRadius: 6, padding: "0.65rem 1.25rem", cursor: "pointer", fontFamily: "var(--font-courier)", fontSize: "0.56rem", letterSpacing: "0.09em", textTransform: "uppercase", fontWeight: 700, color: "white" }}>
            <Plus size={12} /> Generate first link
          </button>
        </div>
      ) : (
        <>
          {activeTokens.length > 0 && (
            <>
              <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#2a7a4f", fontWeight: 700, marginBottom: "0.75rem" }}>
                Active links — {activeTokens.length}
              </p>
              {activeTokens.map(t => (
                <TokenCard
                  key={t.id}
                  token={t}
                  animal={animals.find(a => a.id === t.animalId)}
                  onRevoke={id => revokeMutation.mutate(id)}
                />
              ))}
            </>
          )}
          {inactiveTokens.length > 0 && (
            <>
              <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.58rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(25,30,46,0.35)", fontWeight: 700, marginTop: "1.5rem", marginBottom: "0.6rem" }}>
                Inactive — revoked / expired
              </p>
              {inactiveTokens.map(t => (
                <TokenCard
                  key={t.id}
                  token={t}
                  animal={animals.find(a => a.id === t.animalId)}
                  onRevoke={id => revokeMutation.mutate(id)}
                />
              ))}
            </>
          )}
        </>
      )}

      {/* Modals */}
      {showCreate && (
        <CreateTokenModal
          animals={animals}
          defaultAnimalId={defaultAnimal}
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}
      {resultToken && (
        <TokenResultSheet
          token={resultToken.token}
          url={resultToken.url}
          horseName={animals.find(a => a.id === resultToken.token.animalId)?.name ?? "Horse"}
          onClose={() => setResultToken(null)}
        />
      )}

    </div>
  );
}
