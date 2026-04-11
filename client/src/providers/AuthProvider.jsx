import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
// import app from "../Firebase/firebase.config";
import auth from "../Firebase/firebase.config";

export const AuthContext = createContext(null);

// Social Auth Providers
const googleProvider = new GoogleAuthProvider();
// const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //Create User

  const createUser = (email, password) => {
    if (!auth) {
      return Promise.reject(new Error("Firebase is not configured"));
    }
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Update User
  const updateUserProfile = (name, image) => {
    if (!auth || !auth.currentUser) {
      return Promise.reject(new Error("Firebase is not configured"));
    }
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: image,
    });
  };

  // Login User
  const logIn = (email, password) => {
    if (!auth) {
      return Promise.reject(new Error("Firebase is not configured"));
    }
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google login
  const googleLogin = () => {
    if (!auth) {
      return Promise.reject(new Error("Firebase is not configured"));
    }
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logOut = () => {
    setUser(null);
    setLoading(true);
    if (!auth) {
      setLoading(false);
      return Promise.resolve();
    }
    return signOut(auth);
  };

  // Observer
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unSubscribe();
    };
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    updateUserProfile,
    logIn,
    logOut,
    googleLogin,
  };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.object,
};

export default AuthProvider;
