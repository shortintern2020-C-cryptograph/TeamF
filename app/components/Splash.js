import Head from 'next/head'
import styles from '../styles/Splash.module.scss'

const Home = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.text}>loading...</div>
    </div>
  )
}

export default Home
