import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import Layout from '../components/Layout'
import { useContext, useEffect } from 'react'
import { MainContext } from '../contexts/MainContext'

import SPCanvas from '../components/SPCanvas'

const Home = () => {
  const { selectedGenre, fabMode, setFabMode } = useContext(MainContext)

  useEffect(() => {
    setFabMode('home')
  }, [])

  useEffect(() => {
    console.log(selectedGenre + 'のジャンルが選択されました')
    // そのジャンルをfetchして
    // 色々更新する
  }, [selectedGenre])

  useEffect(() => {
    if (fabMode === 'home') {
      // もどる
    } else if (fabMode === 'new') {
      // 新規投稿start
    }
  }, [fabMode])

  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <SPCanvas></SPCanvas>
      </div>
    </Layout>
  )
}

export default Home
