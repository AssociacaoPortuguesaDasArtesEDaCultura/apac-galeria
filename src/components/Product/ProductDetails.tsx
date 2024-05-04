import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import {
    Alert,
    Box,
    Button,
    ButtonGroup,
    Chip,
    Grid,
    Stack,
    Typography,
} from '@mui/material';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { FirebaseAuthContext } from '../../contexts/currentAuthUserContext';
import { checkLink } from '../../fetchers';
import useCart from '../../hooks/useCart';
import { Product } from '../../types/product';
import { ImageLightBox } from './ImageLightBox';
import ProductAccordion from './ProductAccordion';

const ProductDetails = (data: { product: Product; loggedIn: boolean }) => {
    const { t } = useTranslation();
    const { user } = useContext(FirebaseAuthContext);

    const navigate = useNavigate();
    const { product, loggedIn } = data;

    const { cart, REDUCER_ACTIONS, dispatch } = useCart();

    const [selectedImage, setSelectedImage] = useState(product.photos[0]);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [openCheckoutModel, setCheckoutModel] = useState(false);
    const [loggedInError, setLoggedInError] = useState(false);

    const checkIfInCart = () => {
        // check if product is in cart array
        return cart.some((p) => p._id === product.id);
    };

    const handleLightbox = () => setLightboxOpen(!lightboxOpen);

    const handleOpenCheckout = () => {
        if (!loggedIn) {
            setLoggedInError(true);
        } else {
            dispatch({ type: REDUCER_ACTIONS.ADD, payload: product });
            setCheckoutModel(!openCheckoutModel);
        }
    };

    const handleAccept = async (e: React.MouseEvent<HTMLButtonElement>) => {};

    const handleDecline = async (e: React.MouseEvent<HTMLButtonElement>) => {};

    const PendingStateComponent = () => {
        return (
            <Box component="div" sx={{ marginLeft: 2 }}>
                <ButtonGroup
                    orientation="horizontal"
                    variant="contained"
                    disableElevation
                    color="secondary"
                    aria-label="horizontal contained button group">
                    <Button onClick={handleAccept} startIcon={<CheckIcon />}>
                        Accept
                    </Button>
                    <Button onClick={handleDecline} startIcon={<ClearIcon />}>
                        Reject
                    </Button>
                </ButtonGroup>
            </Box>
        );
    };

    return (
        <Grid container>
            {/* LIGHTBOX */}
            <Box
                component="div"
                sx={{
                    display: lightboxOpen ? 'block' : 'none',
                }}>
                <ImageLightBox
                    status={lightboxOpen}
                    statusFunc={setLightboxOpen}
                    images={product.photos}
                    selectedIndex={product.photos.indexOf(selectedImage)}
                />
            </Box>
            {/* THUMBNAIL AREA */}
            <Grid xs={12} lg={6}>
                <img
                    src={checkLink(selectedImage)}
                    alt={product.title}
                    style={{ cursor: 'pointer' }}
                    onClick={handleLightbox}
                />
                {product.photos.length > 1 && (
                    <Stack
                        direction="row"
                        gap={1}
                        sx={{ py: 1, overflowX: 'scroll' }}>
                        {product.photos.map((photo, index) => (
                            <img
                                key={index}
                                src={checkLink(photo)}
                                alt={product.title}
                                style={{ height: '100px', objectFit: 'cover' }}
                                className="hover:opacity-80"
                                onClick={() => setSelectedImage(photo)}
                            />
                        ))}
                    </Stack>
                )}
            </Grid>
            <Grid xs={12} lg={6} sx={{ px: 2 }}>
                {/* ACTION AREA */}
                <Stack spacing={2}>
                    <Typography className="font-poppins" variant="h2">
                        {product.title}
                    </Typography>
                    <Typography className="font-poppins" variant="h4">
                        {product.author}, {product.piece_info?.year}
                    </Typography>

                    <Typography className="font-poppins" variant="h6">
                        {new Intl.NumberFormat('pt-PT', {
                            style: 'currency',
                            currency: 'EUR',
                        }).format(product.price)}
                    </Typography>
                    {loggedInError && (
                        <Alert
                            onClose={() => {
                                setLoggedInError(false);
                            }}
                            variant="filled"
                            severity="error">
                            {t('errors.cart.login')}
                        </Alert>
                    )}
                    {product.status === 'available' && (
                        <Button
                            type="button"
                            variant="contained"
                            color="secondary"
                            onClick={handleOpenCheckout}
                            disabled={false && checkIfInCart()}>
                            {checkIfInCart()
                                ? t('product.already-in-cart')
                                : t('product.add-to-cart')}
                        </Button>
                    )}
                    {product.status === 'pending' && user.role === 'seller' && (
                        <PendingStateComponent />
                    )}
                    {product.status !== 'available' && (
                        <Chip
                            label={
                                {
                                    pending: t('product.pending'),
                                    reserved: t('product.reserved'),
                                }[product.status]
                            }
                        />
                    )}
                    {/* <Dialog
                        open={false}
                        handler={handleOpenCheckout}
                        size="xs"
                        animate={{
                            mount: { scale: 1, y: 0 },
                            unmount: { scale: 0.9, y: -100 },
                        }}>
                        <DialogHeader>
                            <Typography
                                className="font-poppins"
                                variant="h4">
                                {t('product.checkout')}
                            </Typography>
                        </DialogHeader>
                        <DialogBody className="flex flex-col items-center">
                            <div className="w-52 h-52">
                                <img
                                    src={checkLink(selectedImage)}
                                    alt={product.title}
                                    className="object-cover w-full h-full rounded-md cursor-pointer object-center  "
                                    onClick={handleLightbox}
                                />
                            </div>
                            <Typography
                                className="font-poppins"
                                variant="paragraph">
                                {t('product.checkout-text')}
                            </Typography>
                        </DialogBody>
                        <DialogFooter>
                            <Button
                                variant="text"
                                color="red"
                                onClick={handleOpenCheckout}
                                className="mr-1">
                                <span>{t('global.no')}</span>
                            </Button>
                            <Button
                                variant="text"
                                color="green"
                                onClick={handleCheckoutConfirm}>
                                <span>{t('global.yes')}</span>
                            </Button>
                        </DialogFooter>
                    </Dialog> */}
                    <ProductAccordion product={product} />
                </Stack>
            </Grid>
        </Grid>
    );
};

export default ProductDetails;
