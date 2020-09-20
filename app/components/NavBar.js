import styles from '../styles/Navbar.module.scss'
import { AuthContext } from '../contexts/AuthContext'
import { useContext } from 'react'
import { useRouter } from 'next/router'

const Navbar = () => {
  const { user, setSignInModalOpen } = useContext(AuthContext)
  const router = useRouter()
  const handleOpen = () => {
    if (user) {
      router.push('/mypage')
    } else {
      setSignInModalOpen(true)
    }
  }
  return (
    <div className={styles.container}>
      <div>hello nav bar</div>
      <button onClick={handleOpen} type="button">
        open
      </button>
    </div>
  )
}

export default Navbar
