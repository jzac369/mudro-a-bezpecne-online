// Verejná Firebase Web konfigurácia — NIE je to tajný kľúč, dá sa bezpečne
// commitovať (skutočné oprávnenia strážia Firestore/Storage security rules).
// Nájdeš ju vo Firebase Console → Project settings → Your apps → Web app.
window.FIREBASE_CONFIG = {
  apiKey: "PLACEHOLDER_API_KEY",
  authDomain: "PLACEHOLDER_PROJECT.firebaseapp.com",
  projectId: "PLACEHOLDER_PROJECT",
  storageBucket: "PLACEHOLDER_PROJECT.appspot.com",
  messagingSenderId: "PLACEHOLDER_SENDER_ID",
  appId: "PLACEHOLDER_APP_ID",
};
