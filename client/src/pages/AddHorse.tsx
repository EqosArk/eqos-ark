import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { PlusCircle, ArrowRight } from "lucide-react";

const NAVY = "#191e2e";
const BLUE = "#436eb3";
const AMBER = "#b15d00";

const BREEDS = ["Warmblood", "KWPN", "Hanoverian", "Oldenburg", "Zangersheide", "Selle Français", "Irish Sport Horse", "Thoroughbred", "Dutch Warmblood", "Belgian Warmblood", "Other"];
const SEXES = ["Gelding", "Stallion", "Mare"];
const DISCIPLINES = ["Show Jumping", "Dressage", "Eventing", "Hunter/Jumper", "Western", "Pleasure", "Other"];

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.65rem 0.85rem",
  background: "white", border: "1px solid rgba(25,30,46,0.16)",
  borderRadius: 6, fontFamily: "var(--font-body)", fontSize: "0.85rem",
  color: NAVY, outline: "none", boxSizing: "border-box",
};

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1.1rem" }}>
      <label style={{ display: "block", fontFamily: "var(--font-courier)", fontSize: "0.54rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(25,30,46,0.6)", marginBottom: "0.4rem", fontWeight: 700 }}>
        {label}{required && <span style={{ color: AMBER }}> *</span>}
      </label>
      {children}
    </div>
  );
}

export default function AddHorse() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [form, setForm] = useState({
    name: "", breed: "", sex: "", dob: "", microchip: "",
    color: "", barn: "", discipline: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.breed || !form.sex || !form.dob) {
      setError("Name, breed, sex, and date of birth are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/animals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to add horse."); setLoading(false); return; }
      navigate("/app");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "hsl(38,33%,94%)", fontFamily: "var(--font-body)" }}>

      {/* Top bar */}
      <div style={{ background: NAVY, padding: "1rem 2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: AMBER, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: "0.75rem", color: "white", fontWeight: 700 }}>E</div>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "white", fontWeight: 400 }}>EQOS ark</span>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "2.5rem 1.5rem" }}>

        {/* Welcome header */}
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", color: AMBER, fontWeight: 700, marginBottom: "0.4rem" }}>
            Welcome, {user?.firstName}
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", color: NAVY, fontWeight: 400, marginBottom: "0.5rem" }}>
            Add your first horse
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.82rem", color: "rgba(25,30,46,0.62)", lineHeight: 1.7 }}>
            This creates your horse's record in EQOS ark. You can add more horses and invite your care team from your dashboard.
          </p>
        </div>

        {/* Form card */}
        <div style={{ background: "white", borderRadius: 10, boxShadow: "0 2px 12px rgba(25,30,46,0.08)", padding: "1.75rem" }}>
          <form onSubmit={handleSubmit}>

            {error && (
              <div style={{ background: "rgba(176,41,31,0.08)", border: "1px solid rgba(176,41,31,0.3)", borderRadius: 6, padding: "0.65rem 0.9rem", marginBottom: "1.25rem" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "#8a1a10" }}>{error}</p>
              </div>
            )}

            <Field label="Horse Name" required>
              <input required style={inputStyle} value={form.name} onChange={set("name")} placeholder="e.g. Raloma" />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <Field label="Breed" required>
                <select required style={{ ...inputStyle, cursor: "pointer" }} value={form.breed} onChange={set("breed")}>
                  <option value="">Select…</option>
                  {BREEDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </Field>
              <Field label="Sex" required>
                <select required style={{ ...inputStyle, cursor: "pointer" }} value={form.sex} onChange={set("sex")}>
                  <option value="">Select…</option>
                  {SEXES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <Field label="Date of Birth" required>
                <input required type="date" style={inputStyle} value={form.dob} onChange={set("dob")} />
              </Field>
              <Field label="Color / Markings">
                <input style={inputStyle} value={form.color} onChange={set("color")} placeholder="Bay, Chestnut…" />
              </Field>
            </div>

            <Field label="Microchip Number">
              <input style={inputStyle} value={form.microchip} onChange={set("microchip")} placeholder="15-digit chip number" />
            </Field>

            <Field label="Barn / Stable Name">
              <input style={inputStyle} value={form.barn} onChange={set("barn")} placeholder="EQOS Performance Sport" />
            </Field>

            <Field label="Primary Discipline">
              <select style={{ ...inputStyle, cursor: "pointer" }} value={form.discipline} onChange={set("discipline")}>
                <option value="">Select…</option>
                {DISCIPLINES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>

            <button
              type="submit" disabled={loading}
              style={{ width: "100%", padding: "0.8rem", marginTop: "0.5rem", background: NAVY, border: "none", borderRadius: 6, fontFamily: "var(--font-courier)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "white", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
            >
              {loading ? "Adding horse…" : <><PlusCircle size={14} /> Add horse &amp; go to dashboard</>}
            </button>

          </form>
        </div>

        {/* Skip link */}
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button
            onClick={() => navigate("/app")}
            style={{ background: "none", border: "none", fontFamily: "var(--font-courier)", fontSize: "0.5rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(25,30,46,0.35)", cursor: "pointer" }}
          >
            Skip for now — go to dashboard →
          </button>
        </div>

      </div>
    </div>
  );
}
