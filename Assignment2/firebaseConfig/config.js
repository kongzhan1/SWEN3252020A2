import firebase from 'firebase';

// firebase API configurations
const firebaseConfig = {
    apiKey: "AIzaSyC9kXJttHrUjD5WiQpz4DvFkQywvOfIo5E",
    authDomain: "reactnativeproject-65153.firebaseapp.com",
    databaseURL: "https://reactnativeproject-65153.firebaseio.com",
    projectId: "reactnativeproject-65153",
    storageBucket: "reactnativeproject-65153.appspot.com",
    messagingSenderId: "818611928225",
    appId: "1:818611928225:web:b70d63f32dca49698644e0",
    measurementId: "G-FR3HN2D6YY"
};
// firebase buildin function, for initialzing firebase for the app
firebase.initializeApp(firebaseConfig);

// Defining some varibales and connecting them with firebase features.
export const fb = firebase;
export const auth = firebase.auth();
export const database = firebase.database();
export const storage = firebase.storage();