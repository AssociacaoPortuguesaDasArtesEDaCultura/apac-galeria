import {
  AppBar,
  Box,
  Grid,
  IconButton,
  Toolbar,
  useTheme,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import logoDark from '../../assets/LOGO_negrito.png';
import logoLight from '../../assets/LOGO.png';

import { useTranslation } from 'react-i18next';

import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const padX = {
  xs: '2rem',
  sm: '4rem',
  md: '6rem',
  lg: '8rem',
};

function ReactNavbar(loggedIn: boolean) {
  const theme = useTheme();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const { t } = useTranslation();

  const pages = [
    t('initial.gallery'),
    t('initial.artists'),
    t('initial.contact'),
  ];
  const pagesLinks = ['/gallery', '/artists', '/contact'];
  const lastpage = ['login', t('initial.profile')];
  const lastpageLinks = ['/login', '/profile'];

  const checkRoute = (route: string, page: string) => {
    const re = RegExp(route);
    return re.test(page);
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        fontSize: '1.2rem',
        backgroundColor: theme.palette.background.default,
      }}>
      <Toolbar disableGutters sx={{ mb: 2, py: 8, paddingX: padX }}>
        <Link to="/">
          <Box
            component="img"
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
          <Grid container>
            {pages.map((page, index) => (
              <Grid
                xs={3}
                sx={
                  checkRoute(
                    pagesLinks[index],
                    location.pathname
                  )
                    ? { fontWeight: 'bold' }
                    : {
                      color: theme.palette.text
                        .secondary,
                    }
                }
                key={page}>
                <Link
                  to={pagesLinks[index]}
                  className="font-poppins">
                  {page}
                </Link>
              </Grid>
            ))}
            <Grid
              xs={3}
              sx={
                location.pathname ==
                  lastpageLinks[loggedIn ? 1 : 0]
                  ? { fontWeight: 'bold' }
                  : { color: theme.palette.text.secondary }
              }>
              <Link
                to={lastpageLinks[loggedIn ? 1 : 0]}
                className="font-poppins">
                {lastpage[loggedIn ? 1 : 0]}
              </Link>
            </Grid>
          </Grid>
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
        {pages.map((page, index) => (
          <Grid
            xs={12}
            key={page}
            sx={{
              py: 1,
              borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            }}
            className="hover:bg-gray-50">
            <Link to={pagesLinks[index]} className="font-poppins">
              <Box
                component={'div'}
                sx={
                  location.pathname == pagesLinks[index]
                    ? { fontWeight: 'bold' }
                    : {}
                }>
                {page}
              </Box>
            </Link>
          </Grid>
        ))}
        <Grid xs={12} sx={{ py: 1 }} className="hover:bg-gray-50">
          <Link
            to={lastpageLinks[loggedIn ? 1 : 0]}
            className="font-poppins">
            <Box
              component={'div'}
              sx={
                location.pathname ==
                  lastpageLinks[loggedIn ? 1 : 0]
                  ? { fontWeight: 'bold' }
                  : {}
              }>
              {lastpage[loggedIn ? 1 : 0]}
            </Box>
          </Link>
        </Grid>
      </Grid>
    </AppBar>
  );
}
export default ReactNavbar;
