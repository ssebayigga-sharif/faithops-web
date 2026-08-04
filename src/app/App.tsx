import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../shared/layouts/AppLayout";
import { SectionPage } from "../shared/components/SectionPage";
import { AuthProvider } from "../features/auth/context/AuthContext";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";

const Dashboard = lazy(() => import("../features/dashboard/pages/Dashboard"));
const HomePage = lazy(() => import("../features/home/pages/HomePage"));
const MembersPage = lazy(() => import("../features/members/pages/MembersPage"));
const AttendancePage = lazy(() =>
  import("../features/attendance/pages/AttendancePage").then((m) => ({
    default: m.AttendancePage,
  })),
);
const EventsPage = lazy(() => import("../features/events/pages/EventsPage"));
const GivingPage = lazy(() => import("../features/giving/pages/GivingPage"));
const ReportsPage = lazy(() => import("../features/reports/pages/ReportsPage"));
const ProfilePage = lazy(() => import("../features/profile/pages/ProfilePage"));
const OtherProfilePage = lazy(
  () => import("../features/profile/pages/OtherProfilePage"),
);
const SettingsPage = lazy(
  () => import("../features/settings/pages/SettingsPage"),
);
const SearchPage = lazy(() => import("../features/search/pages/SearchPage"));
const HelpPage = lazy(() => import("../features/help/components/HelpPage"));
const ContactPage = lazy(() => import("../features/contact/page/ContactPage"));
const MessagesPage = lazy(
  () => import("../features/messages/pages/MessagesPage"),
);

const LoginPage = lazy(() => import("../features/auth/pages/LoginPage"));
const SignUpPage = lazy(() => import("../features/auth/pages/SignUpPage"));
const ForgotPasswordPage = lazy(
  () => import("../features/auth/pages/ForgotPasswordPage"),
);

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
  <AuthProvider>
    <BrowserRouter>
      <Suspense fallback={<PageSpinner />}>
        <Routes>
          <Route
            path="/login"
            element={
              <ProtectedRoute requireGuest>
                <LoginPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <ProtectedRoute requireGuest>
                <SignUpPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <ProtectedRoute requireGuest>
                <ForgotPasswordPage />
              </ProtectedRoute>
            }
          />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate replace to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="home" element={<HomePage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="giving" element={<GivingPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/:uid" element={<OtherProfilePage />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="messages/:conversationId" element={<MessagesPage />} />
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
  </AuthProvider>
);

export default App;
