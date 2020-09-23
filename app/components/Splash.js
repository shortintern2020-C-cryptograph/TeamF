import Head from 'next/head'
import styles from '../styles/Splash.module.scss'

/**
 * loading画面
 * @author Takahiro Nishino
 */
const Splash = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>loading | ScenePicks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.text}>loading...</div>
    </div>
  )
}

export default Splash
