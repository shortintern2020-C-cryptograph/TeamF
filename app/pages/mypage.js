import Head from 'next/head'
import styles from '../styles/MyPage.module.scss'
import Layout from '../components/Layout'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import firebase from 'firebase/app'
import 'firebase/auth'
import { useToasts } from 'react-toast-notifications'
import { useRouter } from 'next/router'

const MyPage = () => {
  const { user, setSignInModalOpen, storageAvailable } = useContext(AuthContext)
  const { addToast } = useToasts()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      setSignInModalOpen(true)
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
        router.push('/')
      })
      .catch((e) => {
        alert('ログアウトできませんでした。' + JSON.stringify(e))
        console.error(e)
      })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{`${user?.providerData[0].displayName} | scecepicks`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        mypageやで
        <button onClick={() => router.push('/')}>戻る</button>
      </div>
      {user && (
        <>
          <p>{user?.providerData[0].displayName}</p>
          <img src={user?.providerData[0].photoURL} alt="my profile thumbnail" className={styles.profileImage} />
          <p>
            <button onClick={handleLogOut} type="button">
              ログアウト
            </button>
          </p>
        </>
      )}
    </div>
  )
}

export default MyPage
