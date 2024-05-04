import { Container, Divider, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import ProductDetails from '../components/Product/ProductDetails';
import ProductThumbnail from '../components/pintar_o_7/ProductThumbnail';
import useProductSearch from '../hooks/useProductSearch';
import { Product } from '../types/product';
import { getProduct } from '../utils/db';

const ProductPage = (props: { loggedIn: boolean }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const [product, setProduct] = useState<Product>(location.state);
    const { product_id } = useParams();

    const { loggedIn } = props;

    const getAndSetProduct = async (id: string) => {
        const result = await getProduct(id);
        setProduct(result);
        console.log('GOT: ', result);
    };

    useEffect(() => {
        if (!product || product.id !== product_id) {
            getAndSetProduct(product_id);
        }
    }, [product_id, product]);

    const { products, loading } = useProductSearch({
        seller: product.seller,
        // status: 'available',
        limit: 3,
    });

    return (
        <Container component="div" sx={{ my: 5 }}>
            {/* <Box sx={{background: "green", width: "100%"}}> */}
            {product && (
                <ProductDetails product={product} loggedIn={loggedIn} />
            )}
            {/* </Box> */}
            <Divider sx={{ my: 3 }} />
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
        </Container>
    );
};

export default ProductPage;
