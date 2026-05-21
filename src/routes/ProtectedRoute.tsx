import { Navigate } from "react-router-dom";

// Replace this with your actual auth state (zustand, context, etc.)
function useAuth() {
  const token = localStorage.getItem("access_token");
  return { isAuthenticated: !!token };
}

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
