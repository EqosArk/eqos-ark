import { Switch, Route, Router, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/lib/auth";

// Pages — auth / onboarding
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AddHorse from "./pages/AddHorse";
import InvitePage from "./pages/InvitePage";

// Pages — app views (existing, preserved)
import Dashboard from "./pages/Dashboard";
import AnimalProfile from "./pages/AnimalProfile";
import HealthDashboard from "./pages/HealthDashboard";
import VetDashboard       from "./pages/VetDashboard";
import VetAnimalView      from "./pages/VetAnimalView";
import ProviderDashboard  from "./pages/ProviderDashboard";
import ProviderAnimalView from "./pages/ProviderAnimalView";
import AccessManager         from "./pages/AccessManager";
import DocumentsManager      from "./pages/DocumentsManager";
import EmergencyAccessPanel  from "./pages/EmergencyAccessPanel";
import EmergencyRecordView   from "./pages/EmergencyRecordView";
import NotFound              from "./pages/not-found";
import NavBar from "./components/NavBar";

// ── Protected route wrapper ───────────────────────────────────────────────────
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "hsl(38,33%,94%)" }}>
        <div style={{ fontFamily: "var(--font-courier)", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(25,30,46,0.4)" }}>
          Loading…
        </div>
      </div>
    );
  }

  if (!user) {
    setTimeout(() => navigate("/login"), 0);
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    setTimeout(() => navigate("/app"), 0);
    return null;
  }

  return <>{children}</>;
}

// ── Smart /app redirect — sends each role to their home ──────────────────────
function AppHome() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  if (loading) return null;

  if (!user) {
    setTimeout(() => navigate("/login"), 0);
    return null;
  }

  if (user.role === "owner") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "hsl(38,33%,94%)" }}>
        <NavBar />
        <Dashboard />
      </div>
    );
  }

  if (user.role === "vet") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "hsl(38,33%,94%)" }}>
        <NavBar />
        <VetDashboard />
      </div>
    );
  }

  // care_provider → provider dashboard
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "hsl(38,33%,94%)" }}>
      <NavBar />
      <ProviderDashboard />
    </div>
  );
}

// ── App views wrapper (with NavBar) ──────────────────────────────────────────
function AppView({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "hsl(38,33%,94%)" }}>
      <NavBar />
      {children}
    </div>
  );
}

// ── All routes ────────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Switch>
      {/* ── Public routes ── */}
      <Route path="/" component={Landing} />
      <Route path="/login" component={SignIn} />
      <Route path="/signup/:roleSlug" component={SignUp} />
      <Route path="/invite/:token" component={InvitePage} />

      {/* ── Authenticated entry point ── */}
      <Route path="/app" component={AppHome} />

      {/* ── Owner routes ── */}
      <Route path="/add-horse">
        <ProtectedRoute allowedRoles={["owner"]}>
          <AddHorse />
        </ProtectedRoute>
      </Route>

      <Route path="/animals/:id/health">
        {(params) => (
          <ProtectedRoute>
            <AppView><HealthDashboard /></AppView>
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/animals/:id">
        {(params) => (
          <ProtectedRoute>
            <AppView><AnimalProfile /></AppView>
          </ProtectedRoute>
        )}
      </Route>

      {/* ── Owner — Access & Documents ── */}
      <Route path="/access">
        <ProtectedRoute allowedRoles={["owner"]}>
          <AppView><AccessManager /></AppView>
        </ProtectedRoute>
      </Route>

      <Route path="/documents">
        <ProtectedRoute allowedRoles={["owner"]}>
          <AppView><DocumentsManager /></AppView>
        </ProtectedRoute>
      </Route>

      {/* ── Vet routes ── */}
      <Route path="/vet/animals/:id">
        {() => (
          <ProtectedRoute allowedRoles={["vet"]}>
            <AppView><VetAnimalView /></AppView>
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/vet">
        <ProtectedRoute allowedRoles={["vet"]}>
          <AppView><VetDashboard /></AppView>
        </ProtectedRoute>
      </Route>

      {/* ── Care provider routes ── */}
      <Route path="/provider/animals/:id">
        {() => (
          <ProtectedRoute allowedRoles={["care_provider"]}>
            <AppView><ProviderAnimalView /></AppView>
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/provider">
        <ProtectedRoute allowedRoles={["care_provider"]}>
          <AppView><ProviderDashboard /></AppView>
        </ProtectedRoute>
      </Route>

      {/* ── Emergency access — public, no auth ── */}
      <Route path="/ea/:token">
        {() => <EmergencyRecordView />}
      </Route>

      {/* ── Emergency access panel — owner only ── */}
      <Route path="/emergency-access">
        <ProtectedRoute allowedRoles={["owner"]}>
          <AppView><EmergencyAccessPanel /></AppView>
        </ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router hook={useHashLocation}>
          <AppRoutes />
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
