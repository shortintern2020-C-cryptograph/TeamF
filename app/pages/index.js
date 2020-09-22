import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import Layout from '../components/Layout'
import { createRef, useContext, useEffect, useState } from 'react'
import { MainContext } from '../contexts/MainContext'
import { PageTransition } from '../components/PageTransition'

const Home = () => {
  const { selectedGenre, fabMode, setFabMode } = useContext(MainContext)
  const [inputOpen, setInputOpen] = useState(false)
  const [inputPlace, setInputPlace] = useState({ top: 0, left: 0 })
  const [inputStyle, setInputStyle] = useState({ fontSize: 21, width: 300, height: 200 })
  const newPostInput = createRef()

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

  useEffect(() => {
    if (newPostInput && newPostInput.current) {
      console.log(inputPlace)
      newPostInput.current.style.top = `${inputPlace.top}px`
      newPostInput.current.style.left = `${inputPlace.left}px`
      newPostInput.current.style.width = `${inputStyle.width}px`
      newPostInput.current.style.height = `${inputStyle.height}px`
      newPostInput.current.style.fontSize = `${inputStyle.fontSize}px`
    }
  }, [inputPlace, inputOpen])

  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Home | ScenePicks</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {/* ここにcanvas */}
        {inputOpen && (
          <PageTransition>
            <textarea
              name="newpost"
              cols="40"
              rows="5"
              ref={newPostInput}
              className={styles.newPostInput}
              placeholder="作品名"
            />
          </PageTransition>
        )}
      </div>
    </Layout>
  )
}

export default Home
