import styles from '../styles/Navbar.module.scss'
import { AuthContext } from '../contexts/AuthContext'
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { MainContext } from '../contexts/MainContext'

const lefts = [11, 60, 100, 167, 235]
const widths = [50, 40, 65, 65, 82]

/**
 * ナビゲーションバーのコンポーネント
 * @author Takahiro Nishino
 */
const Navbar = () => {
  const { user, setSignInModalOpen } = useContext(AuthContext)
  const router = useRouter()
  const { selectedGenre, setSelectedGenre, setMode, setShouldUpdate, dialogID } = useContext(MainContext)

  return (
    <div className={styles.container}>
      <div
        className={styles.title}
        onClick={() => {
          router.push('/', undefined, { shallow: true })
          setShouldUpdate(true)
          setMode('home')
        }}>
        ScenePicks
      </div>
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
              width: `${widths[selectedGenre]}px`,
              left: `${lefts[selectedGenre]}px`
            }}
            className={styles.menuList}
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
//確認なう
export default Navbar
