import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import Layout from '../components/Layout'

const Home = () => {
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
