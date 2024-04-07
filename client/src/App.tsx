import { lazy, Suspense, useState, useMemo, useContext } from 'react';

import { Box, CircularProgress, PaletteMode } from '@mui/material';
import { CssBaseline } from '@mui/material/';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/pintar_o_7/Footer';
import ReactNavbar from './components/pintar_o_7/ReactNavbar';
import Requests from './pages/Administrator/Requests';
import ProfileIndex from './pages/Profile/ProfileIndex';
import ProfileInfo from './pages/Profile/ProfileInfo';
import ProfileOrderHistory from './pages/Profile/ProfileOrderHistory';
import NewProduct from './pages/Seller/NewProduct';
import Products from './pages/Seller/Products';
import { FirebaseAuthContext } from './contexts/currentAuthUserContext';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';
// import ChatPage from './components/experinecia_chat/ChatPage';
import NewSeller from './pages/Seller/NewSeller';
import AdminPrivateRoutes from './routes/AdminPrivateRoutes';
import PrivateRoutes from './routes/PrivateRoutes';
import SellerPrivateRoutes from './routes/SellerPrivateRoutes';
import { getDesignTokens } from './theme';
import { ColorModeContext } from './theme';

import ThemeSwitcher from './components/ThemeSwitcher';
import LanguageSwitcher from './components/LanguageSwitcher';

const InitialPage = lazy(() => import('./pages/pintar_o_7/Initial'));
const Gallery = lazy(() => import('./pages/pintar_o_7/Gallery'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const LoginPage = lazy(() => import('./pages/pintar_o_7/Login'));
const RegisterPage = lazy(() => import('./pages/pintar_o_7/Register'));
const ArtistsIndexPage = lazy(() => import('./pages/pintar_o_7/ArtistsIndex'));
const ArtistPage = lazy(() => import('./pages/pintar_o_7/Artist'));
const CartPage = lazy(() => import('./pages/Shopping/Cart'));
const CheackoutPage = lazy(() => import('./pages/Shopping/Checkout'));
const PageNotFound = lazy(() => import('./pages/NotFound'));
const InfoPage = lazy(() => import('./pages/InfoPage'));
const ContactPage = lazy(() => import('./pages/pintar_o_7/Contact'));
const CartBadge = lazy(() => import('./components/CartBadge'));
const Dashboard = lazy(() => import('./pages/Administrator/Dashboard'));
const Notifications = lazy(() => import('./pages/Profile/Notifications'));

type RouteType = {
    path: string;
    element: JSX.Element;
    requireAuth?: boolean;
};

const mapRoutes = (routes: RouteType[]) =>
    routes.map((route: RouteType, index: number) => (
        <Route key={index} path={route.path} element={route.element} />
    ));
function App() {
    const [mode, setMode] = useState<PaletteMode>('light');
    // const [, setNavbarSize] = useState<number>(0);
    // const [, setFooterSize] = useState<number>(0);
    const location = useLocation();

    // const checkChatRoute = (route: string) => {
    //     var re = /\/product\/[^\/?]+/;
    //     return re.test(route);
    // };
    const { user, loggedIn } = useContext(FirebaseAuthContext);
    console.log('APP: ', user, loggedIn);

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () =>
                setMode((prevMode) =>
                    prevMode === 'light' ? 'dark' : 'light'
                ),
        }),
        []
    );

    const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

    const payPalOptions = {
        clientId:
            'AXH3T6mt5FSd1rfMt0i2m6AadWj86MjC2qESbozuHcBXvS3Orwtt0FhxuG-MpxAkOPcYt1LD_ni4dpz4', // testing
        currency: 'EUR',
        intent: 'capture',
    };

    // All routes for the app
    const routes = [
        {
            path: '/',
            element: <InitialPage loggedIn={loggedIn} />,
        },
        { path: '/gallery', element: <Gallery /> },
        { path: '/artists', element: <ArtistsIndexPage /> },
        { path: '/artists/:id', element: <ArtistPage /> },
        { path: '/artists/add', element: <NewSeller />, requireAuth: false },
        {
            path: '/product/:product_id',
            element: <ProductPage loggedIn={loggedIn !== undefined} />,
        },
        {
            path: '/product',
            element: <ProductPage loggedIn={loggedIn !== undefined} />,
        },
        { path: '/login', element: <LoginPage /> },
        { path: '/register', element: <RegisterPage /> },
        { path: '/info', element: <InfoPage /> },
        { path: '/contact', element: <ContactPage /> },
        // { path: '/chat', element: <ChatPage /> },
        { path: '*', element: <PageNotFound /> },
    ];

    const protectedRoutes = [
        { path: '/profile', element: <ProfileIndex /> },
        { path: '/profile/info', element: <ProfileInfo /> },
        { path: '/cart', element: <CartPage /> },
        { path: '/checkout', element: <CheackoutPage /> },
        { path: '/profile/order-history', element: <ProfileOrderHistory /> },
        { path: '/profile/notifications', element: <Notifications /> },
    ];

    const adminRoutes = [{ path: '/dashboard', element: <Dashboard /> }];

    const sellerRoutes = [
        {
            path: '/profile/products',
            element: <Products />,
            authLevel: 'seller',
        },
        {
            path: '/profile/new-product',
            element: <NewProduct />,
            authLevel: 'seller',
        },
        { path: '/requests', element: <Requests />, authLevel: 'seller' },
    ];

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <PayPalScriptProvider options={payPalOptions}>
                <ColorModeContext.Provider value={colorMode}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <Box
                            component="div"
                            className={
                                theme.palette.mode === 'dark' ? 'dark' : ''
                            }>
                            <ThemeSwitcher
                                toggleColorMode={colorMode.toggleColorMode}
                                theme={theme}
                            />
                            <LanguageSwitcher />
                            {location.pathname !== '/' && (
                                <ReactNavbar loggedIn={loggedIn} />
                            )}
                            <Suspense
                                fallback={
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            my: 10,
                                        }}
                                        component="div">
                                        <CircularProgress />
                                    </Box>
                                }>
                                <Routes>
                                    {mapRoutes(routes)}
                                    <Route
                                        element={
                                            <PrivateRoutes
                                                loggedIn={loggedIn}
                                            />
                                        }>
                                        {mapRoutes(protectedRoutes)}
                                    </Route>
                                    <Route
                                        element={
                                            <SellerPrivateRoutes
                                                isSeller={
                                                    user &&
                                                    user.role === 'seller'
                                                }
                                            />
                                        }>
                                        {mapRoutes(sellerRoutes)}
                                    </Route>
                                    <Route element={<AdminPrivateRoutes />}>
                                        {mapRoutes(adminRoutes)}
                                    </Route>
                                </Routes>
                            </Suspense>
                            {loggedIn && location.pathname !== '/cart' && (
                                <CartBadge />
                            )}
                            {/*checkChatRoute(location.pathname) ? ( <Chat />) : ( <></>)*/}
                            {location.pathname !== '/' && <Footer />}
                        </Box>
                    </ThemeProvider>
                </ColorModeContext.Provider>
            </PayPalScriptProvider>
        </LocalizationProvider>
    );
}

export default App;
