import { Navigate, Outlet } from "react-router-dom";
import PageLoader from "@/components/common/PageLoader";
import useAuth from "@/hooks/useAuth";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <PageLoader
        fullScreen
        message="Loading SynSphere..."
      />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;