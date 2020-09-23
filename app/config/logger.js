import Rollbar from 'rollbar'

const token = process.env.NEXT_PUBLIC_ROLLBAR_TOKEN

const rollbar = new Rollbar({
  accessToken: token,
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment:
    process.env.NEXT_PUBLIC_ENV === 'LOCAL' ? 'dev' : process.env.NEXT_PUBLIC_ENV === 'MOCK' ? 'mock' : 'prod'
})

if (process.env.NODE_ENV === 'development') {
  rollbar.configure({ enabled: false })
}

export { rollbar }
