import React, { useEffect } from 'react'

const genres = ['all', 'book', 'manga', 'anime', 'youtube']

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
    setCameBack,
    mounted,
    setMounted,
    postedCommet,
    renderPostedComment
  } = props

  useEffect(() => {
    // didUpdate(value)
    // if (selectedGenre !== 0) {
    changeView.bind(self)('listDialog', undefined, undefined, genres[selectedGenre])
    if (!mounted) {
      setMounted(true)
      return
    }
    // console.log(selectedGenre + 'のジャンルが選択されました')
    // cb()
    console.log(window.history)
    location.hash = ''
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

  // 投稿したコメント表示するくん
  useEffect(() => {
    if (renderPostedComment && typeof renderPostedComment == 'function') {
      renderPostedComment.bind(self)(postedCommet)
    }
  }, [postedCommet, renderPostedComment])

  return null // component does not render anything
}

export default Observer
