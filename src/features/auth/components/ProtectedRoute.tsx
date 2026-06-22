import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "@/features/auth/context/AuthContext";

const ProtectedRoute = () => {
  const { user, isLoading } = useAuthContext();
  const location = useLocation();

  // Show spinner while the initial auth check is in progress
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
    // Preserve the intended route so we can redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
