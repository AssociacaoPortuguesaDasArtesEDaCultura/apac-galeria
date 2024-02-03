import { FirebaseFirestore } from "firebase-admin";
import { FirestoreDataConverter, collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import { app, auth } from "./firebase";

import { User } from "../types/user";

const converter = <T>(): FirestoreDataConverter<T> => ({
    toFirestore: (
        data: FirebaseFirestore.WithFieldValue<T>
    ): FirebaseFirestore.DocumentData => data as FirebaseFirestore.DocumentData,
    fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
        snap.data() as T,
});

// helpers
const collectionGeneric = <T>(collectionPath: string) =>
    collection(getFirestore(app), collectionPath).withConverter(converter<T>());
const docGeneric = <T>(docPath: string) =>
    doc(getFirestore(app), docPath).withConverter(converter<T>());

// new entries here
export const db = {
    users: collectionGeneric<User>("users"),
    user: (id: string) => docGeneric<User>(`users/${id}`),
};

export const getUserInfo = async (): Promise<User> => {
    console.log(auth.currentUser.uid);
    const q = query(db.users, where("uid", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs[0].data();
}

export const saveUserInfo = async (user: User): Promise<void> => {
    await setDoc(db.user(user.uid), user)
}