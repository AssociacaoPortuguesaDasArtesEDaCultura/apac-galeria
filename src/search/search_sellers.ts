import {
  DocumentData,
  DocumentSnapshot,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  QuerySnapshot,
  startAfter,
  where,
} from "firebase/firestore";
import { SellerQuery } from "../types/query";
import { Seller, User } from "../types/user";
import { db } from "../utils/db";

export const searchSellers = async (
  sellerQuery: SellerQuery,
): Promise<[Seller[], DocumentSnapshot]> => {
  const filters: QueryConstraint[] = [];
  if (sellerQuery.role) {
    filters.push(where("role", "==", sellerQuery.role));
  }
  if (sellerQuery.orderBy) {
    filters.push(orderBy(sellerQuery.orderBy));
  }
  if (sellerQuery.limit) {
    filters.push(limit(sellerQuery.limit));
  }
  if (sellerQuery.startAt) {
    filters.push(startAfter(sellerQuery.startAt));
  }

  const q = query(db.users, ...filters);

  let querySnapshot: QuerySnapshot;
  try {
    querySnapshot = await getDocs(q);
  } catch (error) {
    return null;
  }

  return [
    querySnapshot.docs.map(
      (doc: QueryDocumentSnapshot<User, DocumentData>): Seller =>
        doc.data() as Seller,
    ),
    querySnapshot.docs[querySnapshot.docs.length - 1],
  ];
};
