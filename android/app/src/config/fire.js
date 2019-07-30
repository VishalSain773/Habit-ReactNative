import firebase from 'firebase';
// import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAakj6y7lnGyNEW_9Xmx-phSKVvRI4S2i8",
    authDomain: "habit-ceb86.firebaseapp.com",
    databaseURL: "https://habit-ceb86.firebaseio.com",
    projectId: "habit-ceb86",
    storageBucket: "habit-ceb86.appspot.com",
    messagingSenderId: "949967617820",
    appId: "1:949967617820:web:442cc89d89e4d0f5"
  };

 

const fire = firebase.initializeApp(firebaseConfig);

// export const db = firebase.firestore();
// db.settings({timestampsInSnapshots : true})

export default fire;