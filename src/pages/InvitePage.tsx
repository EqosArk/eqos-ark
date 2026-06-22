import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { CheckCircle, AlertTriangle, Loader } from "lucide-react";

const NAVY = "#191e2e";
const BLUE = "#436eb3";
const AMBER = "#b15d00";

interface InviteInfo {
  token: string;
  intendedRole: string;
  invitedEmail?: string;
  accessLevel: string;
  expiresAt: string;
}

export default function InvitePage() {
  const { token } = useParams<{ token: string }>();
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [invite, setInvite] = useState<InviteInfo | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "claiming" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [claimedAnimal, setClaimedAnimal] = useState<{ name: string } | null>(null);

  useEffect(() => {
    async function loadInvite() {
      try {
        const res = await fetch(`/api/invitations/${token}`);
        if (!res.ok) {
          const data = await res.json();
          setMessage(data.error ?? "Invalid invitation.");
          setStatus("error");
          return;
        }
        setInvite(await res.json());
        setStatus("ready");
      } catch {
        setMessage("Network error loading invitation.");
        setStatus("error");
      }
    }
    loadInvite();
  }, [token]);

  const handleClaim = async () => {
    if (!user) return;
    setStatus("claiming");
    try {
      const res = await fetch(`/api/invitations/${token}/claim`, {
        method: "POST", credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) { setMessage(data.error ?? "Failed to claim invitation."); setStatus("error"); return; }
      setClaimedAnimal(data.animal);
      setStatus("success");
    } catch {
      setMessage("Network error. Please try again.");
      setStatus("error");
    }
  };

  const roleSlug = invite?.intendedRole === "vet" ? "vet" : "provider";

  return (
    <div style={{ minHeight: "100vh", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "var(--font-body)" }}>
      <div style={{ width: "100%", maxWidth: 440, textAlign: "center" }}>

        {/* Logo */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: AMBER, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.75rem", fontFamily: "var(--font-display)", fontSize: "1rem", color: "white", fontWeight: 700 }}>E</div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", color: "white", fontWeight: 400 }}>EQOS ark</p>
        </div>

        {/* States */}
        {(status === "loading" || authLoading) && (
          <div style={{ color: "rgba(255,255,255,0.5)" }}>
            <Loader size={24} style={{ animation: "spin 1s linear infinite", margin: "0 auto 0.75rem" }} />
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem" }}>Loading invitation…</p>
          </div>
        )}

        {status === "error" && (
          <div style={{ background: "rgba(176,41,31,0.12)", border: "1px solid rgba(176,41,31,0.3)", borderRadius: 10, padding: "2rem" }}>
            <AlertTriangle size={28} color="#ff8a80" style={{ margin: "0 auto 0.75rem" }} />
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "white", marginBottom: "0.5rem" }}>Invitation unavailable</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "#ff8a80", lineHeight: 1.6 }}>{message}</p>
            <Link href="/"><span style={{ display: "inline-block", marginTop: "1.25rem", fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.08em", textTransform: "uppercase", color: AMBER, cursor: "pointer" }}>← Back to home</span></Link>
          </div>
        )}

        {status === "success" && (
          <div style={{ background: "rgba(42,122,79,0.12)", border: "1px solid rgba(42,122,79,0.3)", borderRadius: 10, padding: "2rem" }}>
            <CheckCircle size={32} color="#4caf7d" style={{ margin: "0 auto 0.75rem" }} />
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "white", marginBottom: "0.5rem" }}>Access granted</p>
            {claimedAnimal && (
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                You now have access to <strong style={{ color: "white" }}>{claimedAnimal.name}</strong>'s health record.
              </p>
            )}
            <button
              onClick={() => navigate("/app")}
              style={{ padding: "0.7rem 1.5rem", background: BLUE, border: "none", borderRadius: 6, fontFamily: "var(--font-courier)", fontSize: "0.58rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "white", fontWeight: 700, cursor: "pointer" }}
            >
              Go to your dashboard →
            </button>
          </div>
        )}

        {status === "ready" && !authLoading && invite && (
          <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderTop: `3px solid ${BLUE}`, borderRadius: 10, padding: "2rem" }}>
            <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.09em", textTransform: "uppercase", color: AMBER, fontWeight: 700, marginBottom: "0.5rem" }}>
              You've been invited
            </p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", color: "white", fontWeight: 400, marginBottom: "0.5rem" }}>
              Join as {invite.intendedRole === "vet" ? "a Veterinarian" : "a Care Provider"}
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.65, marginBottom: "1.5rem" }}>
              An owner has shared access to their horse's health record with you on EQOS ark. {invite.accessLevel === "READ+WRITE" ? "You will be able to view and add records." : "You will be able to view records."}
            </p>

            {user ? (
              // Already signed in — claim directly
              <div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", marginBottom: "1rem" }}>
                  Signed in as <strong style={{ color: "white" }}>{user.firstName} {user.lastName}</strong> ({user.email})
                </p>
                <button
                  onClick={handleClaim}
                  disabled={status === "claiming"}
                  style={{ width: "100%", padding: "0.75rem", background: BLUE, border: "none", borderRadius: 6, fontFamily: "var(--font-courier)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "white", fontWeight: 700, cursor: "pointer" }}
                >
                  {status === "claiming" ? "Accepting…" : "Accept invitation"}
                </button>
              </div>
            ) : (
              // Not signed in — prompt to sign up or sign in
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <Link href={`/signup/${roleSlug}?invite=${token}`}>
                  <button style={{ width: "100%", padding: "0.75rem", background: BLUE, border: "none", borderRadius: 6, fontFamily: "var(--font-courier)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "white", fontWeight: 700, cursor: "pointer" }}>
                    Create account &amp; accept
                  </button>
                </Link>
                <Link href={`/login?invite=${token}`}>
                  <button style={{ width: "100%", padding: "0.75rem", background: "transparent", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 6, fontFamily: "var(--font-courier)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", cursor: "pointer" }}>
                    Already have an account? Sign in
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
