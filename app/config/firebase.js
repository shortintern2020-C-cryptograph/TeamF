import firebase from 'firebase/app'
import { firebaseConfig } from './constants'

const InitializeFirebase = () => {
  if (firebase.apps.length > 0) {
    return
  }
  firebase.initializeApp(firebaseConfig)
}

export default InitializeFirebase
