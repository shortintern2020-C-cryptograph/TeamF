import React, { createContext, useState } from 'react'

export const AuthContext = createContext()

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
        storageAvailable
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
