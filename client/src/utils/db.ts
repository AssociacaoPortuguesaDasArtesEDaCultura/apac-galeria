import {
    addDoc,
    collection,
    doc,
    DocumentData,
    FirestoreDataConverter,
    getDoc,
    getFirestore,
    QueryDocumentSnapshot,
    setDoc,
    updateDoc,
} from 'firebase/firestore';
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from './firebase';

import { PartialProduct, Product } from '../types/product';
import { Customer, Seller, User } from '../types/user';
import { validatePartialProduct } from '../validations/product';

type EntityWithId = { id: string };

const converter = <T extends EntityWithId>(): FirestoreDataConverter<T> => ({
    toFirestore: (data: T): DocumentData => {
        delete data.id;
        return data as DocumentData;
    },
    fromFirestore: (snap: QueryDocumentSnapshot) => {
        const obj = snap.data();
        obj.id = snap.id;
        return obj as T;
    },
});

// helpers
const collectionGeneric = <T extends EntityWithId>(collectionPath: string) =>
    collection(getFirestore(app), collectionPath).withConverter(converter<T>());
const docGeneric = <T extends EntityWithId>(docPath: string) =>
    doc(getFirestore(app), docPath).withConverter(converter<T>());

// new entries here
export const db = {
    users: collectionGeneric<User>('users'),
    user: (id: string) => docGeneric<User>(`users/${id}`),

    products: collectionGeneric<Product>('products'),
    product: (id: string) => docGeneric<Product>(`products/${id}`),
};

export const getUserInfo = async (id: string): Promise<Customer | Seller> => {
    console.log('Searching for ', id);
    const user = await getDoc(db.user(id)).then((userSnapshot) =>
        userSnapshot.data()
    );
    console.log('Found user ', user);
    if (user === undefined) return undefined;
    if (user.role === 'customer') return user as Customer;
    if (user.role === 'seller') return user as Seller;
};

export const getProduct = async (id: string): Promise<Product> => {
    const productSnapshot = await getDoc(db.product(id));
    return productSnapshot.data();
};

export const saveUserInfo = async (user: User): Promise<void> => {
    await setDoc(db.user(user.id), user);
};

export const saveProduct = async (product: Product): Promise<Product> => {
    await setDoc(db.product(product.id), product);
    return getProduct(product.id);
};

const storage = getStorage();
const imagesRef = ref(storage, 'images');

export const getURLFromPath = async (path: string): Promise<string> => {
    const fileRef = ref(storage, path);
    return await getDownloadURL(fileRef);
};

// const uploadPhoto = async (file: File, refName: string): Promise<string> => {
//   const fileRef = ref(imagesRef, refName);
//
//   const uploadTask = uploadBytesResumable(fileRef, file);
//
//   uploadTask.on('state_changed', () => undefined, () => undefined, () =>
//     getDownloadURL(uploadTask.snapshot.ref))
//
//    return
// }

export const uploadProductWithPictures = async (
    seller: Seller,
    partialProduct: PartialProduct,
    photos: File[]
): Promise<string> => {
    if (!validatePartialProduct(partialProduct)) {
        throw new Error(
            'Invalid product. Please provide valid product details.'
        );
    }

    const currentDate = new Date();

    const product: Product = {
        id: '',
        seller: seller.id,
        photos: [],
        storageRefs: [],
        published_date: currentDate,
        status: 'pending',
        featured: false,
        ...partialProduct,
    };

    const docRef = await addDoc(db.products, product);

    const uploadedPhotos = await Promise.all(
        photos.map(async (file, i) => {
            const refName = docRef.id + `_${i}.` + file.type.split('/')[1];
            const fileRef = ref(imagesRef, refName);

            try {
                await uploadBytes(fileRef, file);
            } catch (error) {
                return undefined;
            }

            return fileRef.fullPath;
        })
    );

    const photosURL = await Promise.all(uploadedPhotos.map(getURLFromPath));

    await updateDoc(docRef, {
        storageRefs: uploadedPhotos,
        photos: photosURL,
    });

    return docRef.id;
};
