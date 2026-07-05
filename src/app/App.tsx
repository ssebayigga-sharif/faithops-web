import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "@/shared/layouts/AppLayout";
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
const SearchPage = lazy(() => import("@/features/search/pages/SearchPage"));
const HelpPage = lazy(() => import("@/features/help/components/HelpPage"));
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
        <Route element={<AppLayout />}>
          <Route index element={<Navigate replace to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="home" element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="giving" element={<GivingPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/:uid" element={<OtherProfilePage />} />
          <Route path="members" element={<MembersPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="help" element={<HelpPage />} />
          <Route
            path="privacy"
            element={
              <SectionPage
                title="Privacy"
                description="Review privacy commitments and data handling practices for church operations."
              />
            }
          />
        </Route>
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
