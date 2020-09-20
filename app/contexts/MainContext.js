import React, { createContext, useState } from 'react'

export const MainContext = createContext()

const MainContextProvider = ({ children }) => {
  const [selectedGenre, setSelectedGenre] = useState(0)
  // one of 'home', 'new', 'comment', 'detail'
  const [fabMode, setFabMode] = useState('home')
  const nextFabMode = (current) => {
    switch (current) {
      case 'home':
        setFabMode('new')
        break
      case 'new':
        setFabMode('home')
        break
      case 'comment':
        setFabMode('detail')
        break
      case 'detail':
        setFabMode('comment')
        break
    }
  }

  return (
    <MainContext.Provider
      value={{
        selectedGenre,
        setSelectedGenre,
        fabMode,
        setFabMode,
        nextFabMode
      }}>
      {children}
    </MainContext.Provider>
  )
}

export default MainContextProvider
