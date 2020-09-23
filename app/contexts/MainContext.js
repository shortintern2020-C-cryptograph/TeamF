import React, { createContext, useState } from 'react'

export const MainContext = createContext()

/**
 * global state management
 * @param {*} children
 * @author Takahiro Nishino
 */
const MainContextProvider = ({ children }) => {
  const [selectedGenre, setSelectedGenre] = useState(0)
  // one of 'home', 'new', 'comment', 'detail'
  const [mode, setMode] = useState('home')
  const [shouldUpdate, setShouldUpdate] = useState(false)
  const [dialogID, setDialogID] = useState(null)
  const [dialog, setDialog] = useState(null)
  const [cameBack, setCameBack] = useState(false)

  const nextMode = (current) => {
    switch (current) {
      case 'home':
        setMode('new')
        break
      case 'new':
        setCameBack(true)
        setMode('home')
        break
      case 'comment':
        setMode('detail')
        break
      case 'detail':
        setMode('comment')
        break
    }
  }

  const prevMode = (current) => {
    switch (current) {
      case 'home':
        setMode('home')
        break
      case 'new':
        setMode('home')
        break
      case 'comment':
        setMode('detail')
        break
      case 'detail':
        setMode('home')
        break
    }
  }

  return (
    <MainContext.Provider
      value={{
        selectedGenre,
        setSelectedGenre,
        mode,
        setMode,
        nextMode,
        shouldUpdate,
        setShouldUpdate,
        prevMode,
        dialogID,
        setDialogID,
        dialog,
        setDialog,
        cameBack,
        setCameBack
      }}>
      {children}
    </MainContext.Provider>
  )
}

export default MainContextProvider
