import { useState, useEffect } from 'react';

import ProductDetails from '../components/Product/ProductDetails';
import ProductThumbnail from '../components/pintar_o_7/ProductThumbnail';

import { useParams, useLocation } from 'react-router-dom';
import { Box, Divider, Typography, Grid } from '@mui/material';

import useProductSearch from '../hooks/useProductSearch';
import { useTranslation } from 'react-i18next';
//import { CurrentChatContext } from '../contexts/chatContext';
import { getProduct } from '../utils/db';
import { Product } from '../types/product';

const ProductPage = (props: { loggedIn: boolean }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const [product, setProduct] = useState<Product>(location.state);
    const { product_id } = useParams();

    const { loggedIn } = props;

    const getAndSetProduct = async (id: string) => {
        const result = await getProduct(id);
        setProduct(result);
    };

    useEffect(() => {
        if (!product || product.id !== product_id) {
            getAndSetProduct(product_id);
        }
    }, [product_id, product]);

    const { products, loading } = useProductSearch({
        // seller: product.seller,
        available: true,
        limit: 3,
    });

    return (
        <Box
            component="div"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                paddingX: {
                    xs: '2rem',
                    sm: '4rem',
                    md: '6rem',
                    lg: '8rem',
                },
                my: 5,
            }}>
            {product && (
                <ProductDetails product={product} loggedIn={loggedIn} />
            )}
            <Divider />
            <Typography variant="h6">{t('product.more')}</Typography>
            {/* OUTRAS OBRAS DO ARTISTA */}
            <Grid container sx={{ marginTop: 2 }}>
                {products &&
                    products.map((product, index) => (
                        <Grid
                            key={index}
                            display={'flex'}
                            justifyContent={'center'}
                            alignItems={'flex-start'}
                            sm={12}
                            md={6}
                            lg={4}>
                            <ProductThumbnail product={product} />
                        </Grid>
                    ))}
                {products && products.length === 0 && !loading && (
                    <Typography variant="subtitle1" align="center">
                        {t('product.no_more')}
                    </Typography>
                )}
            </Grid>
        </Box>
    );
};

export default ProductPage;
