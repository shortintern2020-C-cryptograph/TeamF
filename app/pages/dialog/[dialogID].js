import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext, useEffect, useLayoutEffect } from 'react'
import Layout from '../../components/Layout'
import { MainContext } from '../../contexts/MainContext'

const Dialog = () => {
  const router = useRouter()
  const { dialogID } = router.query
  const { fabMode, setFabMode } = useContext(MainContext)

  useEffect(() => {
    setFabMode('detail')
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

  return (
    <Layout>
      <Head>
        <title>セリフ | ScenePicks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* ここにcanvas */}
    </Layout>
  )
}

export default Dialog
