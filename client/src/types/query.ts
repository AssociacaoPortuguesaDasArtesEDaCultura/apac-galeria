import { DocumentSnapshot } from 'firebase/firestore';
import { Status } from './product';

export type ProductQuery = {
    status?: Status | Status[];
    seller?: string;
    limit?: number;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    productTypes?: string[];
    orderBy?: string;
    startAt?: DocumentSnapshot;
};

export type SellerQuery = {
    limit?: number;
    role: 'seller';
    startAt?: DocumentSnapshot;
    orderBy?: string;
};
