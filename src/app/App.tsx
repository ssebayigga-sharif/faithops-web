import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "@/shared/layouts/AppLayout";
import MembersPage from "@/features/members/pages/MembersPage";
import Dashboard from "@/features/dashboard/pages/Dashboard";
import EventsPage from "@/features/events/pages/EventsPage";
import GivingPage from "@/features/giving/pages/GivingPage";
import ProfilePage from "@/features/profile/pages/ProfilePage";
import AttendancePage from "@/features/attendance/pages/AttendancePage";
import ReportsPage from "@/features/reports/pages/ReportsPage";
import HomePage from "@/features/home/pages/HomePage";
import AboutPage from "@/features/about/pages/AboutPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";
import { SectionPage } from "@/shared/components/SectionPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import AdminRoute from "@/features/auth/components/AdminRoute";
import SearchPage from "@/features/search/pages/SearchPage";
import OtherProfilePage from "@/features/profile/pages/OtherProfilePage";

const App = () => (
  <BrowserRouter>
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
          <Route
            path="help"
            element={
              <AdminRoute>
                <SectionPage
                  title="Help center"
                  description="Find product guidance, support resources, and onboarding material."
                />
              </AdminRoute>
            }
          />
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
          <Route
            path="support"
            element={
              <AdminRoute>
                <SectionPage
                  title="Support"
                  description="Contact support and manage assistance requests for your FaithOps workspace."
                />
              </AdminRoute>
            }
          />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
