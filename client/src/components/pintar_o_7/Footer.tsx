import {
    Box,
    Divider,
    IconButton,
    List,
    ListItem,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Link } from 'react-router-dom';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import logo from '../../assets/logo_dark.png';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const ICON_MARGIN = 0.5;
    const year = new Date().getFullYear();

    function MY_LNK({ link, text }: { link: string; text: string }) {
        return (
            <Link className="font-poppins" to={link}>
                {text}
            </Link>
        );
    }

    const { t } = useTranslation();
    const socialMediaLinks = [
        {
            url: 'https://www.facebook.com/associacaoportuguesartecultura',
            icon: FacebookIcon,
        },
        {
            url: 'https://www.instagram.com/galeriapintaro7/',
            icon: InstagramIcon,
        },
        {
            url: 'https://www.youtube.com/@associacaoportuguesartecultura',
            icon: YouTubeIcon,
        },
        {
            url: 'https://www.linkedin.com/company/associacaoportuguesaartesecultura/',
            icon: LinkedInIcon,
        },
    ];

    return (
        <Box
            component="div"
            sx={{
                flexGrow: 1,
                paddingBottom: 5,
                paddingX: {
                    xs: '2rem',
                    sm: '4rem',
                },
            }}>
            <Grid container sx={{ paddingBottom: 5 }}>
                <Grid xs={12}>
                    <Divider />
                </Grid>
                <Grid
                    xs={6}
                    sm={3}
                    md={3}
                    lg={2}
                    display="flex"
                    justifyContent="left"
                    alignItems="center">
                    <List>
                        <ListItem sx={{ paddingX: 0 }}>
                            <img
                                className="max-h-16 my-4"
                                alt="logo"
                                src={logo}
                            />
                        </ListItem>
                        <ListItem sx={{ paddingX: 0 }}>
                            {socialMediaLinks.map((link, index) => (
                                <IconButton
                                    key={index}
                                    target="_blank"
                                    href={link.url}>
                                    <link.icon />
                                </IconButton>
                            ))}
                        </ListItem>
                    </List>
                </Grid>
                <Grid
                    xs={6}
                    sm={5}
                    md={5}
                    display="flex"
                    justifyContent="center"
                    alignItems="center">
                    <List>
                        <ListItem disablePadding sx={{ paddingBottom: 2 }}>
                            <Typography
                                color="primary"
                                className="font-poppins">
                                menu
                            </Typography>
                        </ListItem>
                        <ListItem disablePadding>
                            <MY_LNK
                                link="gallery"
                                text={t('initial.gallery')}
                            />
                        </ListItem>
                        <ListItem disablePadding>
                            <MY_LNK
                                link="artists"
                                text={t('initial.artists')}
                            />
                        </ListItem>
                        <ListItem disablePadding>
                            <MY_LNK
                                link="contact"
                                text={t('initial.contact')}
                            />
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
            <Grid container>
                <Grid
                    xs={12}
                    md={3}
                    lg={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    <MY_LNK link="info" text={t('info.terms.title')} />
                </Grid>
                <Grid
                    xs={12}
                    md={3}
                    lg={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    <MY_LNK
                        link="https://www.livroreclamacoes.pt/Inicio/"
                        text={t('info.reclamation.title')}
                    />
                </Grid>
                <Grid
                    xs={12}
                    md={3}
                    lg={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    <MY_LNK link="info" text={t('info.privacy.title')} />
                </Grid>
                <Grid
                    xs={12}
                    md={3}
                    lg={6}
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    <Typography
                        color="primary"
                        component="a"
                        target="_blank"
                        href="https://associacaoportuguesaartesecultura.pt/"
                        sx={{ textDecoration: 'underline' }}>
                        {t('home.iniciative')} associação portuguesa das artes e
                        da cultura &copy; {year}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Footer;
