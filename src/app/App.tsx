import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "@/shared/layouts/AppLayout";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import AdminRoute from "@/features/auth/components/AdminRoute";
import { SectionPage } from "@/shared/components/SectionPage";

// ── Lazy-loaded routes (code-split for faster initial render) ────────
const Dashboard = lazy(() => import("@/features/dashboard/pages/Dashboard"));
const HomePage = lazy(() => import("@/features/home/pages/HomePage"));
const AboutPage = lazy(() => import("@/features/about/pages/AboutPage"));
const MembersPage = lazy(() => import("@/features/members/pages/MembersPage"));
const AttendancePage = lazy(
  () => import("@/features/attendance/pages/AttendancePage"),
);
const EventsPage = lazy(() => import("@/features/events/pages/EventsPage"));
const GivingPage = lazy(() => import("@/features/giving/pages/GivingPage"));
const ReportsPage = lazy(() => import("@/features/reports/pages/ReportsPage"));
const ProfilePage = lazy(() => import("@/features/profile/pages/ProfilePage"));
const OtherProfilePage = lazy(
  () => import("@/features/profile/pages/OtherProfilePage"),
);
const SettingsPage = lazy(
  () => import("@/features/settings/pages/SettingsPage"),
);
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"));
const ForgotPasswordPage = lazy(
  () => import("@/features/auth/pages/ForgotPasswordPage"),
);
const SearchPage = lazy(() => import("@/features/search/pages/SearchPage"));
//const HelpPage = lazy(() => import("@/features/help/components/HelpPage"));
const ContactPage = lazy(() => import("@/features/contact/page/ContactPage"));

// ── Loading fallback ─────────────────────────────────────────────────
const PageSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "60vh",
    }}
  >
    <div className="cds--loading" />
  </div>
);

const App = () => (
  <BrowserRouter>
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        {/* ── Public auth routes (outside AppLayout) ─────────────────── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* ── Public pages (inside AppLayout, no auth required) ──────── */}
        <Route element={<AppLayout />}>
          <Route index element={<Navigate replace to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="home" element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />

          {/* ── Protected routes (require login) ───────────────────────── */}
          <Route element={<ProtectedRoute />}>
            {/* Member-accessible routes */}
            <Route path="giving" element={<GivingPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/:uid" element={<OtherProfilePage />} />

            {/* Admin-only routes (pastor, elder, deacon, treasurer) */}
            <Route
              path="members"
              element={
                <AdminRoute>
                  <MembersPage />
                </AdminRoute>
              }
            />
            <Route
              path="attendance"
              element={
                <AdminRoute>
                  <AttendancePage />
                </AdminRoute>
              }
            />
            <Route
              path="events"
              element={
                <AdminRoute>
                  <EventsPage />
                </AdminRoute>
              }
            />
            <Route
              path="reports"
              element={
                <AdminRoute>
                  <ReportsPage />
                </AdminRoute>
              }
            />
            <Route
              path="settings"
              element={
                <AdminRoute>
                  <SettingsPage />
                </AdminRoute>
              }
            />
            <Route
              path="search"
              element={
                <AdminRoute>
                  <SearchPage />
                </AdminRoute>
              }
            />
            {/* <Route
              path="help"
              element={
                <AdminRoute>
                  <HelpPage />
                </AdminRoute>
              }
            /> */}
            <Route
              path="privacy"
              element={
                <AdminRoute>
                  <SectionPage
                    title="Privacy"
                    description="Review privacy commitments and data handling practices for church operations."
                  />
                </AdminRoute>
              }
            />
            {/* <Route
              path="support"
              element={
                <AdminRoute>
                  <HelpPage />
                </AdminRoute>
              }
            /> */}
          </Route>
        </Route>
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
