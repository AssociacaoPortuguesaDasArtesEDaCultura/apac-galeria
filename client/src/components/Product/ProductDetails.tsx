import { ProductType } from '../../types/product';
import { useEffect, useState } from 'react';
import ProductAccordion from './ProductAccordion';
import { ImageLightBox } from './ImageLightBox';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography,
} from '@material-tailwind/react';

import { Alert } from '@mui/material';

import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useCart from '../../hooks/useCart';
import { checkLink } from '../../fetchers';

const ProductDetails = (data: { product: ProductType; loggedIn: boolean }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { product, loggedIn } = data;

    const { cart, REDUCER_ACTIONS, dispatch } = useCart();

    const [selectedImage, setSelectedImage] = useState(product.photos[0]);
    const [lightboxStatus, setLightboxStatus] = useState(false);
    const [openCheckoutModel, setCheckoutModel] = useState(false);
    const [loggedInError, setLoggedInError] = useState(false);

    const checkIfInCart = () => {
        // check if product is in cart array
        var i = 0;
        console.log('product_id', product._id);

        while (i < cart.length) {
            console.log('cart', cart[i].id);
            if (cart[i]._id === product._id) {
                return true;
            }
            i++;
        }
        return false;
    };

    const handleLightbox = () => setLightboxStatus(!lightboxStatus);
    const handleOpenCheckout = () => {
        console.log('loggedIn', loggedIn);
        if (!data.loggedIn) {
            setLoggedInError(true);
        } else {
            dispatch({ type: REDUCER_ACTIONS.ADD, payload: product });
            setCheckoutModel(!openCheckoutModel);
        }
    };
    const handleCheckoutConfirm = () => navigate('/cart');

    useEffect(() => {
        setSelectedImage(product.photos[0]);
    }, [product]);

    return (
        <Box component="div" sx={{ my: 10 }}>
            <div className="grid gap-4 lg:gap-8 grid-cols-1 lg:grid-cols-12">
                {/* LIGHTBOX */}
                <Box
                    component="div"
                    sx={{
                        display: lightboxStatus ? 'block' : 'none',
                    }}>
                    <ImageLightBox
                        status={lightboxStatus}
                        statusFunc={setLightboxStatus}
                        images={product.photos}
                        selectedIndex={product.photos.indexOf(selectedImage)}
                    />
                </Box>
                {/* THUMBNAIL AREA */}
                <div className="col-span-1">
                    <div className="flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                        {product.photos.map((photo) => (
                            <div className="aspect-w-1 aspect-h-1">
                                <img
                                    src={checkLink(photo)}
                                    alt={product.title}
                                    className="object-cover w-14 h-14 rounded-sm cursor-pointer hover:opacity-80"
                                    onClick={() => setSelectedImage(photo)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                {/* MAIN AREA */}
                <div className="col-span-1 lg:col-start-2 lg:col-span-6 order-first lg:order-none">
                    <div className="flex flex-col space-y-2">
                        <div className="w-full h-96 sm:h-128 md:h-176">
                            <img
                                src={checkLink(selectedImage)}
                                alt={product.title}
                                className="object-cover w-full h-full rounded-md cursor-pointer object-center  "
                                onClick={handleLightbox}
                            />
                        </div>
                    </div>
                </div>
                {/* ACTION AREA */}
                <div className="col-span-1 lg:col-start-8 lg:col-span-5">
                    <div className="flex flex-col space-y-2">
                        <div className="flex flex-col space-y-2">
                            <div className="flex flex-col space-y-1">
                                <Typography
                                    className="font-poppins mb-4"
                                    variant="h2">
                                    {product.author}
                                </Typography>

                                <Typography
                                    className="font-poppins"
                                    variant="h4">
                                    {product.title}, {product.piece_info?.year}
                                </Typography>
                            </div>
                            <div className="flex flex-row items-center justify-between">
                                <Typography
                                    className="font-poppins mt-8 mb-4"
                                    variant="h4">
                                    {new Intl.NumberFormat('pt-PT', {
                                        style: 'currency',
                                        currency: 'EUR',
                                    }).format(product.price)}
                                </Typography>
                            </div>
                            <div className="flex flex-col space-y-1">
                                {loggedInError && (
                                    <Alert
                                        onClose={() => {
                                            setLoggedInError(false);
                                        }}
                                        variant="filled"
                                        severity="error"
                                        sx={{
                                            mx: 2,
                                        }}>
                                        {t('errors.cart.login')}
                                    </Alert>
                                )}
                                <button
                                    type="button"
                                    className="text-white bg-gradient-to-r from-gray-700 to-gray-900 hover:bg-gradient-to-br font-poppins rounded-lg text-md px-5 py-2.5 text-center mb-4 mx-4"
                                    onClick={handleOpenCheckout}
                                    disabled={checkIfInCart()}>
                                    {checkIfInCart()
                                        ? t('product.already-in-cart')
                                        : t('product.add-to-cart')}
                                </button>
                                <Dialog
                                    open={openCheckoutModel}
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
                                </Dialog>
                            </div>
                            <div className="flex flex-col space-y-1 mx-4">
                                <ProductAccordion product={product} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Box>
    );
};

export default ProductDetails;
