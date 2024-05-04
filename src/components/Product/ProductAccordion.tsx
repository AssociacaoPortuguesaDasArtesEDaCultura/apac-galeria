import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Product } from '../../types/product';

const ProductAccordion = (props: { product: Product }) => {
    const { t } = useTranslation();
    const product = props.product;

    return (
        <Box className="font-poppins" sx={{ px: 0 }}>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    {t('product.product-details')}
                </AccordionSummary>
                <AccordionDetails>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                        {`${t('product.technique')}: ${product.piece_info?.technique}`}
                    </p>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                        {`${t('product.dimensions')}: ${
                            product.piece_info?.dimensions
                                ? `${product.piece_info.dimensions.width} x ${product.piece_info.dimensions.height} x ${product.piece_info.dimensions.depth}`
                                : ''
                        }`}
                    </p>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                        {`${t('product.weight')}: ${
                            product.piece_info?.dimensions?.weight || ''
                        }${product.piece_info?.dimensions ? 'kg' : ''}`}
                    </p>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                        {`${t('product.materials')} ${product.piece_info?.materials}`}
                    </p>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    {t('global.description')}
                </AccordionSummary>
                <AccordionDetails>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                        {product.description}
                    </p>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default ProductAccordion;
