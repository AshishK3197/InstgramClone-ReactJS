import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
	apiKey: "AIzaSyBSqyYoUG95f7jz1g-ietEKq32vNdvgIsY",
	authDomain: "instagram-clone-d6fb1.firebaseapp.com",
	projectId: "instagram-clone-d6fb1",
	storageBucket: "instagram-clone-d6fb1.appspot.com",
	messagingSenderId: "177825943465",
	appId: "1:177825943465:web:bdc16f6dfad5f981e5beb8",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, storage, auth };
