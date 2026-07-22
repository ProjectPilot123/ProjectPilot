import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { isAuthenticated } from "../utils/auth";

interface Props {
  children: ReactNode;
}

function ProtectedRoute({ children }: Props) {

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;