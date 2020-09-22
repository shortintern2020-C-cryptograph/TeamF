export const apiConfig = {
  fqdn: 'https://test.scenepicks.tk/api',
  endpoints: {
    getDialog: () => '/dialog',
    getDialogDetail: (id) => `/dialog/${id}`,
    getComment: (id) => `/dialog/${id}/comment`,
    postDialog: () => '/dialog',
    postComment: (id) => `/dialog/${id}/comment`
  },
  endpointsScheme: {
    getDialog: '/dialog',
    getDialogDetail: '/dialog/:id',
    getComment: (id) => '/dialog/:id/comment',
    postDialog: () => '/dialog',
    postComment: (id) => '/dialog/:id/comment'
  },
  authHeaderName: 'token'
  //確認済み
}
