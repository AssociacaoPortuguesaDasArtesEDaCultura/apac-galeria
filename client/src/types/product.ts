export type Status = 'available' | 'pending' | 'unavailable';
export type Product = {
    id: string;
    seller: string;
    title: string;
    author: string;
    storageRefs: string[];
    photos: string[];
    description: string;
    price: number;
    product_type: string;
    piece_info: PieceInfo;
    published_date: Date;
    status: Status;
    featured: boolean;
};

export type PartialProduct = {
    title: string;
    author: string;
    description: string;
    price: number;
    product_type: string;
    piece_info: PieceInfo;
};

export type PieceInfo = {
    technique: string;
    materials: string[];
    dimensions: Dimensions;
    year: number;
    state: string;
};

export type Dimensions = {
    height: number;
    width: number;
    depth: number;
    weight: number;
};
