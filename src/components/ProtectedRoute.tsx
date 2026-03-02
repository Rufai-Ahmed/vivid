import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode } from "react";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Global Access Restriction: Users without tickets cannot access dashboard
  if (user && user.role === "user" && !user.hasTicket) {
    toast.error("Ticket Required", {
      description:
        "You must purchase a stadium ticket first to access your account.",
      duration: 4000,
    });
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
