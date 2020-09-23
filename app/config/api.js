export const apiConfig = {
  fqdn: 'https://test.scenepicks.tk/api',
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
}
