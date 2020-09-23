import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import Layout from '../components/Layout'
import { createRef, useContext, useEffect, useState } from 'react'
import { MainContext } from '../contexts/MainContext'
import { PageTransition } from '../components/PageTransition'
import { useRouter } from 'next/router'
import SPCanvas from '../components/SPCanvas'
import DokodemoInput from '../components/DokodemoInput'
import { TwitterShareButton } from 'react-share'

/**
 * ホーム画面のコンポーネント
 * @author Takahiro Nishino
 */
const Home = () => {
  const {
    selectedGenre,
    mode,
    setMode,
    shouldUpdate,
    setShouldUpdate,
    dialogID,
    setDialogID,
    dialog,
    setDialog
  } = useContext(MainContext)
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
  // const initialSubmitButtonPlace = { top: 100, left: 100 }
  // const [submitButtonPlace, setSubmitButtonPlace] = useState(initialSubmitButtonPlace)
  useEffect(() => {
    console.log(router, location)
    const mode = router.asPath === '/' || router.asPath === '/#' ? 'home' : 'detail'
    setMode(mode)
  }, [])

  useEffect(() => {
    if (mode === 'home') {
      // もどる
      setInputOpen(false)
    } else if (mode === 'new') {
      // 新規投稿start
      setInputOpen(true)
    }
  }, [mode])

  const submitPost = () => {
    console.log('submit!')
    // 情報を集める
    // submit here
    setSubmitting(true)
    console.log('about to post')
    console.log(inputContents)
    setInputContents({})
    setInputOpen(false)
    setMode('home')
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
        <SPCanvas
          setInputVars={setInputVars}
          selectedGenre={selectedGenre}
          shouldUpdate={shouldUpdate}
          setShouldUpdate={setShouldUpdate}
          router={router}
          dialogID={dialogID}
          setDialogID={setDialogID}
          mode={mode}
          dialog={dialog}
          setDialog={setDialog}
        />
        {/* <PageTransition> */}
        {inputOpen && (
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
              // style={{ top: `${submitButtonPlace.top}px`, left: `${submitButtonPlace.left}px` }}>
              style={{ top: `80%`, left: `50%` }}>
              送信
            </button>
          </div>
        )}
        {/* </PageTransition> */}
      </div>
      {mode === 'detail' && (
        <TwitterShareButton
          url={`${process.env.NEXT_PUBLIC_ENDPOINT_URL}/api${router.asPath}`} // TODO: 自分自身
          className={styles.shareContainer}
          title="scenepicksでセリフをシェア！    " // TODO: dialog の本文など
          hashtags={['scenepicks']} // 考える
        >
          <img src="/twitter.svg" alt="twitter icon" className={styles.twitterIcon} />
        </TwitterShareButton>
      )}
    </Layout>
  )
}

export default Home
