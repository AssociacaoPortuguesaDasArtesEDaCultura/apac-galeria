import { useState, useEffect, useContext } from 'react';

import { Link } from 'react-router-dom';
import {
    Box,
    Button,
    CircularProgress,
    Stack,
    Typography,
} from '@mui/material';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import useProductSearch from '../../hooks/useProductSearch';
import ProductPaper from '../../components/Seller/ProductPaper';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import { ProductQuery } from '../../types/query';
import { FirebaseAuthContext } from '../../contexts/currentAuthUserContext';

export default function Products() {
    const { t } = useTranslation();

    const { user } = useContext(FirebaseAuthContext);
    const [productQuery] = useState<ProductQuery>({
        seller: user.id,
    });

    const { hasMore, loading, error, products, loadMore } =
        useProductSearch(productQuery);
    console.log(products);

    return (
        <Box
            component="div"
            sx={{
                paddingY: '2rem',
                paddingX: {
                    xs: '2rem',
                    sm: '4rem',
                    md: '6rem',
                    lg: '20%',
                },
            }}>
            <Stack
                direction="column"
                spacing={4}
                alignItems={'center'}
                justifyContent={'flex-start'}>
                <Typography variant="h3">{t('artist.your-pieces')}</Typography>
                <Button
                    component={Link}
                    color="secondary"
                    to="/profile/new-product"
                    sx={{ alignSelf: 'flex-end' }}
                    startIcon={<AddIcon />}
                    variant="contained">
                    {t('artist.new-piece')}
                </Button>
                {products &&
                    products.map((product, index) => (
                        <Link
                            key={index}
                            to={`/product/${product.id}`}
                            state={product}>
                            <ProductPaper product={product} />
                        </Link>
                    ))}
                {error && <div>{t('errors.title')}</div>}
                {loading && (
                    <Box
                        component="div"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginY: '2rem',
                        }}>
                        <CircularProgress />
                    </Box>
                )}
                {hasMore && (
                    <Button
                        startIcon={<AddCircleOutlineSharpIcon />}
                        variant="outlined"
                        onClick={() => {
                            loadMore();
                        }}>
                        {t('global.load-more')}
                    </Button>
                )}
            </Stack>
        </Box>
    );
}
