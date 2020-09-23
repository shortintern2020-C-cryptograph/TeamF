import NavBar from '../components/NavBar'
import Fab from './Fab'
import { PageTransition } from './PageTransition'

/**
 * 全体レイアウトのHOC
 * @param {*} children
 */
const Layout = ({ children }) => {
  // <PageTransition>
  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <NavBar />
      <Fab />
      {children}
      {/* 中央に戻るボタン? */}
    </div>
  )
  // </PageTransition>
}

export default Layout
