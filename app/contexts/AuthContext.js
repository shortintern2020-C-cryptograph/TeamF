import React, { createContext, useState } from 'react'

export const AuthContext = createContext()

const AuthContextProvider = ({ children }) => {
  const [isLoading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [signInModalOpen, setSignInModalOpen] = useState(false)
  const [signInSuccessOpen, setSignInSuccessOpen] = useState(false)
  const [ui, setUi] = useState(null)

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
        setUi
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
