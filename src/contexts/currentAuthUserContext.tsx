import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { User } from "../types/user";
import { getUserInfo } from "../utils/db";
import { auth } from "../utils/firebase";

type AuthValues = {
  user: User | undefined;
  setUser: Dispatch<SetStateAction<User>>;
  loggedIn: boolean;
};
const FirebaseAuthContext = createContext<AuthValues>(undefined);

const FirebaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(user !== undefined);

  useEffect(() => setLoggedIn(user !== undefined), [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      setLoading(true);
      if (authenticatedUser) {
        const fetchedUser = await getUserInfo(authenticatedUser.uid);
        setUser(fetchedUser);
      } else {
        setUser(undefined);
      }
      setLoading(false);
      return () => {
        if (unsubscribe) unsubscribe();
      };
    });
  }, []);

  const values = {
    user: user,
    setUser: setUser,
    loggedIn: loggedIn,
  };

  return (
    <FirebaseAuthContext.Provider value={values}>
      {!loading && children}
    </FirebaseAuthContext.Provider>
  );
};

export { FirebaseAuthContext, FirebaseAuthProvider };
