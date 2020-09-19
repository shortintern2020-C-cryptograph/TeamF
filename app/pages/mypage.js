import Head from 'next/head'
import styles from '../styles/MyPage.module.scss'
import Layout from '../components/Layout'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

const MyPage = () => {
  const { user } = useContext(AuthContext)
  console.log(user)
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>mypage | scecepicks</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div>mypageやで</div>
        <p>{user?.providerData[0].displayName}</p>
        <img src={user?.providerData[0].photoURL} alt="my profile thumbnail" className={styles.profileImage} />
      </div>
    </Layout>
  )
}

export default MyPage
