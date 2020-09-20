import React, { createContext, useState } from 'react'

export const MainContext = createContext()

const MainContextProvider = ({ children }) => {
  const [selectedGenre, setSelectedGenre] = useState(0)

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
