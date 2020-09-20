import styles from '../styles/Navbar.module.scss'
import { AuthContext } from '../contexts/AuthContext'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import { MainContext } from '../contexts/MainContext'

const Navbar = () => {
  const { user, setSignInModalOpen } = useContext(AuthContext)
  const router = useRouter()
  const { selectedGenre, setSelectedGenre } = useContext(MainContext)

  return (
    <div className={styles.container}>
      <div className={styles.title}>ScenePicks</div>
      <img src="/miniIcon.svg" alt="scenepicks Logo" className={styles.titleIcon} />
      <div style={{ display: 'inline-block' }}>
        <ul className={styles.genreList}>
          <li onClick={() => setSelectedGenre(0)}>全て</li>
          <li onClick={() => setSelectedGenre(1)}>本</li>
          <li onClick={() => setSelectedGenre(2)}>アニメ</li>
          <li onClick={() => setSelectedGenre(3)}>漫画</li>
          <li onClick={() => setSelectedGenre(4)}>YouTube</li>
          <li
            style={{
              position: 'absolute',
              width: '50px',
              height: '30px',
              backgroundColor: 'rgba(255,255,255,0.5)',
              borderRadius: '6px',
              top: '0px',
              left: selectedGenre * 50,
              transition: '0.2s ease'
            }}
          />
        </ul>
      </div>
      {user ? (
        <img
          src={user.providerData[0].photoURL}
          alt="user avatar"
          className={styles.userAvatar}
          onClick={() => router.push('/mypage')}
        />
      ) : (
        <img
          src="/user-avatar.svg"
          alt="user avatar"
          className={styles.userAvatar}
          onClick={() => setSignInModalOpen(true)}
        />
      )}
    </div>
  )
}

export default Navbar
