import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import Layout from '../components/Layout'
import { createRef, useContext, useEffect, useState } from 'react'
import { MainContext } from '../contexts/MainContext'
import { PageTransition } from '../components/PageTransition'

import SPCanvas from '../components/SPCanvas'
import DokodemoInput from '../components/DokodemoInput'

/**
 * ホーム画面のコンポーネント
 * @author Takahiro Nishino
 */
const Home = () => {
  const { selectedGenre, fabMode, setFabMode } = useContext(MainContext)
  const [inputOpen, setInputOpen] = useState(false)

  /**
   *
   * @type {Array.<{multipleLines: boolean,top:number, left:number, fontSize:number, width:number, height:number, placeholder:string}>} inputVars
   */
  const initialValue = [
    { multipleLines: true, top: 0, left: 10, fontSize: 14, width: 100, height: 190, placeholder: 'ccc' },
    { multipleLines: true, top: 30, left: 177, fontSize: 14, width: 310, height: 230, placeholder: 'aaa' }
  ]
  const [inputVars, setInputVars] = useState(initialValue)

  useEffect(() => {
    setFabMode('home')
    // setInputPlace({ top: Math.random() * 200, left: Math.random() * 200 })
  }, [])

  useEffect(() => {
    console.log(selectedGenre + 'のジャンルが選択されました')
    // そのジャンルをfetchして
    // 色々更新する
  }, [selectedGenre])

  useEffect(() => {
    if (fabMode === 'home') {
      // もどる
      setInputOpen(false)
    } else if (fabMode === 'new') {
      // 新規投稿start
      setInputOpen(true)
    }
  }, [fabMode])

  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Home | ScenePicks</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <SPCanvas setInputVars={setInputVars} />
        {inputOpen && (
          <PageTransition>
            <div>
              {inputVars.length
                ? inputVars.map((inputVar, i) => {
                    return <DokodemoInput key={i} {...inputVar} />
                  })
                : null}
              {/* <textarea
              name="newpost"
              cols="40"
              rows="5"
              ref={newPostInput}
              className={styles.newPostInput}
              placeholder="作品名"
            /> */}
            </div>
          </PageTransition>
        )}
      </div>
    </Layout>
  )
}

export default Home
