import { useParams, Link } from "wouter";
import { mockAnimals, mockRecords } from "@/lib/mockData";
import {
  weightSeries, lamenessSeries, labTrendSeries,
  medicationEvents, activitySeries, healthKPIs,
} from "@/lib/mockHealthMetrics";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
  Area, AreaChart, Legend,
} from "recharts";
import { ChevronLeft, TrendingUp, TrendingDown, Minus, Activity, Scale, FlaskConical, Pill, ArrowRight } from "lucide-react";
import horseCopperfieldVDLImg from "@assets/horse-copperfield-vdl.jpg";
import horseSacardaImg from "@assets/horse-sacarda.jpg";

const horsePhotos: Record<string, string> = {
  "raloma":           horseCopperfieldVDLImg,
  "illusive-z":       horseSacardaImg,
  "independence-vdl": horseSacardaImg,
};

/* ── Brand tokens ───────────────────────────────────────────────── */
const NAVY  = "#191e2e";
const BLUE  = "#436eb3";
const AMBER = "#b15d00";
const LINEN = "#ded8cd";

/* ── Intensity colour map for activity bars ─────────────────────── */
const intensityColor: Record<string, string> = {
  rest:   "#cdc7ba",
  walk:   "#9eb8e0",
  trot:   BLUE,
  canter: AMBER,
  jump:   NAVY,
};

/* ── KPI Card ────────────────────────────────────────────────────── */
function KpiCard({
  label, value, sub, trend, icon,
}: {
  label: string; value: string; sub: string;
  trend: "up" | "down" | "stable" | "improving";
  icon: React.ReactNode;
}) {
  const trendIcon =
    trend === "up"       ? <TrendingUp  size={13} style={{ color: AMBER }} /> :
    trend === "down"     ? <TrendingDown size={13} style={{ color: "#c53030" }} /> :
    trend === "improving"? <TrendingUp  size={13} style={{ color: BLUE  }} /> :
                           <Minus       size={13} style={{ color: "#6b6660" }} />;

  return (
    <div className="card card-blue-top" style={{ minWidth: 0 }}>
      <div className="card-body" style={{ padding: "1rem 1.125rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
          <span style={{
            fontFamily: "var(--font-courier)", fontSize: "0.5625rem",
            fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            color: "var(--amber)",
          }}>
            {label}
          </span>
          <span style={{ color: "var(--blue)", opacity: 0.5 }}>{icon}</span>
        </div>
        <p style={{
          fontFamily: "var(--font-display)", fontSize: "1.75rem",
          fontWeight: 400, color: "var(--navy)", lineHeight: 1,
          marginBottom: "0.375rem",
        }}>
          {value}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
          {trendIcon}
          <span style={{
            fontFamily: "var(--font-body)", fontWeight: 300,
            fontSize: "0.6875rem", color: "rgba(25,30,46,0.5)",
          }}>
            {sub}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Chart section wrapper ──────────────────────────────────────── */
function ChartCard({ label, children, action }: {
  label: string; children: React.ReactNode; action?: React.ReactNode;
}) {
  return (
    <div className="card">
      <div className="card-body">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <span className="section-label" style={{ marginBottom: 0 }}>{label}</span>
          {action}
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── Custom tooltip ─────────────────────────────────────────────── */
function BrandTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: NAVY, border: "none", borderRadius: "4px",
      padding: "0.5rem 0.75rem", boxShadow: "0 4px 16px rgba(25,30,46,0.25)",
    }}>
      <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.5625rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", marginBottom: "0.25rem" }}>
        {label}
      </p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ fontFamily: "var(--font-display)", fontSize: "0.875rem", color: "white" }}>
          <span style={{ color: p.color }}>{p.name}: </span>{p.value}{p.unit ?? ""}
        </p>
      ))}
    </div>
  );
}

/* ── Lameness score dot label ───────────────────────────────────── */
function LamenessDot(props: any) {
  const { cx, cy, payload } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill={payload.score === 0 ? BLUE : AMBER} stroke="white" strokeWidth={2} />
    </g>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Main Page
═══════════════════════════════════════════════════════════════════ */
export default function HealthDashboard() {
  const { id } = useParams();
  const animal = mockAnimals.find(a => a.id === id);
  if (!animal) return (
    <div style={{ maxWidth: 600, margin: "4rem auto", textAlign: "center" }}>
      <p style={{ fontFamily: "var(--font-body)", color: "rgba(25,30,46,0.5)" }}>Animal not found.</p>
      <Link href="/"><a className="btn btn-blue btn-sm" style={{ marginTop: "1rem", display: "inline-flex" }}>← Dashboard</a></Link>
    </div>
  );

  const photo = horsePhotos[animal.id];
  const age = new Date().getFullYear() - new Date(animal.dob).getFullYear();
  const recordCount = mockRecords.filter(r => r.animalId === animal.id).length;

  return (
    <div style={{ maxWidth: 1160, margin: "0 auto", padding: "1.5rem 1rem" }}>

      {/* ── Back nav ─────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <Link href="/">
          <button style={{
            display: "flex", alignItems: "center", gap: 5,
            fontFamily: "var(--font-body)", fontWeight: 300,
            fontSize: "0.8125rem", color: "rgba(25,30,46,0.5)",
            background: "none", border: "none", cursor: "pointer",
          }} data-testid="btn-back">
            <ChevronLeft style={{ width: 15, height: 15 }} /> My Animals
          </button>
        </Link>
        {/* Switch to Timeline */}
        <Link href={`/animals/${id}`}>
          <button className="btn btn-outline btn-sm" style={{
            display: "flex", alignItems: "center", gap: "0.375rem",
          }}>
            Longitudinal Timeline <ArrowRight size={12} />
          </button>
        </Link>
      </div>

      {/* ── Page header — horse identity bar ─────────────────────── */}
      <div style={{
        background: NAVY, borderRadius: "var(--radius-lg)",
        padding: "1.25rem 1.5rem",
        display: "flex", alignItems: "center", gap: "1.25rem",
        marginBottom: "1.75rem",
        boxShadow: "var(--shadow-lift)",
      }}>
        {photo && (
          <img src={photo} alt={animal.name} style={{
            width: 64, height: 64, borderRadius: "var(--radius-md)",
            objectFit: "cover", objectPosition: "center 15%",
            border: "2px solid rgba(255,255,255,0.12)", flexShrink: 0,
          }} />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{
            fontFamily: "var(--font-courier)", fontSize: "0.5625rem",
            fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            color: AMBER, display: "block", marginBottom: "0.25rem",
          }}>
            Health Analytics
          </span>
          <h1 style={{
            fontFamily: "var(--font-display)", fontStyle: "italic",
            fontSize: "1.375rem", fontWeight: 400,
            color: "white", lineHeight: 1.15,
          }}>
            {animal.name}
          </h1>
          <p style={{
            fontFamily: "var(--font-courier)", fontSize: "0.5625rem",
            color: "rgba(255,255,255,0.42)", letterSpacing: "0.04em", marginTop: "0.2rem",
          }}>
            {animal.breed} · {animal.sex} · {age}y · {animal.barn}
          </p>
        </div>
        <div style={{ display: "flex", gap: "2rem", flexShrink: 0 }}>
          {[
            { label: "Records", value: String(recordCount) },
            { label: "Status", value: animal.patientStatus.charAt(0).toUpperCase() + animal.patientStatus.slice(1) },
            { label: "Next Review", value: healthKPIs.nextReview },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", color: "rgba(255,255,255,0.38)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", color: "white", fontWeight: 400 }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── KPI row ──────────────────────────────────────────────── */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1rem", marginBottom: "1.5rem",
      }}>
        <KpiCard
          label="Body Weight"
          value={healthKPIs.currentWeight}
          sub="Stable over 6 months"
          trend="stable"
          icon={<Scale size={16} />}
        />
        <KpiCard
          label="Lameness Score"
          value={healthKPIs.currentLameness}
          sub="Improved from 2/5 at onset"
          trend="improving"
          icon={<Activity size={16} />}
        />
        <KpiCard
          label="Last Lab Panel"
          value="WNL"
          sub={`All within range · ${healthKPIs.lastLabDate}`}
          trend="stable"
          icon={<FlaskConical size={16} />}
        />
        <KpiCard
          label="Active Medications"
          value={String(healthKPIs.activeMeds)}
          sub={`${healthKPIs.daysInRehab} days into rehabilitation`}
          trend="stable"
          icon={<Pill size={16} />}
        />
      </div>

      {/* ── Main grid: 2 cols ─────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>

        {/* Body Weight Trend */}
        <ChartCard label="Body Weight — 18 Month Trend">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weightSeries} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={BLUE} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={BLUE} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(25,30,46,0.07)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontFamily: "var(--font-courier)", fontSize: 8, fill: "rgba(25,30,46,0.4)", letterSpacing: "0.04em" }} tickLine={false} axisLine={false} interval={2} />
              <YAxis domain={[540, 575]} tick={{ fontFamily: "var(--font-courier)", fontSize: 8, fill: "rgba(25,30,46,0.4)" }} tickLine={false} axisLine={false} />
              <Tooltip content={<BrandTooltip />} />
              <Area type="monotone" dataKey="weight" stroke={BLUE} strokeWidth={2} fill="url(#weightGrad)" name="Weight" unit=" kg" dot={false} activeDot={{ r: 4, fill: BLUE, stroke: "white", strokeWidth: 2 }} />
              {/* Injury marker */}
              <ReferenceLine x="Oct 2025" stroke={AMBER} strokeDasharray="4 3" strokeWidth={1.5} label={{ value: "Injury", position: "top", fontSize: 8, fill: AMBER, fontFamily: "var(--font-courier)" }} />
            </AreaChart>
          </ResponsiveContainer>
          <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.6875rem", color: "rgba(25,30,46,0.4)", marginTop: "0.5rem" }}>
            Weight dip during stall rest period — recovered on return to work. Amber line marks injury onset Oct 2025.
          </p>
        </ChartCard>

        {/* Lameness Score */}
        <ChartCard label="Lameness Score — AAEP Scale (0–5)">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lamenessSeries} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(25,30,46,0.07)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontFamily: "var(--font-courier)", fontSize: 8, fill: "rgba(25,30,46,0.4)" }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 3]} ticks={[0, 1, 2, 3]} tick={{ fontFamily: "var(--font-courier)", fontSize: 8, fill: "rgba(25,30,46,0.4)" }} tickLine={false} axisLine={false} />
              <Tooltip content={<BrandTooltip />} />
              <ReferenceLine y={0} stroke={BLUE} strokeDasharray="3 3" strokeWidth={1} />
              <Line type="monotone" dataKey="score" stroke={AMBER} strokeWidth={2.5} name="Lameness" dot={<LamenessDot />} activeDot={{ r: 5, fill: AMBER }} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: "1rem", marginTop: "0.625rem", flexWrap: "wrap" }}>
            {lamenessSeries.map((pt, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: pt.score === 0 ? BLUE : AMBER, flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", color: "rgba(25,30,46,0.45)", letterSpacing: "0.04em" }}>
                  {pt.date} — {pt.label}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* ── Rehab activity + Lab trends ──────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "1.25rem", marginBottom: "1.25rem" }}>

        {/* Rehabilitation Activity Log */}
        <ChartCard label="Rehabilitation Activity — Exercise Minutes / Week">
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={activitySeries} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(25,30,46,0.07)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontFamily: "var(--font-courier)", fontSize: 7, fill: "rgba(25,30,46,0.4)" }} tickLine={false} axisLine={false} interval={1} angle={-30} textAnchor="end" height={36} />
              <YAxis domain={[0, 60]} tick={{ fontFamily: "var(--font-courier)", fontSize: 8, fill: "rgba(25,30,46,0.4)" }} tickLine={false} axisLine={false} />
              <Tooltip
                content={({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0]?.payload;
                  return (
                    <div style={{ background: NAVY, borderRadius: 4, padding: "0.5rem 0.75rem" }}>
                      <p style={{ fontFamily: "var(--font-courier)", fontSize: "0.5625rem", color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>{label}</p>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: "0.875rem", color: "white" }}>{d?.minutes} min · <span style={{ color: intensityColor[d?.intensity] || BLUE }}>{d?.intensity}</span></p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="minutes" name="Minutes" radius={[2, 2, 0, 0]}>
                {activitySeries.map((entry, index) => (
                  <Cell key={index} fill={intensityColor[entry.intensity] || BLUE} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
            {Object.entries(intensityColor).map(([key, color]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
                <span style={{ fontFamily: "var(--font-courier)", fontSize: "0.5rem", color: "rgba(25,30,46,0.45)", letterSpacing: "0.04em", textTransform: "uppercase" }}>{key}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Lab Chemistry Trends */}
        <ChartCard label="Key Lab Values — 3 Panels">
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={labTrendSeries} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(25,30,46,0.07)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontFamily: "var(--font-courier)", fontSize: 8, fill: "rgba(25,30,46,0.4)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontFamily: "var(--font-courier)", fontSize: 8, fill: "rgba(25,30,46,0.4)" }} tickLine={false} axisLine={false} />
              <Tooltip content={<BrandTooltip />} />
              <Legend wrapperStyle={{ fontFamily: "var(--font-courier)", fontSize: "0.5625rem", letterSpacing: "0.06em" }} />
              <Line type="monotone" dataKey="ast" stroke={AMBER} strokeWidth={2} name="AST (U/L)" dot={{ r: 4, fill: AMBER, stroke: "white", strokeWidth: 2 }} />
              <Line type="monotone" dataKey="ggt" stroke={BLUE}  strokeWidth={2} name="GGT (U/L)" dot={{ r: 4, fill: BLUE,  stroke: "white", strokeWidth: 2 }} />
              <Line type="monotone" dataKey="totalProtein" stroke={NAVY} strokeWidth={2} name="Protein (g/dL)" dot={{ r: 4, fill: NAVY, stroke: "white", strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
          <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.6875rem", color: "rgba(25,30,46,0.4)", marginTop: "0.5rem" }}>
            All values within reference range across all three panels. Mild AST elevation in Oct 2025 resolved by Mar 2026.
          </p>
        </ChartCard>
      </div>

      {/* ── Medication timeline (Gantt-style) ────────────────────── */}
      <ChartCard label="Medication & Treatment History">
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {medicationEvents.map((med, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {/* Medication name */}
              <div style={{ width: 200, flexShrink: 0 }}>
                <p style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "0.8125rem", color: "var(--navy)" }}>
                  {med.name}
                </p>
              </div>
              {/* Status badge */}
              <span style={{
                fontFamily: "var(--font-courier)", fontSize: "0.5rem",
                fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                padding: "0.15rem 0.5rem", borderRadius: "2px",
                background: med.status === "active" ? "var(--blue-light)" : med.status === "completed" ? "var(--linen)" : "var(--amber-light)",
                color: med.status === "active" ? "var(--blue)" : med.status === "completed" ? "rgba(25,30,46,0.45)" : "var(--amber)",
                border: `1px solid ${med.status === "active" ? "#9eb8e0" : med.status === "completed" ? "var(--linen-dark)" : "#e8c89a"}`,
                flexShrink: 0,
              }}>
                {med.status}
              </span>
              {/* Duration bar */}
              <div style={{
                flex: 1, height: 6, borderRadius: 3,
                background: med.status === "active"
                  ? `linear-gradient(to right, ${BLUE} 60%, rgba(67,110,179,0.3) 100%)`
                  : med.status === "completed"
                  ? "var(--linen-dark)"
                  : `linear-gradient(to right, ${AMBER} 60%, rgba(177,93,0,0.3) 100%)`,
              }} />
              {/* Duration text */}
              <p style={{
                fontFamily: "var(--font-courier)", fontSize: "0.5rem",
                color: "rgba(25,30,46,0.4)", letterSpacing: "0.04em",
                flexShrink: 0, width: 160, textAlign: "right",
              }}>
                {med.duration}
              </p>
            </div>
          ))}
        </div>
      </ChartCard>

    </div>
  );
}
