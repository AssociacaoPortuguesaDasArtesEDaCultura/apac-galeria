import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = (props: { loggedIn: boolean }) => {
    return props.loggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
