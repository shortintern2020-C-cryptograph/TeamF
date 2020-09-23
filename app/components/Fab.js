import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { MainContext } from '../contexts/MainContext'
import styles from '../styles/Fab.module.scss'
import { PageTransition } from './PageTransition'

/**
 * アクションボタンのコンポーネント
 * @author Takahiro Nishino
 */
const Fab = () => {
  const { mode, nextMode, setMode, setInputOpen } = useContext(MainContext)
  const { user, setSignInModalOpen } = useContext(AuthContext)
  const blackStyle = 'linear-gradient(120deg, #222, #555)'
  const redStyle = 'linear-gradient(120deg, #F05353, #E9468A)'
  const isBlackStyle = mode === 'home' || mode === 'detail'

  console.log(mode)
  const handleChangeMode = () => {
    if (!user) {
      setSignInModalOpen(true)
      return
    }
    switch (mode) {
      case 'home':
        setMode('new')
        break
      case 'detail':
        setInputOpen(true)
        setMode('comment')
        break
      case 'comment':
        setInputOpen(false)
        setMode('detail')
        break

      default:
        break
    }
    // nextMode(mode)
  }

  return (
    <PageTransition>
      <div className={styles.container} onClick={() => handleChangeMode()}>
        {(mode === 'detail' || mode === 'comment') && (
          <span
            className={styles.icon}
            style={{
              background: isBlackStyle ? blackStyle : redStyle,
              transform: isBlackStyle ? 'none' : 'rotateZ(-45deg)'
            }}>
            <img src={mode === 'detail' ? '/comment.svg' : '/cross.svg'} alt="cross" />
          </span>
        )}
      </div>
    </PageTransition>
  )
}

export default Fab
