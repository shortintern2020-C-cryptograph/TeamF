import NavBar from '../components/NavBar'
import Fab from './Fab'
import { PageTransition } from './PageTransition'

/**
 * 全体レイアウトのHOC
 * @author Takahiro Nishino
 * @param {*} children
 */
const Layout = ({ children }) => {
  return (
    <PageTransition>
      <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
        <NavBar />
        <Fab />
        {children}
        {/* 中央に戻るボタン? */}
      </div>
    </PageTransition>
  )
}

export default Layout
