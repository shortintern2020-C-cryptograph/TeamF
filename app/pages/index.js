import Head from 'next/head'
import { useContext } from 'react'
import AuthContextProvider, { AuthContext } from '../contexts/AuthContext'
import styles from '../styles/Home.module.scss'

const Home = () => {
  // const { user, setUser, isLoading, setLoading } = useContext(AuthContext)
  // console.log(user, isLoading)
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>hello nextjs</div>
    </div>
  )
}

export default Home
