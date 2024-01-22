var admin = require("firebase-admin");

var serviceAccount = require("./pfiles/serviceAccessKey.json");

const {initializeApp} = require('firebase/app')
const fauth = require('firebase/auth')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


const firebaseConfig = {
    apiKey: "AIzaSyAPO3GUvMBZzTcxspq-wGzd4KPElheX2gY",
    authDomain: "notes-6b8ea.firebaseapp.com",
    projectId: "notes-6b8ea",
    storageBucket: "notes-6b8ea.appspot.com",
    messagingSenderId: "1076422254538",
    appId: "1:1076422254538:web:0456e78717f6f47b277933"
};

const app = initializeApp(firebaseConfig);
const fdb = admin.firestore();
const storage = admin.storage().bucket('gs://notes-6b8ea.appspot.com');
console.log('firebase works!');
module.exports = {fdb, fauth, storage}