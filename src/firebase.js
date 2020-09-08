import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyCPHhaxdfKOqPHYlfnQtSv38n19ik1FwfA",
    authDomain: "whatsappclone-8ae83.firebaseapp.com",
    databaseURL: "https://whatsappclone-8ae83.firebaseio.com",
    projectId: "whatsappclone-8ae83",
    storageBucket: "whatsappclone-8ae83.appspot.com",
    messagingSenderId: "810011438602",
    appId: "1:810011438602:web:9fdef1f55343d0efc139f3"
  };

  const firebaseapp = firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  export default db;