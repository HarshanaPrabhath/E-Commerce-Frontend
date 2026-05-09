import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { hasRole } from "../utils/authRoles";

function AdminRoute() {
  const { user } = useSelector((state) => state.auth);
  return hasRole(user, "ROLE_ADMIN") ? <Outlet /> : <Navigate to="/" replace />;
}

export default AdminRoute;

