import { Navigate, Outlet } from "react-router-dom";
import { hasRole } from "../utils/authRoles";
import { useAppData } from "../../app/context/AppDataContext";

function AdminRoute() {
  const { user } = useAppData();
  const loggedUser = user?.user || user;
  return hasRole(loggedUser, "ROLE_ADMIN") ? <Outlet /> : <Navigate to="/" replace />;
}

export default AdminRoute;
