import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loading } from "@carbon/react";
import { useAuthContext } from "@/features/auth/context/AuthContext";

/**
 * SECURITY NOTE: This component only controls what renders in the browser.
 * It is not a security boundary. Anyone can bypass it by calling Firebase's
 * REST/SDK API directly. Every read/write that this route protects MUST
 * also be enforced by Firebase Realtime Database security rules keyed off
 * `auth.uid` / a server-verified role claim — never trust this gate alone.
 */
const ProtectedRoute = () => {
  const { user, isLoading } = useAuthContext();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="auth-page">
        <Loading description="Checking your session…" withOverlay={false} />
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
