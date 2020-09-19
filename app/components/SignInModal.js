import React, { useState, useEffect, useContext } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import { AuthContext } from '../contexts/AuthContext'
import Modal from 'react-modal'
import styles from '../styles/Signin.module.scss'
import { useToasts } from 'react-toast-notifications'

let firebaseui
if (typeof window !== 'undefined') {
  firebaseui = require('firebaseui-ja')
}

const SignIn = () => {
  const { ui, setUi, user, signInModalOpen, setSignInModalOpen, storageAvailable } = useContext(AuthContext)
  const { addToast } = useToasts()

  const uiStart = () => {
    ui.start('#firebaseui-auth-container', {
      // TODO: signinsuccessurlを、呼ばれた場所に設定する
      signInSuccessUrl: '/',
      signInOptions: [firebase.auth.TwitterAuthProvider.PROVIDER_ID],
      callbacks: {
        uiShown: function () {
          if (storageAvailable('sessionStorage')) {
            sessionStorage.setItem('waiting_redirect', 1)
          }
        }
      }
      // tosUrl: '<your-tos-url>',
      // privacyPolicyUrl: '/policy'
    })
  }

  useEffect(() => {
    if (!ui) {
      setUi(firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth()))
    }
  }, [])

  const handleLogOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        addToast(`logged out:  ${user.providerData[0].displayName}`, { appearance: 'success' })
        setSignInModalOpen(false)
        if (storageAvailable('sessionStorage')) {
          sessionStorage.removeItem('waiting_redirect')
        }
      })
      .catch((e) => {
        alert('ログアウトできませんでした。' + JSON.stringify(e))
        console.error(e)
      })
  }

  const closeModal = () => {
    setSignInModalOpen(false)
    if (storageAvailable('sessionStorage')) {
      sessionStorage.removeItem('waiting_redirect')
    }
  }

  const afterOpenModal = () => {
    uiStart()
  }

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '4px',
      boxShadow: '0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2)'
    },
    overlay: {
      // 良い感じの色がわかりません
      backgroundColor: 'rgba(50, 50, 50, 0.6)'
    }
  }

  return (
    <Modal
      closeTimeoutMS={100}
      isOpen={signInModalOpen}
      onRequestClose={closeModal}
      onAfterOpen={afterOpenModal}
      ariaHideApp={false}
      style={customStyles}
      contentLabel="Example Modal">
      <div style={{ padding: '1em 2em', textAlign: 'center' }}>
        <h3>投稿するにはログインしーてね</h3>
        <div className="loginCard">
          <div id="firebaseui-auth-container" style={{ opacity: user ? 0 : 1 }} />
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
    </Modal>
  )
}

export default SignIn
