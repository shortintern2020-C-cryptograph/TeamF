import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta
            property="og:image"
            content="https://firebasestorage.googleapis.com/v0/b/rakuten-ec1cd.appspot.com/o/scenepicks-ogp-min.png?alt=media&token=dfa9d27e-95ea-4eb0-adfc-e9ab1a7fe7ed"
          />
          <meta property="og:title" content="ScenePicks" />
          <meta
            name="description"
            content='セリフでつながる・セリフでみつかる   セリフの共有サービス "ScenePicks" でお気に入りのセリフを見つけよう！  アニメ・マンガ・本・YouTube のジャンルから選んで検索！コメント投稿やいいね機能で気持ちを共有しよう！'
          />
          <meta
            property="og:description"
            content='セリフでつながる・セリフでみつかる   セリフの共有サービス "ScenePicks" でお気に入りのセリフを見つけよう！  アニメ・マンガ・本・YouTube のジャンルから選んで検索！コメント投稿やいいね機能で気持ちを共有しよう！'
          />
          <meta property="og:url" content="https://app.scenepicks.tk/" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="ScenePicks | セリフでつながる・セリフでみつかる" />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
