import { Link } from "wouter";
import horseLanding from "../assets/horse-landing.jpg";
import eqosLogo from "../assets/eqos-ark-logo-white.png";

export default function Landing() {
  return (
    <div style={{
      position: "relative",
      minHeight: "100vh",
      width: "100%",
      fontFamily: "var(--font-body)",
      overflow: "hidden",
    }}>

      {/* ── Full-bleed background photo ───────────────────────────────── */}
      <img
        src={horseLanding}
        alt=""
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center right",
          zIndex: 0,
        }}
      />

      {/* ── Dark overlay — matches slide depth ───────────────────────── */}
      <div style={{
        position: "fixed",
        inset: 0,
        background: "linear-gradient(to right, rgba(20,24,38,0.92) 0%, rgba(20,24,38,0.75) 55%, rgba(20,24,38,0.35) 100%)",
        zIndex: 1,
      }} />

      {/* ── All content above overlay ─────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 2, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* ── Top-left logo — real EQOS ark logo mark ─────────────── */}
        <div style={{ padding: "1.75rem 2.5rem" }}>
          <img
            src={eqosLogo}
            alt="EQOS ark"
            style={{
              height: 72,
              width: "auto",
              objectFit: "contain",
              objectPosition: "left center",
              filter: "drop-shadow(0 1px 6px rgba(0,0,0,0.45))",
            }}
          />
        </div>

        {/* ── Hero content — left-aligned, lower third ──────────────── */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 2.5rem 3.5rem",
          maxWidth: 680,
        }}>

          {/* Amber rule — exactly as in slide */}
          <div style={{
            width: 52,
            height: 3,
            background: "#b15d00",
            borderRadius: 2,
            marginBottom: "1.75rem",
          }} />

          {/* Main headline — large Playfair Display */}
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(3rem, 6vw, 5rem)",
            color: "#ffffff",
            lineHeight: 1.08,
            marginBottom: "1.1rem",
            letterSpacing: "-0.01em",
          }}>
            EQOS ark
          </h1>

          {/* Blue italic tagline — Playfair italic */}
          <p style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(1.05rem, 2.2vw, 1.45rem)",
            color: "#436eb3",
            lineHeight: 1.4,
            marginBottom: "1.25rem",
            maxWidth: 580,
          }}>
            The owner-authorized data and intelligence layer for animal health
          </p>

          {/* Body copy — Lato light, white */}
          <p style={{
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: "clamp(0.82rem, 1.4vw, 0.95rem)",
            color: "rgba(255,255,255,0.78)",
            lineHeight: 1.75,
            maxWidth: 520,
            marginBottom: "2.5rem",
          }}>
            One permissioned system connecting owner, veterinarian, and animal — so the full health story is always in one place, ready when it matters.
          </p>

          {/* ── Role entry row ─────────────────────────────────────── */}
          <div style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: "2rem",
          }}>
            {[
              { label: "Owner", href: "/signup/owner", primary: true },
              { label: "Veterinarian", href: "/signup/vet", primary: false },
              { label: "Care Provider", href: "/signup/provider", primary: false },
            ].map(btn => (
              <Link key={btn.href} href={btn.href}>
                <div style={{
                  padding: btn.primary ? "0.7rem 1.5rem" : "0.65rem 1.25rem",
                  background: btn.primary ? "#b15d00" : "rgba(255,255,255,0.08)",
                  border: btn.primary ? "none" : "1px solid rgba(255,255,255,0.25)",
                  borderRadius: 5,
                  cursor: "pointer",
                  fontFamily: "var(--font-courier)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                  fontWeight: btn.primary ? 700 : 500,
                  whiteSpace: "nowrap",
                  transition: "background 0.15s, border-color 0.15s",
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.background = btn.primary ? "#8a4700" : "rgba(255,255,255,0.14)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.background = btn.primary ? "#b15d00" : "rgba(255,255,255,0.08)";
                  }}
                >
                  {btn.label}
                </div>
              </Link>
            ))}
          </div>

          {/* Sign-in link */}
          <Link href="/login">
            <span style={{
              fontFamily: "var(--font-courier)",
              fontSize: "0.52rem",
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.38)",
              cursor: "pointer",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.38)")}
            >
              Already have an account? Sign in →
            </span>
          </Link>

        </div>

      </div>
    </div>
  );
}
