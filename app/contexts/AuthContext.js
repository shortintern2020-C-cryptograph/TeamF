import React, { createContext, useState } from 'react'
import firebase from '../config/firebase'
import 'firebase/auth'

export const AuthContext = createContext()

/**
 * global state management
 * @param {*} children
 * @author Takahiro Nishino
 */
const AuthContextProvider = ({ children }) => {
  const [isLoading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [signInModalOpen, setSignInModalOpen] = useState(false)
  const [signInSuccessOpen, setSignInSuccessOpen] = useState(false)
  const [ui, setUi] = useState(null)

  const storageAvailable = (type) => {
    try {
      var storage = window[type],
        x = '__storage_test__'
      storage.setItem(x, x)
      storage.removeItem(x)
      return true
    } catch (e) {
      return (
        e instanceof DOMException &&
        (e.code === 22 ||
          e.code === 1014 ||
          e.name === 'QuotaExceededError' ||
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        storage.length !== 0
      )
    }
  }

  const getIdToken = async () => {
    if (!user) {
      return new Promise((resolve, reject) => {
        reject('no user')
      })
    }
    const token = await firebase
      .auth()
      .currentUser.getIdToken(/* forceRefresh */ true)
      .then((idToken) => {
        return idToken
      })
      .catch((error) => {
        // Handle error
        console.error(error)
        return null
      })
    return token
  }

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        setLoading,
        user,
        setUser,
        signInModalOpen,
        setSignInModalOpen,
        signInSuccessOpen,
        setSignInSuccessOpen,
        ui,
        setUi,
        storageAvailable,
        getIdToken
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
