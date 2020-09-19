import { useContext, useEffect } from 'react'
import firebase from '../config/firebase'
import 'firebase/auth'
import AuthContextProvider, { AuthContext } from '../contexts/AuthContext'
import '../styles/globals.scss'
import 'firebaseui-ja/dist/firebaseui.css'
import Splash from '../components/Splash'
import { ToastProvider, useToasts } from 'react-toast-notifications'
import { PageTransition } from '../components/PageTransition'

const MyApp = ({ Component, pageProps }) => {
  const { addToast } = useToasts()
  const { setUser, setLoading, isLoading } = useContext(AuthContext)
  useEffect(() => {
    firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        addToast(`signed in as ${firebaseUser.providerData[0].displayName}`, { appearance: 'success' })
      } else {
        setUser(null)
        console.log('not logged in')
      }
      setLoading(false)
    })
  }, [])
  if (isLoading) {
    return <Splash />
  }
  return (
    <PageTransition>
      <Component {...pageProps} />
    </PageTransition>
  )
}

const MyAppContainer = ({ Component, pageProps }) => {
  return (
    <ToastProvider PlacementType="bottom-center" autoDismiss={true}>
      <AuthContextProvider>
        <MyApp pageProps={pageProps} Component={Component} />
      </AuthContextProvider>
    </ToastProvider>
  )
}

export default MyAppContainer
