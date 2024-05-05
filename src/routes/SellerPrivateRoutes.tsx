import { Navigate, Outlet } from "react-router-dom";

const SellerPrivateRoutes = (props: { isSeller: boolean }) =>
  props.isSeller ? <Outlet /> : <Navigate to="/gallery" replace />;

export default SellerPrivateRoutes;
