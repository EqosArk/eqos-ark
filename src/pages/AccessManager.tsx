/**
 * AccessManager — Owner view for managing care team access per horse (MVP).
 * Reads animals from /api/animals, invitations from /api/invitations/mine.
 * Creates new invitations via POST /api/invitations.
 * Owner-only route (ProtectedRoute allowedRoles=["owner"]).
 */
import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Animal } from "@shared/schema";
import {
  Shield, Stethoscope, HeartPulse, Mail, Copy,
  CheckCircle, Clock, XCircle, Plus, ChevronDown, ChevronUp,
  Lock, Eye, Edit2, Zap,
} from "lucide-react";

const NAVY  = "#191e2e";
const AMBER = "#b15d00";
const BLUE  = "#436eb3";
const BURG  = "#8b1a2f";

type AccessLevel = "READ" | "READ+APPEND" | "READ+WRITE";
type InviteRole  = "vet" | "care_provider";

interface Invitation {
  id: string;
  animalId: string;
  invitedEmail?: string;
  intendedRole: InviteRole;
  accessLevel: AccessLevel;
  status: "pending" | "accepted" | "expired";
  token: string;
  createdAt: string;
  expiresAt: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function roleConfig(role: InviteRole) {
  return role === "vet"
    ? { icon: Stethoscope, color: BLUE,  label: "Veterinarian"  }
    : { icon: HeartPulse,  color: BURG,  label: "Care Provider" };
}

function accessConfig(level: AccessLevel) {
  switch (level) {
    case "READ+WRITE":  return { icon: Edit2, color: NAVY,  label: "Full access",  desc: "View + add records"   };
    case "READ+APPEND": return { icon: Eye,   color: BLUE,  label: "View & append", desc: "View + own records only" };
    case "READ":        return { icon: Lock,  color: AMBER, label: "Read only",    desc: "View records only"    };
  }
}

function statusConfig(s: string) {
  switch (s) {
    case "accepted": return { icon: CheckCircle, color: "#2a7a4f", label: "Active"   };
    case "pending":  return { icon: Clock,       color: AMBER,     label: "Pending"  };
    default:         return { icon: XCircle,     color: "#b0291f", label: "Expired"  };
  }
}

// ── Invite modal ──────────────────────────────────────────────────────────────
function InviteModal({
  animal,
  onClose,
}: {
  animal: Animal;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [role, setRole]   = useState<InviteRole>("vet");
  const [level, setLevel] = useState<AccessLevel>("READ+WRITE");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<{ inviteUrl: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/invitations", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          animalId: animal.id,
          invitedEmail: email.trim() || undefined,
          intendedRole: role,
          accessLevel: level,
        }),
      });
      if (!res.ok) throw new Error("Failed to create invitation");
      return res.json() as Promise<{ invitation: Invitation; inviteUrl: string }>;
    },
    onSuccess: (data) => {
      setResult({ inviteUrl: data.inviteUrl });
      qc.invalidateQueries({ queryKey: ["/api/invitations/mine"] });
    },
  });

  const handleCopy = () => {
    if (result?.inviteUrl) {
      navigator.clipboard.writeText(result.inviteUrl).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
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
      <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: 12, boxShadow: "0 20px 60px rgba(25,30,46,0.25)", width: "100%", maxWidth: 480, overflow: "hidden" }}>

        {/* Header */}
        <div style={{ background: NAVY, padding: "1.1rem 1.4rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "0.2rem" }}>Invite to care team</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "white", fontWeight: 400 }}>{animal.name}</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "1.2rem", lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: "1.5rem" }}>
          {result ? (
            // ── Success state ──────────────────────────────────────────
            <div style={{ textAlign: "center", padding: "0.5rem 0" }}>
              <CheckCircle size={36} color="#2a7a4f" style={{ marginBottom: "0.75rem" }} />
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", color: NAVY, fontWeight: 400, marginBottom: "0.4rem" }}>Invitation created</h3>
              <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.82rem", color: "rgba(25,30,46,0.55)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                {email ? `An invite link has been generated for ${email}.` : "Share the link below with the care team member."} They will be prompted to create an account and accept access.
              </p>
              <div style={{ background: "rgba(25,30,46,0.04)", border: "1px solid rgba(25,30,46,0.1)", borderRadius: 7, padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "1rem" }}>
                <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.04em", color: "rgba(25,30,46,0.5)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {result.inviteUrl}
                </span>
                <button onClick={handleCopy} style={{ background: "none", border: "none", cursor: "pointer", color: copied ? "#2a7a4f" : "rgba(25,30,46,0.4)", flexShrink: 0, display: "flex" }}>
                  {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                </button>
              </div>
              <button onClick={onClose} style={{ background: NAVY, color: "white", border: "none", borderRadius: 6, padding: "0.7rem 1.5rem", fontFamily: "var(--font-courier)", fontSize: "0.58rem", letterSpacing: "0.09em", textTransform: "uppercase", fontWeight: 700, cursor: "pointer" }}>
                Done
              </button>
            </div>
          ) : (
            // ── Form state ─────────────────────────────────────────────
            <>
              {mutation.isError && (
                <div style={{ background: "rgba(176,41,31,0.09)", border: "1px solid rgba(176,41,31,0.25)", borderRadius: 6, padding: "0.6rem 0.85rem", marginBottom: "1rem" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "#b0291f" }}>Failed to create invitation. Please try again.</p>
                </div>
              )}

              {/* Role picker */}
              <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(25,30,46,0.45)", fontWeight: 600, marginBottom: "0.5rem" }}>Role</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1rem" }}>
                {(["vet", "care_provider"] as InviteRole[]).map(r => {
                  const rc = roleConfig(r);
                  const Icon = rc.icon;
                  return (
                    <button key={r} type="button" onClick={() => setRole(r)} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.65rem 0.85rem", borderRadius: 7, cursor: "pointer", border: role === r ? `1.5px solid ${rc.color}` : "1.5px solid rgba(25,30,46,0.12)", background: role === r ? `${rc.color}10` : "white", textAlign: "left" }}>
                      <Icon size={14} color={role === r ? rc.color : "rgba(25,30,46,0.3)"} />
                      <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700, color: role === r ? rc.color : "rgba(25,30,46,0.4)" }}>{rc.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Access level */}
              <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(25,30,46,0.45)", fontWeight: 600, marginBottom: "0.5rem" }}>Access level</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginBottom: "1rem" }}>
                {(["READ+WRITE", "READ+APPEND", "READ"] as AccessLevel[]).map(lv => {
                  const ac = accessConfig(lv);
                  const Icon = ac.icon;
                  return (
                    <button key={lv} type="button" onClick={() => setLevel(lv)} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0.85rem", borderRadius: 6, cursor: "pointer", border: level === lv ? `1.5px solid ${ac.color}` : "1.5px solid rgba(25,30,46,0.1)", background: level === lv ? `${ac.color}0d` : "white", textAlign: "left" }}>
                      <Icon size={13} color={level === lv ? ac.color : "rgba(25,30,46,0.3)"} />
                      <div>
                        <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700, color: level === lv ? ac.color : "rgba(25,30,46,0.4)", marginBottom: "0.05rem" }}>{ac.label}</p>
                        <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.72rem", color: "rgba(25,30,46,0.45)" }}>{ac.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Email */}
              <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(25,30,46,0.45)", fontWeight: 600, marginBottom: "0.5rem" }}>Email (optional)</p>
              <input type="email" style={{ ...inputStyle, marginBottom: "1.25rem" }} value={email} onChange={e => setEmail(e.target.value)} placeholder="provider@example.com — leave blank to just copy link" />

              <button
                onClick={() => mutation.mutate()}
                disabled={mutation.isPending}
                style={{ width: "100%", padding: "0.8rem", background: NAVY, border: "none", borderRadius: 6, fontFamily: "var(--font-courier)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "white", fontWeight: 700, cursor: mutation.isPending ? "not-allowed" : "pointer", opacity: mutation.isPending ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
              >
                <Mail size={14} /> {mutation.isPending ? "Creating…" : "Create invitation"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Invitation row ────────────────────────────────────────────────────────────
function InviteRow({ inv, animals }: { inv: Invitation; animals: Animal[] }) {
  const rc  = roleConfig(inv.intendedRole);
  const ac  = accessConfig(inv.accessLevel);
  const sc  = statusConfig(inv.status);
  const RoleIcon   = rc.icon;
  const StatusIcon = sc.icon;
  const AccessIcon = ac.icon;
  const horse = animals.find(a => a.id === inv.animalId);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.85rem 1.1rem", borderBottom: "1px solid rgba(25,30,46,0.07)", flexWrap: "wrap" }}>
      <div style={{ width: 34, height: 34, borderRadius: 7, flexShrink: 0, background: `${rc.color}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <RoleIcon size={15} color={rc.color} />
      </div>
      <div style={{ flex: 1, minWidth: 160 }}>
        <p style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.85rem", color: NAVY, marginBottom: "0.1rem" }}>
          {inv.invitedEmail ?? "Link invite (no email)"}
        </p>
        <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(25,30,46,0.45)", fontWeight: 500 }}>
          {rc.label} · {horse?.name ?? inv.animalId}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", flexShrink: 0 }}>
        <AccessIcon size={11} color={ac.color} />
        <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700, color: ac.color }}>{ac.label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", flexShrink: 0 }}>
        <StatusIcon size={11} color={sc.color} />
        <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700, color: sc.color }}>{sc.label}</span>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0, minWidth: 90 }}>
        <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.05em", color: "rgba(25,30,46,0.38)" }}>
          {new Date(inv.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
      </div>
    </div>
  );
}

// ── Horse access card ─────────────────────────────────────────────────────────
function HorseAccessCard({
  animal,
  invitations,
  onInvite,
}: {
  animal: Animal;
  invitations: Invitation[];
  onInvite: () => void;
}) {
  const [open, setOpen] = useState(true);
  const myInvites = invitations.filter(i => i.animalId === animal.id);
  const pendingCount = myInvites.filter(i => i.status === "pending").length;

  return (
    <div style={{ background: "white", borderRadius: 8, border: "1px solid rgba(25,30,46,0.1)", boxShadow: "var(--shadow-card)", overflow: "hidden", marginBottom: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", cursor: "pointer", borderBottom: open ? "1px solid rgba(25,30,46,0.08)" : "none" }} onClick={() => setOpen(o => !o)}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div style={{ width: 36, height: 36, borderRadius: 7, background: "rgba(25,30,46,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Shield size={16} color={NAVY} />
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: NAVY, fontWeight: 400, marginBottom: "0.1rem" }}>{animal.name}</p>
            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(25,30,46,0.45)", fontWeight: 500 }}>
              {[animal.breed, animal.sex, animal.barn].filter(Boolean).join(" · ")}
            </p>
          </div>
          {pendingCount > 0 && (
            <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.48rem", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 700, color: AMBER, background: "rgba(177,93,0,0.1)", border: "1px solid rgba(177,93,0,0.25)", borderRadius: 4, padding: "0.2rem 0.5rem" }}>
              {pendingCount} pending
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            onClick={e => { e.stopPropagation(); onInvite(); }}
            style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: NAVY, border: "none", borderRadius: 5, padding: "0.4rem 0.75rem", cursor: "pointer", fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: "white" }}
          >
            <Plus size={11} /> Invite
          </button>
          {open ? <ChevronUp size={15} color="rgba(25,30,46,0.35)" /> : <ChevronDown size={15} color="rgba(25,30,46,0.35)" />}
        </div>
      </div>

      {open && (
        <div>
          {myInvites.length === 0 ? (
            <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.8rem", color: "rgba(25,30,46,0.4)", padding: "1.1rem", textAlign: "center" }}>
              No invitations yet — invite a veterinarian or care provider.
            </p>
          ) : (
            myInvites.map(inv => <InviteRow key={inv.id} inv={inv} animals={[animal]} />)
          )}
          <div style={{ display: "flex", padding: "0.6rem 1.25rem", background: "rgba(25,30,46,0.02)", borderTop: "1px solid rgba(25,30,46,0.06)", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(25,30,46,0.35)", fontWeight: 600 }}>
              {myInvites.filter(i => i.status === "accepted").length} active · {pendingCount} pending · Access controlled by owner
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AccessManager() {
  const [inviteTarget, setInviteTarget] = useState<Animal | null>(null);

  const { data: animals = [], isLoading: loadingAnimals } = useQuery<Animal[]>({
    queryKey: ["/api/animals"],
    queryFn: async () => {
      const res = await fetch("/api/animals", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load animals");
      return res.json();
    },
  });

  const { data: invitations = [], isLoading: loadingInvites } = useQuery<Invitation[]>({
    queryKey: ["/api/invitations/mine"],
    queryFn: async () => {
      const res = await fetch("/api/invitations/mine", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load invitations");
      return res.json();
    },
  });

  const totalActive  = invitations.filter(i => i.status === "accepted").length;
  const totalPending = invitations.filter(i => i.status === "pending").length;

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "2.5rem 1.5rem" }}>

      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.62rem", letterSpacing: "0.11em", textTransform: "uppercase", color: AMBER, marginBottom: "0.4rem", fontWeight: 700 }}>Owner control</p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: NAVY, fontWeight: 400, marginBottom: "0.5rem" }}>Manage access</h1>
        <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.85rem", color: "rgba(25,30,46,0.6)", lineHeight: 1.7, maxWidth: 580 }}>
          You control who can view or contribute to each horse's health record. Invite veterinarians and care providers, set access levels, and revoke access at any time.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        {[
          { value: animals.length,  label: "Horses managed",     color: NAVY         },
          { value: totalActive,     label: "Active team members", color: "#2a7a4f"    },
          { value: totalPending,    label: "Pending invites",     color: AMBER        },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, minWidth: 130, background: "white", border: "1px solid rgba(25,30,46,0.09)", borderRadius: 8, padding: "1rem 1.25rem", boxShadow: "var(--shadow-card)" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: s.color, lineHeight: 1, marginBottom: "0.3rem" }}>
              {loadingAnimals || loadingInvites ? "—" : s.value}
            </p>
            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(25,30,46,0.45)", fontWeight: 600 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Emergency access CTA */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", background: NAVY, borderRadius: 8, padding: "1.1rem 1.4rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Zap size={18} color="#b15d00" />
          <div>
            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#b15d00", fontWeight: 700, marginBottom: "0.2rem" }}>Emergency access</p>
            <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.8rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>Generate an instant no-login link for any vet at a show, during transport, or in an emergency — active in seconds, valid up to 60 days.</p>
          </div>
        </div>
        <Link href="/emergency-access">
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "#b15d00", color: "white", border: "none", borderRadius: 6, padding: "0.65rem 1.15rem", fontFamily: "var(--font-courier)", fontSize: "0.56rem", letterSpacing: "0.09em", textTransform: "uppercase", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", textDecoration: "none" }}>
            <Zap size={12} /> Manage emergency links
          </span>
        </Link>
      </div>

      {/* Platform notice */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem", background: "rgba(67,110,179,0.06)", border: "1px solid rgba(67,110,179,0.2)", borderRadius: 6, padding: "0.75rem 1rem", marginBottom: "2rem" }}>
        <Lock size={13} color={BLUE} style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.07em", textTransform: "uppercase", color: BLUE, fontWeight: 600, lineHeight: 1.65 }}>
          EQOS ark is an owner-controlled platform. All access is granted and managed by you. Invitees receive a secure link and must create a verified account to view records.
        </p>
      </div>

      {/* Horse cards */}
      {loadingAnimals ? (
        <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.58rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(25,30,46,0.4)", padding: "2rem 0" }}>Loading horses…</p>
      ) : (
        animals.map(a => (
          <HorseAccessCard
            key={a.id}
            animal={a}
            invitations={invitations}
            onInvite={() => setInviteTarget(a)}
          />
        ))
      )}

      {inviteTarget && <InviteModal animal={inviteTarget} onClose={() => setInviteTarget(null)} />}

      {/* Thesis footer */}
      <div style={{ marginTop: "2rem", padding: "1.1rem 1.4rem", background: "rgba(67,110,179,0.05)", borderRadius: 6, borderLeft: `3px solid ${BLUE}` }}>
        <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.8rem", color: "rgba(25,30,46,0.65)", lineHeight: 1.7 }}>
          <strong style={{ fontWeight: 600, color: NAVY }}>EQOS ark</strong> ensures that the owner is always in control of the care record. Permissioned access means every team member sees exactly what they need, nothing more.
        </p>
      </div>

    </div>
  );
}
