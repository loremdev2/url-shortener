// src/components/RequireAuth.tsx
import { UrlState } from "@/context/UrlContext";
import React from "react";
import { Navigate } from "react-router-dom";

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { loading, isAuthenticated } = UrlState();

  // 1. Still checking session? Show a full-screen spinner (or your own skeleton)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span>Loading…</span>
      </div>
    );
  }

  // 2. Not logged in? Redirect to /auth
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // 3. Otherwise, everything’s good—render the protected UI
  return <>{children}</>;
};

export default RequireAuth;
