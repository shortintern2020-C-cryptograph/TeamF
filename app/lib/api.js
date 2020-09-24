import axios from 'axios'
import firebase from '../config/firebase'
import { apiConfig } from '../config/api'
import { useToasts } from 'react-toast-notifications'
import { rollbar } from '../config/logger'

/**
 * AxiosをラップしてAPIを叩きやすくする関数群を提供します。
 * @module api
 * @author Ritsuki KOKUBO
 * @see {@link https://github.com/axios/axios}
 */

/**
 * @typedef {Object} FetchQuery
 * @property {string} genre - ジャンル
 * @property {number} offset - ページングオフセット
 * @property {number} limit - 最大レコード数
 * @property {string} [sort] - ソート
 * @property {string} [q] - 検索クエリ
 */

/**
 * @typedef {Object} Dialog
 * @property {string} content - セリフ
 * @property {string} title - 作品名
 * @property {string} author - 著者
 * @property {string} link - 商品リンク
 * @property {string} style - セリフの表示スタイル
 */

/**
 * @typedef {Object} Comment
 * @property {string} comment - コメント
 */

// axiosインスタンス
const ax = axios.create({
  baseURL: apiConfig.fqdn
})

// エンドポイント定義
const endpoints = apiConfig.endpoints

/**
 * Axiosのレスポンスオブジェクトからデータを取り出します
 * @param {AxiosResponse} res - Axiosのレスポンスオブジェクト
 * @returns {Object}
 */
const resultMapper = (res) => {
  if (res.status == 200) {
    return res.data
  } else {
    return {}
  }
}

/**
 * ページングに関するパラメータが入っているかを確認します
 * @param {FetchQuery} query - ページングに関するパラメータが入ったオブジェクト
 * @returns {boolean} - 必須パラメータが入っているか
 */
function checkFetchParams(query) {
  if (typeof query != 'object') {
    console.warn('api: 引数が不正です: オブジェクトでないといけません')
    return false
  }
  const requiredQuerys = ['genre', 'offset', 'limit']
  const ok = true
  requiredQuerys.forEach((q) => {
    if (typeof query[q] === 'undefined') {
      console.warn(`api: 引数が不正です: ${q}が指定されていません`)
      ok = false
    }
  })
  return ok
}

/**
 * Firebase Authのトークンをカスタムヘッダーに挿入するオブジェクトを生成します
 * @async
 * @returns {Object}
 */
async function authHeader() {
  let headers = {}
  try {
    const token = await firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
    headers[apiConfig.authHeaderName] = token
  } catch (e) {
    console.warn('api: authHeader: トークン取得失敗')
  }
  return headers
}

/**
 * セリフ取得のAPIを叩きます
 * @async
 * @param {FetchQuery} query - ページングに関するパラメータ
 */
export async function getDialog(query) {
  if (!checkFetchParams(query)) {
    return
  }
  try {
    return resultMapper(
      await ax.get(endpoints.getDialog(), {
        params: query
      })
    )
  } catch (error) {
    rollbar.error('error at getDialog: ' + JSON.stringify(error))
  }
}

/**
 * セリフ詳細取得のAPIを叩きます
 * @async
 * @param {number} dialogId - セリフのID
 */
export async function getDialogDetail(dialogId, query) {
  try {
    return resultMapper(
      await ax.get(endpoints.getDialogDetail(dialogId), {
        params: query
      })
    )
  } catch (error) {
    rollbar.error('error at getDialogDetail: ' + JSON.stringify(error))
  }
}

/**
 * セリフ投稿のAPIを叩きます
 * @async
 * @param {Dialog} dialog -　投稿するセリフ
 */
export async function postDialog(dialog) {
  const headers = await authHeader()
  return resultMapper(
    await ax.post(endpoints.postDialog(), {
      headers,
      data: dialog
    })
  )
}

/**
 * コメント投稿のAPIを叩きます
 * @async
 * @param {number} dialogId - セリフを投稿するセリフのID
 * @param {Comment} comment - 投稿するコメント
 */
export async function postComment(dialogId, comment) {
  const headers = await authHeader()
  // console.log(headers)
  try {
    return resultMapper(
      await ax.post(
        endpoints.postComment(dialogId),
        {
          comment: comment
        },
        { headers: headers }
      )
    )
  } catch (error) {
    console.error(error)
  }
}
