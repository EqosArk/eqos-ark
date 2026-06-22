import { Link, useLocation } from "wouter";
import { Bell, Settings } from "lucide-react";
import eqosLogo from "../assets/eqos-ark-logo-white.png";
import { useAuth } from "@/lib/auth";

export default function NavBar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const isVetView      = location.startsWith("/vet");
  const isProviderView = location.startsWith("/provider");

  // Avatar initials from real session user
  const initials = user
    ? (user.firstName[0] + (user.lastName?.[0] ?? "")).toUpperCase()
    : "—";

  // Role badge
  const roleBadge = isProviderView ? { label: "PROVIDER", color: "#8b1a2f" }
                  : isVetView      ? { label: "VET",      color: "var(--blue)" }
                  :                  { label: "OWNER",    color: "var(--amber)" };

  return (
    <header className="site-header">
      <div className="header-inner">

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <div className="logo-wrap" data-testid="logo">
            <img
              src={eqosLogo}
              alt="EQOS ark"
              style={{ height: 42, width: "auto", objectFit: "contain", filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.3))" }}
            />
          </div>
        </Link>

        {/* Nav — switches by role context */}
        <nav className="site-nav">
          {isProviderView ? (
            <Link href="/provider" className={location === "/provider" ? "active" : ""} data-testid="nav-provider-stable">
              My Stable
            </Link>
          ) : isVetView ? (
            <Link href="/vet" className={location === "/vet" ? "active" : ""} data-testid="nav-vet-caseload">
              My Patients
            </Link>
          ) : (
            <>
              <Link href="/app" className={location === "/app" ? "active" : ""} data-testid="nav-my-animals">
                My Animals
              </Link>
              <Link href="/access" className={location === "/access" ? "active" : ""} data-testid="nav-access">
                Access
              </Link>
              <Link href="/documents" className={location === "/documents" ? "active" : ""} data-testid="nav-documents">
                Documents
              </Link>
            </>
          )}
        </nav>

        {/* Right cluster */}
        <div className="header-actions">

          {/* Role badge */}
          <span
            className="role-badge"
            data-testid="role-badge"
            style={{ background: roleBadge.color, borderColor: roleBadge.color }}
          >
            {roleBadge.label}
          </span>

          <button className="icon-btn" aria-label="Notifications" data-testid="btn-notifications">
            <Bell size={15} />
          </button>
          <button className="icon-btn" aria-label="Settings" data-testid="btn-settings">
            <Settings size={15} />
          </button>
          <div className="avatar" aria-label="User avatar" data-testid="avatar">
            {initials}
          </div>

        </div>

      </div>
    </header>
  );
}
