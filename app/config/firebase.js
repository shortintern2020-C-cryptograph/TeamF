import firebase from 'firebase/app'
import 'firebase/auth'
import { firebaseConfig } from './constants'

/**
 * initialize firebase
 * @author Takahiro Nishino
 */
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
  firebase.auth().languageCode = 'ja'
}
export default firebase
