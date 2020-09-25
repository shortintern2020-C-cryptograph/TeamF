import { useRouter } from 'next/router'
import { useContext, useEffect, useLayoutEffect } from 'react'
import { MainContext } from '../../contexts/MainContext'

/**
 * Dialog detail page
 * @deprecated
 * @author Takahiro Nishino
 */
const Dialog = () => {
  const router = useRouter()
  const { dialogID } = router.query
  const { mode, setMode } = useContext(MainContext)

  useEffect(() => {
    // setMode('detail')
    // console.log(dialogID)
    router.push('/', `/dialog/${dialogID}`, { shallow: true })
  }, [])

  useEffect(() => {
    if (mode === 'detail') {
      // もどる
    } else if (mode === 'comment') {
      // 新規コメントstart
    }
  }, [mode])

  useLayoutEffect(() => {
    // console.log(dialogID)
    // 簡単なバリデーションができると良いかも
  }, [])
  return null
}

export default Dialog
