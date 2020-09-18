import React, { useState, useEffect, useContext } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import { AuthContext } from '../contexts/AuthContext'
let firebaseui
if (typeof window !== 'undefined') {
  firebaseui = require('firebaseui-ja')
}
/* eslint react-hooks/exhaustive-deps: 0 */

const SignIn = ({ isLoading }) => {
  const [didMount, setDidMount] = useState(false)
  const { ui, setUi, user } = useContext(AuthContext)

  const uiStart = () => {
    ui.start('#firebaseui-auth-container', {
      signInSuccessUrl: '/',
      signInOptions: [firebase.auth.TwitterAuthProvider.PROVIDER_ID]
      // tosUrl: '<your-tos-url>',
      // privacyPolicyUrl: '/policy'
    })
  }

  useEffect(() => {
    if (didMount && !ui) {
      setUi(firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth()))
    }
  }, [isLoading])

  useEffect(() => {
    setDidMount(true)
    if (!isLoading && !ui) {
      setUi(firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth()))
    }
    if (!isLoading && !!ui) {
      uiStart()
    }
  }, [])

  useEffect(() => {
    if (didMount) uiStart()
  }, [ui])

  const handleLogOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => alert('ログアウトできたよ！'))
      .catch((e) => {
        alert('ログアウトできませんでした。' + JSON.stringify(e))
        console.error(e)
      })
  }

  return (
    <div style={{ border: '1px solid grey', padding: '2em', textAlign: 'center' }}>
      <h3>ログイン</h3>
      <div className="loginCard">
        <div id="firebaseui-auth-container" />
        {user && (
          <p style={{ textAlign: 'center' }}>
            ログインしているよ！
            <button onClick={handleLogOut} type="button">
              ログアウト
            </button>
            <br />
            <br />
            <span style={{ wordBreak: 'break-word' }}>{JSON.stringify(user.providerData[0])}</span>
          </p>
        )}
      </div>
    </div>
  )
}

export default SignIn
