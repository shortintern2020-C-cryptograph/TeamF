import Head from 'next/head'
import styles from '../styles/Navbar.module.scss'
import { AuthContext } from '../contexts/AuthContext'
import SignIn from './SignIn'
import { useContext } from 'react'

const Navbar = () => {
  const { setSignInModalOpen } = useContext(AuthContext)

  return (
    <div className={styles.container}>
      <div>hello nav bar</div>
      <button onClick={() => setSignInModalOpen(true)}>open</button>
      <SignIn />
    </div>
  )
}

export default Navbar
