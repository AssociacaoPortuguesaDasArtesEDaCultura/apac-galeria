import {
    AppBar,
    Box,
    IconButton,
    Toolbar,
    Typography,
    useTheme,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import MenuIcon from '@mui/icons-material/Menu';
import logoDark from '../../assets/logo_dark.png';
import logoLight from '../../assets/logo_light.png';

import { useTranslation } from 'react-i18next';

import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const padX = {
    xs: '2rem',
    sm: '4rem',
    md: '6rem',
    lg: '8rem',
};

function ReactNavbar(props: { loggedIn: boolean }) {
    useEffect(() => {}, [props.loggedIn]);

    const theme = useTheme();
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const { t } = useTranslation();

    const pages = [
        t('initial.gallery'),
        t('initial.artists'),
        t('initial.contact'),
        props.loggedIn ? t('initial.login') : t('initial.profile'),
    ];
    const pagesLinks = [
        '/gallery',
        '/artists',
        '/contact',
        props.loggedIn ? '/profile' : '/login',
    ];

    const linkComponents = pages.map((page, index) => (
        <Typography
            variant="h5"
            component={Link}
            to={pagesLinks[index]}
            className="font-poppins"
            sx={{
                flex: '1 1 auto',
                ...(pagesLinks[index] === location.pathname
                    ? { fontWeight: 'bold' }
                    : { color: theme.palette.text.secondary }),
            }}
            key={page}>
            {page}
        </Typography>
    ));

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                backgroundColor: theme.palette.background.default,
            }}>
            <Toolbar disableGutters sx={{ mb: 2, py: 8, paddingX: padX }}>
                <Link to="/">
                    <Box
                        component="img"
                        alt="Logo"
                        sx={{
                            content: `url(${theme.palette.mode === 'dark' ? logoLight : logoDark})`,
                            height: { xs: 60, md: 120 },
                        }}
                    />
                </Link>

                <Box
                    component={'div'}
                    sx={{
                        flexGrow: 1,
                        display: { xs: 'none', md: 'flex' },
                        textAlign: 'right',
                    }}>
                    {linkComponents}
                </Box>

                <Box
                    component={'div'}
                    sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                        size="large"
                        onClick={() => {
                            setOpen(!open);
                        }}
                        color="inherit"
                        sx={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            my: 8,
                            mx: padX,
                        }}>
                        <MenuIcon fontSize="large" />
                    </IconButton>
                </Box>
            </Toolbar>
            <Grid
                container
                sx={{
                    display: open ? { xs: 'flex', md: 'none' } : 'none',
                    paddingX: padX,
                }}
                spacing={2}>
                {linkComponents.map((link) => (
                    <Grid
                        xs={12}
                        sx={{
                            py: 1,
                            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                        }}
                        className="hover:bg-gray-50">
                        {link}
                    </Grid>
                ))}
            </Grid>
        </AppBar>
    );
}
export default ReactNavbar;
