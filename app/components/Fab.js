import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { MainContext } from '../contexts/MainContext'
import styles from '../styles/Fab.module.scss'

const Fab = () => {
  const { fabMode, nextFabMode } = useContext(MainContext)
  const { user, setSignInModalOpen } = useContext(AuthContext)
  const blackStyle = 'linear-gradient(120deg, #222, #555)'
  const redStyle = 'linear-gradient(120deg, #F05353, #E9468A)'
  const isBlackStyle = fabMode === 'home' || fabMode === 'detail'

  const handleChangeMode = () => {
    if (!user) {
      setSignInModalOpen(true)
      return
    }
    nextFabMode(fabMode)
  }

  return (
    <div className={styles.container} onClick={handleChangeMode}>
      <span
        className={styles.icon}
        style={{
          background: isBlackStyle ? blackStyle : redStyle,
          transform: isBlackStyle ? 'none' : 'rotateZ(-45deg)'
        }}>
        <img src={fabMode === 'detail' ? '/comment.svg' : '/cross.svg'} alt="cross" />
      </span>
    </div>
  )
}

export default Fab
