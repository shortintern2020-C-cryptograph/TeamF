import NavBar from '../components/NavBar'
import Fab from './Fab'

/**
 * 全体レイアウトのHOC
 * @param {*} children
 */
const Layout = ({ children }) => {
  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <NavBar />
      <Fab />
      {children}
      {/* 中央に戻るボタン? */}
    </div>
  )
}

export default Layout
