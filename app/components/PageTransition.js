import React, { useContext } from 'react'
import { useTransition, animated } from 'react-spring'
import { withRouter } from 'next/router'

const Context = React.createContext()

const Provider = ({ router, children }) => <Context.Provider value={router}>{children}</Context.Provider>

const useRouter = () => useContext(Context)
const RouterContextProvider = withRouter(Provider)

const Transition = ({ children, ...props }) => {
  const router = useRouter()
  const transitions = useTransition(router, (router) => router.pathname, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      opacity: 0
    }
  })

  return (
    <>
      {transitions.map(({ item, props: style, key }) => {
        return (
          <animated.div key={key} style={style}>
            {children}
          </animated.div>
        )
      })}
    </>
  )
}

export const PageTransition = ({ children, ...props }) => {
  return (
    <RouterContextProvider>
      <Transition {...props}>{children}</Transition>
    </RouterContextProvider>
  )
}
