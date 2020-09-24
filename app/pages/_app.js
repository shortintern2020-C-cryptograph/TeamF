import { useContext, useEffect } from 'react'
import firebase from '../config/firebase'
import 'firebase/auth'
import AuthContextProvider, { AuthContext } from '../contexts/AuthContext'
import '../styles/globals.scss'
import 'firebaseui-ja/dist/firebaseui.css'
import Splash from '../components/Splash'
import { ToastProvider, useToasts } from 'react-toast-notifications'
import { PageTransition } from '../components/PageTransition'
import SignIn from '../components/SignInModal'
import Head from 'next/head'
import MainContextProvider from '../contexts/MainContext'
import { rollbar } from '../config/logger'

// console.log(process.env.NEXT_PUBLIC_ENV)

/**
 * 全体のラッパー
 * @author Takahiro Nishino
 */
const MyApp = ({ Component, pageProps }) => {
  const { addToast } = useToasts()
  const { setUser, setLoading, isLoading, storageAvailable, setSignInModalOpen } = useContext(AuthContext)
  useEffect(() => {
    firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        // TODO: 消す
        // firebase
        //   .auth()
        //   .currentUser.getIdToken(/* forceRefresh */ true)
        //   .then(function (idToken) {
        //     console.log(`ID Token: ${idToken}`)
        //   })
        //   .catch(function (error) {
        //     // Handle error
        //   })

        if (storageAvailable('sessionStorage')) {
          let isWaiting = JSON.parse(sessionStorage.getItem('waiting_redirect'))
          if (isWaiting == 1) {
            sessionStorage.setItem('waiting_redirect', 2)
          } else if (isWaiting == 2) {
            addToast(`signed in as ${firebaseUser.providerData[0].displayName}`, { appearance: 'success' })
            sessionStorage.removeItem('waiting_redirect')
            setSignInModalOpen(false)
          }
        } else {
          addToast(`Welcome ${firebaseUser.providerData[0].displayName}!`, { appearance: 'success' })
        }
      } else {
        setUser(null)
        // console.log('not logged in')
      }
      setLoading(false)
    })

    if (storageAvailable('sessionStorage')) {
      let isWaiting = JSON.parse(sessionStorage.getItem('waiting_redirect'))
      if (isWaiting) {
        setSignInModalOpen(true)
      }
    }
  }, [])

  if (isLoading) {
    return <Splash />
  }
  // <PageTransition>
  // </PageTransition>

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap" rel="stylesheet" />
      </Head>
      <Component {...pageProps} />
      <SignIn />
    </>
  )
}

/**
 * コンテキストを使えるように、さらに全体のラッパー
 * @author Takahiro Nishino
 */
const MyAppContainer = ({ Component, pageProps }) => {
  return (
    <ToastProvider PlacementType="bottom-center" autoDismiss={true}>
      <AuthContextProvider>
        <MainContextProvider>
          <MyApp pageProps={pageProps} Component={Component} />
        </MainContextProvider>
      </AuthContextProvider>
    </ToastProvider>
  )
}

export default MyAppContainer
