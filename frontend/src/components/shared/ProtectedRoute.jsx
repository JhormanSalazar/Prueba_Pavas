import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AccessDenied from "./AccessDenied";
import PageLoader from "./PageLoader";

const ProtectedRoute = ({ roles }) => {
  const { user, token, loading } = useAuth();

  if (loading) return <PageLoader />;

  if (!token) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user?.role)) return <AccessDenied />;

  return <Outlet />;
};

export default ProtectedRoute;
