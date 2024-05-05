import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = (props: { loggedIn: boolean }) =>
  props.loggedIn ? <Outlet /> : <Navigate to="/login" />;

export default PrivateRoutes;
