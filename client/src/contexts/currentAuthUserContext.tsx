import {
    Dispatch,
    SetStateAction,
    createContext,
    useEffect,
    useState,
} from 'react';
import { getUserInfo } from '../utils/db';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { User } from '../types/user';

type AuthValues = {
    user: User | undefined;
    setUser: Dispatch<SetStateAction<User>>;
};
const FirebaseAuthContext = createContext<AuthValues>(undefined);

const FirebaseAuthProvider = ({ children }) => {
    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            async (authenticatedUser) => {
                if (authenticatedUser) {
                    const user = await getUserInfo(authenticatedUser.uid);
                    setUser(user);
                    setLoading(false);
                }
                if (authenticatedUser === undefined) {
                    setUser(undefined);
                    setLoading(false);
                }
                return () => {
                    if (unsubscribe) unsubscribe();
                };
            }
        );
    }, []);

    const values = {
        user: user,
        setUser: setUser,
    };

    return (
        <FirebaseAuthContext.Provider value={values}>
            {!loading && children}
        </FirebaseAuthContext.Provider>
    );
};

export { FirebaseAuthContext, FirebaseAuthProvider };
