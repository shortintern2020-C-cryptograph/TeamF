import { useRouter } from 'next/router'
import { useContext, useEffect, useLayoutEffect } from 'react'
import { MainContext } from '../../contexts/MainContext'

const Dialog = () => {
  const router = useRouter()
  const { dialogID } = router.query
  const { fabMode, setFabMode } = useContext(MainContext)

  useEffect(() => {
    setFabMode('detail')
    console.log(dialogID)
    router.push('/', `/dialog/${dialogID}`, { shallow: true })
  }, [])

  useEffect(() => {
    if (fabMode === 'detail') {
      // もどる
    } else if (fabMode === 'comment') {
      // 新規コメントstart
    }
  }, [fabMode])

  useLayoutEffect(() => {
    console.log(dialogID)
    // 簡単なバリデーションができると良いかも
  }, [])
  return null
}

export default Dialog
