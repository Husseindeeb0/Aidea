import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin }: ProtectedRouteProps) => {
  const { userData, isAuthenticating } = useSelector((state: RootState) => state.auth);

  if (isAuthenticating) {
    return <h2>Loading...</h2>; // block until checkAuth finishes
  }

  if (!userData) {
    return <Navigate to="/" />;
  }

  if (requireAdmin && userData.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
