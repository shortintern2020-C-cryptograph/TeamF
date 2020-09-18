import { useContext, useEffect } from 'react'
import firebase from '../config/firebase'
import 'firebase/auth'
import AuthContextProvider, { AuthContext } from '../contexts/AuthContext'
import '../styles/globals.scss'
// import '../styles/firebaseui.module.css'
import 'firebaseui-ja/dist/firebaseui.css'
import Splash from '../components/Splash'

const MyApp = ({ Component, pageProps }) => {
  const { setUser, setLoading, isLoading } = useContext(AuthContext)
  useEffect(() => {
    firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        // setSignInSuccessOpen(true)
        console.log(`successfully logged in!`)
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
  return <Component {...pageProps} />
}

const MyAppContainer = ({ Component, pageProps }) => {
  return (
    <AuthContextProvider>
      <MyApp pageProps={pageProps} Component={Component} />
    </AuthContextProvider>
  )
}

export default MyAppContainer
