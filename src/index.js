import { initializeApp } from 'firebase/app';
import { updateDoc, getFirestore, getDocs, collection, addDoc, deleteDoc, onSnapshot, doc, query, where, orderBy, getDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyABp6DcmGK2zUz37QBpIcTDe3_zfD8oL30',
  authDomain: 'fir-nine-dojo.firebaseapp.com',
  projectId: 'fir-nine-dojo',
  storageBucket: 'fir-nine-dojo.appspot.com',
  messagingSenderId: '684569791067',
  appId: '1:684569791067:web:dcedb83196884c0a27cd7e',
};

// init firebase
initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const auth = getAuth();

// collection ref

const colRef = collection(db, 'books');

// queries

const q = query(colRef, orderBy('createdAt'));

// realtime collection data

const unsubCol = onSnapshot(q, snapshot => {
  let books = [];
  snapshot.docs.forEach(doc => {
    books.push({
      ...doc.data(),
      id: doc.id,
    });
  });
  console.log(books);
});

// adding docs
const addBookForm = document.querySelector('.add');
addBookForm.addEventListener('submit', e => {
  e.preventDefault();

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    addBookForm.reset();
  });
});

// deleting docs
const deleteBookForm = document.querySelector('.delete');
deleteBookForm.addEventListener('submit', e => {
  e.preventDefault();

  const docRef = doc(db, 'books', deleteBookForm.id.value);

  deleteDoc(docRef).then(() => {
    deleteBookForm.reset();
  });
});

// get a single doc

const docRef = doc(db, 'books', '9jdJiiFpzHV8W2v33qfj');

// single document but updates on change from firestore collection
const unsubDoc = onSnapshot(docRef, doc => {
  console.log(doc.data(), doc.id);
});

// update a document

const updateForm = document.querySelector('.update');
updateForm.addEventListener('submit', e => {
  e.preventDefault();

  const docRef = doc(db, 'books', updateForm.id.value);

  updateDoc(docRef, {
    title: 'updated title',
  }).then(() => {
    updateForm.reset();
  });
});

// signing users up
const signupForm = document.querySelector('.signup');
signupForm.addEventListener('submit', e => {
  e.preventDefault();

  const email = signupForm.email.value;
  const password = signupForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(cred => {
      signupForm.reset();
      console.log('user created', cred.user);
    })
    .catch(err => {
      console.log(err.message);
    });
});

// signing users in

const loginForm = document.querySelector('.login');
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;
  signInWithEmailAndPassword(auth, email, password)
    .then(cred => {
      // console.log('user logged in', cred.user.email);
    })
    .catch(err => {
      console.log(err.message);
    });
});

// signing users out

const logoutForm = document.querySelector('.logout');
logoutForm.addEventListener('click', e => {
  signOut(auth)
    .then(() => {
      // console.log('signed out user');
    })
    .catch(err => {
      console.log(err.message);
    });
});

// monitor login state

const unsubAuth = onAuthStateChanged(auth, user => {
  console.log('user state change', user);
});

// unsubscribe from listeners on the db / auth

const unsubButton = document.querySelector('.unsub');
unsubButton.addEventListener('click', e => {
  console.log('unsubscribing');
  unsubAuth();
  unsubDoc();
  unsubCol();
});
