import React, { useEffect } from 'react'

const genres = ['all', 'book', 'manga', 'anime', 'all']

const Observer = (props) => {
  const {
    value,
    didUpdate,
    cb,
    changeView,
    shouldUpdate,
    setShouldUpdate,
    self,
    selectedGenre,
    mode,
    setSelectedGenre,
    cameBack,
    setCameBack
  } = props

  useEffect(() => {
    // didUpdate(value)
    // if (selectedGenre !== 0) {
    console.log(selectedGenre + 'のジャンルが選択されました')
    cb()
    location.hash = ''
    changeView.bind(self)('listDialog', undefined, undefined, genres[selectedGenre])
    // }
  }, [selectedGenre])

  // home画面, allに戻すくん
  useEffect(() => {
    if (shouldUpdate) {
      // console.log('updating...')
      location.hash = ''
      changeView.bind(self)('listDialog')
    }
    setShouldUpdate(false)
  }, [shouldUpdate])

  // 投稿画面に遷移させるくん
  useEffect(() => {
    if (mode === 'new') {
      changeView.bind(self)(mode)
      console.log('新しい投稿するよ')
    }
    if (cameBack && mode === 'home') {
      setCameBack(false)
      changeView.bind(self)(mode)
    }
  }, [mode, cameBack])

  return null // component does not render anything
}

export default Observer
