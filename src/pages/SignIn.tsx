import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";

const NAVY = "#191e2e";
const BLUE = "#436eb3";
const AMBER = "#b15d00";
const LINEN = "#ded8cd";

export default function SignIn() {
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      navigate("/app");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "var(--font-body)" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: AMBER, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontFamily: "var(--font-display)", fontSize: "1rem", color: "white", fontWeight: 700 }}>E</div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "white", fontWeight: 400 }}>EQOS ark</p>
          <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginTop: "0.3rem" }}>Sign in to your account</p>
        </div>

        {/* Card */}
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "2rem" }}>
          <form onSubmit={handleSubmit}>

            {error && (
              <div style={{ background: "rgba(176,41,31,0.12)", border: "1px solid rgba(176,41,31,0.35)", borderRadius: 6, padding: "0.65rem 0.9rem", marginBottom: "1.25rem" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "#ff8a80", lineHeight: 1.5 }}>{error}</p>
              </div>
            )}

            <div style={{ marginBottom: "1.1rem" }}>
              <label style={{ display: "block", fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "0.4rem", fontWeight: 600 }}>Email</label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{ width: "100%", padding: "0.65rem 0.85rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 6, fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "white", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "0.4rem", fontWeight: 600 }}>Password</label>
              <input
                type="password" required value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: "100%", padding: "0.65rem 0.85rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 6, fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "white", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <button
              type="submit" disabled={loading}
              style={{ width: "100%", padding: "0.75rem", background: BLUE, border: "none", borderRadius: 6, fontFamily: "var(--font-courier)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "white", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, transition: "opacity 0.15s" }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>

          </form>
        </div>

        {/* Footer links */}
        <div style={{ textAlign: "center", marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
            Don't have an account?
          </p>
          <div style={{ display: "flex", gap: "1.25rem", justifyContent: "center", flexWrap: "wrap" }}>
            {[{ label: "Owner", href: "/signup/owner" }, { label: "Veterinarian", href: "/signup/vet" }, { label: "Care Provider", href: "/signup/provider" }].map(r => (
              <Link key={r.href} href={r.href}>
                <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.07em", textTransform: "uppercase", color: AMBER, cursor: "pointer", textDecoration: "underline" }}>{r.label}</span>
              </Link>
            ))}
          </div>
          <Link href="/">
            <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", cursor: "pointer" }}>← Back to landing</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
