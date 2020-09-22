import axios from "axios"
import firebase from '../config/firebase'
import { apiConfig } from "../config/api"

const ax = axios.create({
  baseURL: apiConfig.fqdn
});
const endpoints = apiConfig.endpoints;

const resultMapper = (res) => {
  if (res.status == 200) {
    return res.data;
  } else {
    return {};
  }
}

function checkFetchParams(query) {
  if (typeof query != 'object') {
    console.warn("api: 引数が不正です: オブジェクトでないといけません");
    return false;
  }
  const requiredQuerys = ["genre", "offset", "limit"];
  const ok = true;
  requiredQuerys.forEach((q) => {
    if (typeof query[q] === 'undefined') {
      console.warn(`api: 引数が不正です: ${q}が指定されていません`);
      ok = false;
    }
  });
  return ok;
}

async function authHeader() {
  let header = {};
  try {
    const token = await firebase.auth().currentUser.getIdToken(/* forceRefresh */ true);
    header[apiConfig.authHeaderName] = token;
  } catch (e) {
    console.warn("api: authHeader: トークン取得失敗");
  }
  return header;
}

/*
query = {
  genre,
  offset,
  limit,
  [sort],
  [q]
}
*/
export async function getDialog(query) {
  if (!checkFetchParams(query)) {
    return;
  }
  return resultMapper(await ax.get(endpoints.getDialog(), {
    params: query
  }));
}

// セリフ詳細
export async function getDialogDetail(dialogid) {
  return resultMapper(await ax.get(endpoints.getDialogDetail(dialogid)));
}

// コメント
export async function getComment(dialogid, query) {
  if (!checkFetchParams(query)) {
    return;
  }
  return resultMapper(await ax.get(endpoints.getDialogDetail(dialogid), {
    params: query
  }));
}

// セリフ投稿
/*
dialog = {
    "content": "string",
    "title": "string",
    "author": "string",
    "link": "string",
    "style": "string",
    "user_id": 0,
    "comment": "string"
  }
*/
export async function postDialog(dialog) {
  const headers = await authHeader();
  return resultMapper(await ax.post(endpoints.postDialog(), {
    headers,
    data: dialog
  }));
}

// コメント投稿
/*
comment = {
  "comment": "string"
}
*/
export async function postComment(dialogId, comment) {
  const headers = await authHeader();
  return resultMapper(await ax.post(endpoints.postComment(dialogId), {
    headers,
    data: comment
  }));
}