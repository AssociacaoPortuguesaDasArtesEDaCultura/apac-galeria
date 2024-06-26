import {
  DocumentData,
  DocumentSnapshot,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  startAfter,
  where,
} from "firebase/firestore";
import { Product } from "../types/product";
import { ProductQuery } from "../types/query";
import { db } from "../utils/db";

export const searchProducts = async (
  productQuery: ProductQuery,
): Promise<[Product[], DocumentSnapshot]> => {
  const filters: QueryConstraint[] = [];
  if (productQuery.status) {
    if (Array.isArray(productQuery.status)) {
      filters.push(where("status", "in", productQuery.status));
    } else {
      filters.push(where("status", "==", productQuery.status));
    }
  }
  if (productQuery.featured) {
    filters.push(where("featured", "==", true));
  }
  if (productQuery.seller) {
    filters.push(where("seller", "==", productQuery.seller));
  }
  if (productQuery.minPrice) {
    filters.push(where("price", ">=", productQuery.minPrice));
  }
  if (productQuery.maxPrice) {
    filters.push(where("price", "<=", productQuery.maxPrice));
  }
  if (productQuery.productTypes && productQuery.productTypes.length) {
    filters.push(where("product_type", "in", productQuery.productTypes));
  }
  if (productQuery.orderBy) {
    filters.push(orderBy(productQuery.orderBy));
  }
  if (productQuery.limit) {
    filters.push(limit(productQuery.limit));
  }
  if (productQuery.startAt) {
    filters.push(startAfter(productQuery.startAt));
  }

  const q = query(db.products, ...filters);

  const querySnapshot = await getDocs(q);

  return [
    querySnapshot.docs.map(
      (doc: QueryDocumentSnapshot<Product, DocumentData>): Product =>
        doc.data(),
    ),
    querySnapshot.docs[querySnapshot.docs.length - 1],
  ];
};
