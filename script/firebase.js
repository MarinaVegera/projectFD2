const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAudr4cnZ5j5yT33_nxgZ_kR6D0LLIrttE",
    authDomain: "flagsdb-c48ae.firebaseapp.com",
    databaseURL: "https://flagsdb-c48ae-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "flagsdb-c48ae",
    storageBucket: "flagsdb-c48ae.appspot.com",
    messagingSenderId: "399118232407",
    appId: "1:399118232407:web:9ccda7c7a36b2da489ec12",
    measurementId: "G-FNGP9WGF90"
});

const myAppDB = firebaseApp.database();
const auth = firebaseApp.auth();
