import React, { useEffect } from 'react'

const genres = ['all', 'book', 'manga', 'anime', 'all']

const Observer = (props) => {
  const { value, didUpdate, cb, changeView, shouldUpdate, setShouldUpdate, self, selectedGenre, mode } = props

  useEffect(() => {
    // didUpdate(value)
    // if (selectedGenre !== 0) {
    console.log(selectedGenre + 'のジャンルが選択されました')
    cb()
    location.hash = ''
    changeView.bind(self)('listDialog', undefined, genres[selectedGenre])
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
    //
    if (mode === 'new') {
      changeView.bind(self)(mode)
      console.log('新しい投稿するよ')
    }
  }, [mode])

  return null // component does not render anything
}

export default Observer
