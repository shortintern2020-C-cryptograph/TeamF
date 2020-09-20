import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import Layout from '../components/Layout'
import { useContext, useEffect } from 'react'
import { MainContext } from '../contexts/MainContext'

const Home = () => {
  const { selectedGenre } = useContext(MainContext)
  useEffect(() => {
    console.log(selectedGenre + 'のジャンルが選択されました')
    // そのジャンルをfetchして
    // 色々更新する
  }, [selectedGenre])
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {/* ここにcanvas */}
      </div>
    </Layout>
  )
}

export default Home
