console.log(process.env.NEXT_PUBLIC_ENDPOINT_URL)

export const apiConfig = {
  fqdn: process.env.NEXT_PUBLIC_ENDPOINT_URL + '/api',
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
}
