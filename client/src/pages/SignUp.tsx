import { useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import { useAuth } from "@/lib/auth";
import type { SignupData } from "@/lib/auth";
import { Shield, Stethoscope, HeartPulse, ArrowLeft, Check } from "lucide-react";

const NAVY = "#191e2e";
const BLUE = "#436eb3";
const AMBER = "#b15d00";

type Role = "owner" | "vet" | "care_provider";

const ROLE_CONFIG = {
  owner: {
    role: "owner" as Role,
    icon: Shield,
    title: "Horse Owner",
    accent: AMBER,
    extraFields: null,
    description: "Create your account to add horses and invite your care team.",
  },
  vet: {
    role: "vet" as Role,
    icon: Stethoscope,
    title: "Veterinarian",
    accent: BLUE,
    extraFields: ["license", "practice"] as const,
    description: "Create your account to accept owner invitations and access patient records.",
  },
  provider: {
    role: "care_provider" as Role,
    icon: HeartPulse,
    title: "Care Provider",
    accent: "#8b1a2f",
    extraFields: ["credentialType", "practice"] as const,
    description: "Create your account to join a horse owner's care team.",
  },
};

const CREDENTIAL_TYPES = ["Farrier", "Dentist", "Chiropractor", "Trainer", "Physical Therapist", "Nutritionist", "Other"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "0.4rem", fontWeight: 600 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.65rem 0.85rem",
  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 6, fontFamily: "var(--font-body)", fontSize: "0.85rem",
  color: "white", outline: "none", boxSizing: "border-box",
};

export default function SignUp() {
  const params = useParams<{ roleSlug: string }>();
  const roleSlug = params.roleSlug as "owner" | "vet" | "provider";
  const config = ROLE_CONFIG[roleSlug] ?? ROLE_CONFIG.owner;
  const { signup } = useAuth();
  const [, navigate] = useLocation();

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    password: "", confirmPassword: "",
    licenseNumber: "", practice: "", credentialType: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const Icon = config.icon;

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }

    setLoading(true);
    const data: SignupData = {
      email: form.email, password: form.password, role: config.role,
      firstName: form.firstName, lastName: form.lastName,
      phone: form.phone || undefined,
      licenseNumber: form.licenseNumber || undefined,
      practice: form.practice || undefined,
      credentialType: form.credentialType || undefined,
    };
    const result = await signup(data);
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    navigate("/app");
  };

  return (
    <div style={{ minHeight: "100vh", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "var(--font-body)" }}>
      <div style={{ width: "100%", maxWidth: 480 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: 44, height: 44, borderRadius: 8, background: `${config.accent}20`, border: `1px solid ${config.accent}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
            <Icon size={20} color={config.accent} />
          </div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "white", fontWeight: 400, marginBottom: "0.3rem" }}>
            {config.title}
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
            {config.description}
          </p>
        </div>

        {/* Form card */}
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderTop: `3px solid ${config.accent}`, borderRadius: 10, padding: "1.75rem" }}>
          <form onSubmit={handleSubmit}>

            {error && (
              <div style={{ background: "rgba(176,41,31,0.12)", border: "1px solid rgba(176,41,31,0.35)", borderRadius: 6, padding: "0.65rem 0.9rem", marginBottom: "1.25rem" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "#ff8a80" }}>{error}</p>
              </div>
            )}

            {/* Name row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <Field label="First Name">
                <input required style={inputStyle} value={form.firstName} onChange={set("firstName")} placeholder="Jane" />
              </Field>
              <Field label="Last Name">
                <input required style={inputStyle} value={form.lastName} onChange={set("lastName")} placeholder="Smith" />
              </Field>
            </div>

            <Field label="Email Address">
              <input required type="email" style={inputStyle} value={form.email} onChange={set("email")} placeholder="jane@example.com" />
            </Field>

            <Field label="Phone (optional)">
              <input type="tel" style={inputStyle} value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000" />
            </Field>

            {/* Vet fields */}
            {config.extraFields?.includes("license") && (
              <Field label="License / NPI Number">
                <input style={inputStyle} value={form.licenseNumber} onChange={set("licenseNumber")} placeholder="DVM License or NPI" />
              </Field>
            )}

            {/* Care provider credential type */}
            {config.extraFields?.includes("credentialType") && (
              <Field label="Credential Type">
                <select style={{ ...inputStyle, cursor: "pointer" }} value={form.credentialType} onChange={set("credentialType")}>
                  <option value="">Select…</option>
                  {CREDENTIAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
            )}

            {/* Practice (vet + provider) */}
            {config.extraFields?.includes("practice") && (
              <Field label="Practice / Business Name">
                <input style={inputStyle} value={form.practice} onChange={set("practice")} placeholder="Lakeside Equine Practice" />
              </Field>
            )}

            <Field label="Password">
              <input required type="password" style={inputStyle} value={form.password} onChange={set("password")} placeholder="Minimum 8 characters" />
            </Field>

            <Field label="Confirm Password">
              <input required type="password" style={inputStyle} value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="Repeat password" />
            </Field>

            <button
              type="submit" disabled={loading}
              style={{ width: "100%", padding: "0.8rem", marginTop: "0.5rem", background: config.accent, border: "none", borderRadius: 6, fontFamily: "var(--font-courier)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "white", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Creating account…" : `Create ${config.title} Account`}
            </button>

          </form>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.52rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
            Already have an account?{" "}
            <Link href="/login"><span style={{ color: AMBER, cursor: "pointer", textDecoration: "underline" }}>Sign in</span></Link>
          </p>
          <Link href="/">
            <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", cursor: "pointer" }}>← Back to landing</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
