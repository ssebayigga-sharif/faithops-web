import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import type { ChurchRole } from "@/features/auth/types";

const ADMIN_ROLES: ChurchRole[] = ["pastor", "elder", "deacon", "treasurer"];

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, userProfile, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!userProfile || !ADMIN_ROLES.includes(userProfile.role)) {
    // Redirect members to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
