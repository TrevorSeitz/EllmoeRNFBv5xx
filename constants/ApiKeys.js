import firebase from 'react-native-firebase';
// import * as firestore from '@react-native-firebase/firestore';
// import firestore from "firebase/react-native-firebase";

const settings = {};
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAdb-VyzqskSDW_vxh984z7elcmNkPOYts",
  src: "https://www.gstatic.com/firebasejs/5.9.1/firebase.js",
  authDomain: "ellmoe.firebaseapp.com",
  databaseURL: "https://ellmoe.firebaseio.com",
  projectId: "ellmoe",
  storageBucket: "ellmoe.appspot.com",
  messagingSenderId: "774360750184"
};

// firebase.initializeApp(firebaseConfig);

// firebase.firestore().settings(settings);
// firestore.settings(settings);

export default firebase;
