import { Outlet, Navigate } from 'react-router-dom';

const SellerPrivateRoutes = (props: { isSeller: boolean }) => {
    return props.isSeller ? <Outlet /> : <Navigate to="/gallery" replace />;
};

export default SellerPrivateRoutes;
