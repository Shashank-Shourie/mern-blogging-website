// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuZRbwADAFelttMbzWhA11fuPWY3cZqxA",
  authDomain: "react-js-blog-website-fe62b.firebaseapp.com",
  projectId: "react-js-blog-website-fe62b",
  storageBucket: "react-js-blog-website-fe62b.appspot.com",
  messagingSenderId: "913812739028",
  appId: "1:913812739028:web:6cd89e7e8feb331711fc41"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider()

const auth = getAuth();

export const authWithGoogle = async () => {
    let user = null;

    await signInWithPopup(auth,provider)
    .then((result)=>{
        user = result.user;
    })
    .catch((err)=>{
        console.log(err);
    })

    return user;
}