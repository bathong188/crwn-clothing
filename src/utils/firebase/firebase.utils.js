// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import {getFirestore, doc, setDoc, getDoc} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsaOYMtz0rbvtDJ194OnmOe4-sMmYXaUA",
  authDomain: "crown-clothing-project-db.firebaseapp.com",
  projectId: "crown-clothing-project-db",
  storageBucket: "crown-clothing-project-db.appspot.com",
  messagingSenderId: "255395601147",
  appId: "1:255395601147:web:a8ece56bfb73438a126e5e"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  "prompt": "select_account"
});

// a singleton, keeps track of all authentication states that are happening
// throughout the application
export const auth = getAuth();

export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
// export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

export const createUserDocumentFromAuth = async (userAuth, additionalInformation = {}) => {
  if(!userAuth) return;

  // get document reference inside `db`, under `users` collection, with this user's `uid`
  const userDocRef = doc(db, "users", userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  // check if user data does not exist
  if (userSnapshot.exists() === false) {
    // create/set the document with the data from userAuth in my collection
    const {displayName, email} = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation
      });
    } catch (e) {
      console.log("error creating the user", e.message);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if(!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if(!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};