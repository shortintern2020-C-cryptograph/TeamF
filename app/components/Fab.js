import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { MainContext } from '../contexts/MainContext'
import styles from '../styles/Fab.module.scss'

/**
 * アクションボタンのコンポーネント
 * @author Takahiro Nishino
 */
const Fab = () => {
  const { mode, nextMode } = useContext(MainContext)
  console.log(mode)
  const { user, setSignInModalOpen } = useContext(AuthContext)
  const blackStyle = 'linear-gradient(120deg, #222, #555)'
  const redStyle = 'linear-gradient(120deg, #F05353, #E9468A)'
  const isBlackStyle = mode === 'home' || mode === 'detail'

  const handleChangeMode = () => {
    if (!user) {
      setSignInModalOpen(true)
      return
    }
    nextMode(mode)
  }

  return (
    <div className={styles.container} onClick={handleChangeMode}>
      <span
        className={styles.icon}
        style={{
          background: isBlackStyle ? blackStyle : redStyle,
          transform: isBlackStyle ? 'none' : 'rotateZ(-45deg)'
        }}>
        <img src={mode === 'detail' ? '/comment.svg' : '/cross.svg'} alt="cross" />
      </span>
    </div>
  )
}

export default Fab
