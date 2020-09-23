import React, { useEffect } from 'react'

export const Observer = ({ value, didUpdate, cb }) => {
  useEffect(() => {
    // didUpdate(value)
    console.log(value + 'のジャンルが選択されました')
    cb()
  }, [value])
  return null // component does not render anything
}
