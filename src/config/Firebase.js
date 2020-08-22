import * as firebase from "firebase"

const firebaseConfig = {
    apiKey: "AIzaSyAhOu4V61v1hOAqJf5x30gjBRtqHLvrYrs",
    authDomain: "quiz-game-bbfdb.firebaseapp.com",
    databaseURL: "https://quiz-game-bbfdb.firebaseio.com",
    projectId: "quiz-game-bbfdb",
    storageBucket: "quiz-game-bbfdb.appspot.com",
    messagingSenderId: "379512905569",
    appId: "1:379512905569:web:7daea437a2bf7ba5faaf20",
    measurementId: "G-7ZGT3S0EB0"
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase;