import styles from '../styles/Navbar.module.scss'
import { AuthContext } from '../contexts/AuthContext'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import { MainContext } from '../contexts/MainContext'

const lefts = [11, 60, 100, 167, 235]
const widths = [50, 40, 65, 65, 82]

const Navbar = () => {
  const { user, setSignInModalOpen } = useContext(AuthContext)
  const router = useRouter()
  const { selectedGenre, setSelectedGenre } = useContext(MainContext)

  return (
    <div className={styles.container}>
      <div className={styles.title} onClick={() => router.push('/')}>
        ScenePicks
      </div>
      {router.pathname === '/' && (
        <div style={{ display: 'inline-block' }}>
          <ul className={styles.genreList}>
            {['全て', '本', 'マンガ', 'アニメ', 'YouTube'].map((item, index) => {
              const active = selectedGenre === index
              return (
                <li
                  key={index}
                  onClick={() => setSelectedGenre(index)}
                  style={{ color: active ? '#FFF' : '#222', fontWeight: active ? '600' : 'inherit' }}>
                  {item}
                </li>
              )
            })}

            <li
              style={{
                position: 'absolute',
                width: `${widths[selectedGenre]}px`,
                height: '36px',
                background: 'linear-gradient(120deg, #46e9c2, #5653f0)',
                borderRadius: '6px',
                top: '8px',
                left: `${lefts[selectedGenre]}px`,
                zIndex: -1,
                transition: '0.25s ease'
              }}
            />
          </ul>
        </div>
      )}
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
//確認なう
export default Navbar
