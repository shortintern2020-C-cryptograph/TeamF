import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import Layout from '../components/Layout'
import { createRef, useContext, useEffect, useState } from 'react'
import { MainContext } from '../contexts/MainContext'
import { PageTransition } from '../components/PageTransition'
import { useRouter } from 'next/router'
import SPCanvas from '../components/SPCanvas'
import DokodemoInput from '../components/DokodemoInput'

/**
 * ホーム画面のコンポーネント
 * @author Takahiro Nishino
 */
const Home = () => {
  const { selectedGenre, fabMode, setFabMode } = useContext(MainContext)
  const [inputOpen, setInputOpen] = useState(false)
  const [inputContents, setInputContents] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  /**
   *
   * @type {Array.<{multipleLines: boolean, top: number, left: number, fontSize: number, width: number, height: number, type: string}>} inputVars
   */
  const initialValue = [
    { multipleLines: true, top: 0, left: 10, fontSize: 14, width: 100, height: 190, type: 'ccc' },
    { multipleLines: true, top: 30, left: 177, fontSize: 14, width: 310, height: 230, type: 'aaa' }
  ]
  const [inputVars, setInputVars] = useState(initialValue)

  /**
   * @type {top: number, left: number}
   */
  const initialSubmitButtonPlace = { top: 100, left: 100 }
  const [submitButtonPlace, setSubmitButtonPlace] = useState(initialSubmitButtonPlace)

  useEffect(() => {
    const mode = router.asPath === '/' ? 'home' : 'detail'
    setFabMode(mode)
    console.log(router.asPath)
  }, [])

  useEffect(() => {
    if (fabMode === 'home') {
      // もどる
      setInputOpen(false)
    } else if (fabMode === 'new') {
      // 新規投稿start
      setInputOpen(true)
    }
  }, [fabMode])

  const submitPost = () => {
    console.log('submit!')
    // 情報を集める
    // submit here
    setSubmitting(true)
    console.log('about to post')
    console.log(inputContents)
    setInputContents({})
    setInputOpen(false)
    setFabMode('home')
    setSubmitting(false)
  }

  const updateInputContent = (type, text) => {
    let old = { ...inputContents }
    old[type] = text
    setInputContents(old)
  }

  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Home | ScenePicks</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <SPCanvas setInputVars={setInputVars} selectedGenre={selectedGenre} />
        {inputOpen && (
          <PageTransition>
            <div>
              {inputVars.length
                ? inputVars.map((inputVar, i) => {
                    return (
                      <DokodemoInput
                        key={i}
                        {...inputVar}
                        updateInputContent={updateInputContent}
                        submitting={submitting}
                      />
                    )
                  })
                : null}
              <button
                className={styles.submitButton}
                onClick={submitPost}
                type="button"
                style={{ top: `${submitButtonPlace.top}px`, left: `${submitButtonPlace.left}px` }}>
                送信
              </button>
            </div>
          </PageTransition>
        )}
      </div>
    </Layout>
  )
}

export default Home
