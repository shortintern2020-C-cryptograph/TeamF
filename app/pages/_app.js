import '../styles/globals.scss'
// import firebase from '../config/firebase'
// import 'firebase/auth'
import AuthContextProvider from '../contexts/AuthContext'

// {/*<AuthContextProvider>*/}
// {/* </AuthContextProvider> */}
const MyApp = ({ Component, pageProps }) => {
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
// export default MyApp
