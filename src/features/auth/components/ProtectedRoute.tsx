import { Navigate, useLocation } from "react-router-dom";
import { Loading } from "@carbon/react";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireGuest?: boolean;
}

export default function ProtectedRoute({
  children,
  requireGuest = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show a spinner while checking auth state
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Loading description="Loading..." withOverlay />
      </div>
    );
  }

  // Guest-only pages (login, signup) — redirect to dashboard if already logged in
  if (requireGuest && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Protected pages — redirect to login if not authenticated
  if (!requireGuest && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
