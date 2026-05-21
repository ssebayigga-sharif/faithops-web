import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import MembersPage from "./Pages/members/Members";
import Dashboard from "./Pages/dashboard/Dashboard";
import EventsPage from "./Pages/events/Events";
import GivingPage from "./Pages/giving/GivingPage";

type SectionPageProps = {
  title: string;
  description: string;
};

const SectionPage = ({ title, description }: SectionPageProps) => (
  <div className="page-placeholder">
    <p className="page-placeholder__eyebrow">FaithOps workspace</p>
    <h1>{title}</h1>
    <p>{description}</p>
  </div>
);

const App = () => (
  <BrowserRouter>
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate replace to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/members" element={<MembersPage />} />
        <Route
          path="/attendance"
          element={
            <SectionPage
              title="Attendance"
              description="Track service attendance, event check-ins, and participation trends."
            />
          }
        />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/giving" element={<GivingPage />} />
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
