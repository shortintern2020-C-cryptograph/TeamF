import NavBar from '../components/NavBar'
import Fab from './Fab'
import { useRouter } from 'next/router'

const Layout = ({ children }) => {
  const router = useRouter()
  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      {router.pathname !== '/mypage' && (
        <>
          <NavBar />
          <Fab />
        </>
      )}
      {children}
      {/* 中央に戻るボタン? */}
    </div>
  )
}

export default Layout
