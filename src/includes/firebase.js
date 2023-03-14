import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyCCRdhlsg2rmZPHBRTyqYEIKAxNtUUfbKM',
  authDomain: 'music-79fd8.firebaseapp.com',
  projectId: 'music-79fd8',
  storageBucket: 'music-79fd8.appspot.com',
  appId: '1:419077111081:web:5c7d4a0cb26c655e368b38'
}

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()

const usersCollection = db.collection('users')
const songsCollection = db.collection('songs')

export { auth, db, usersCollection, songsCollection, storage }
