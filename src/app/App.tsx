import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "@/shared/layouts/AppLayout";
import MembersPage from "@/features/members/pages/MembersPage";
import Dashboard from "@/features/dashboard/pages/Dashboard";
import EventsPage from "@/features/events/pages/EventsPage";
import GivingPage from "@/features/giving/pages/GivingPage";
import ProfilePage from "@/features/profile/pages/ProfilePage";
import AttendancePage from "@/features/attendance/pages/AttendancePage";
import HomePage from "@/features/home/pages/HomePage";
import AboutPage from "@/features/about/pages/AboutPage";
import { SectionPage } from "@/shared/components/SectionPage";

const App = () => (
  <BrowserRouter>
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate replace to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />

        <Route path="/members" element={<MembersPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/giving" element={<GivingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route
          path="/reports"
          element={
            <SectionPage
              title="Reports"
              description="Create operational reports for leaders, ministries, membership, and attendance."
            />
          }
        />
        <Route
          path="/settings"
          element={
            <SectionPage
              title="Settings"
              description="Configure users, roles, permissions, ministry teams, and organization preferences."
            />
          }
        />
        <Route
          path="/help"
          element={
            <SectionPage
              title="Help center"
              description="Find product guidance, support resources, and onboarding material."
            />
          }
        />
        <Route
          path="/privacy"
          element={
            <SectionPage
              title="Privacy"
              description="Review privacy commitments and data handling practices for church operations."
            />
          }
        />
        <Route
          path="/support"
          element={
            <SectionPage
              title="Support"
              description="Contact support and manage assistance requests for your FaithOps workspace."
            />
          }
        />
      </Routes>
    </AppLayout>
  </BrowserRouter>
);

export default App;
