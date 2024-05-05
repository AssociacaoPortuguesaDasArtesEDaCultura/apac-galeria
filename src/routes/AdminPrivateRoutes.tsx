import { Navigate, Outlet } from "react-router-dom";

const AdminPrivateRoutes = (props) =>
  props.level === "admin" ? <Outlet /> : <Navigate to="/gallery" replace />;

export default AdminPrivateRoutes;
