import React, { createContext, useState } from 'react'

export const MainContext = createContext()

const MainContextProvider = ({ children }) => {
  const [selectedGenre, setSelectedGenre] = useState(true)

  return (
    <MainContext.Provider
      value={{
        selectedGenre,
        setSelectedGenre
      }}>
      {children}
    </MainContext.Provider>
  )
}

export default MainContextProvider
