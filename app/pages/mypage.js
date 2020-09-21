import Head from 'next/head'
import styles from '../styles/MyPage.module.scss'
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
      <div className={styles.content}>
        <div>
          <h2 className={styles.titleHeader} onClick={() => router.push('/')}>
            ScenePicks
          </h2>
        </div>
        {user && (
          <div style={{ position: 'relative', margin: '30px 0' }}>
            <div className={styles.profileName}>{user?.providerData[0].displayName}</div>
            <img src={user?.providerData[0].photoURL} alt="my profile thumbnail" className={styles.profileImage} />
            <p style={{ textAlign: 'center', marginTop: '50px' }}>
              <button onClick={handleLogOut} className={styles.logoutButton} type="button">
                ログアウト
              </button>
            </p>
          </div>
        )}
      </div>
      <div>
        <h3>ScenePicksについて</h3>
        <p>新しい点に立てて、別の切り口から見れるようにする。今までと違う視点から作品を広めたり、</p>
        <p>探せたりすることが面白いという大切なことを多くの人に知って欲しいという思いで開発しました</p>
        <p>Make it a new point so that you can see it from another cut. </p>
        <p>It was developed with the desire that many people know that it is interesting to be able to spread and find works from a different point of view.</p>
      </div>
    </div>
  )
}

export default MyPage
