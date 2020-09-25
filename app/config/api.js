// console.log(process.env.NEXT_PUBLIC_ENDPOINT_URL)

/**
 * APIラッパー, APIモックに関する定義
 * @author Ritsuki KOKUBO
 */
export const apiConfig = {
  fqdn: process.env.NEXT_PUBLIC_ENDPOINT_URL + '/api',
  endpoints: {
    getDialog: () => '/dialog',
    getDialogDetail: (id) => `/dialog/${id}`,
    postDialog: () => '/dialog',
    postComment: (id) => `/dialog/${id}/comment`
  },
  endpointsScheme: {
    getDialog: '/dialog',
    getDialogDetail: '/dialog/:id',
    postDialog: '/dialog',
    postComment: '/dialog/:id/comment'
  },
  authHeaderName: 'token'
  //確認済み
}
