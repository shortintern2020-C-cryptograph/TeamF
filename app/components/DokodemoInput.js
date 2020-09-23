import React, { useEffect, useState } from 'react'
import styles from '../styles/DokodemoInput.module.scss'

/**
 *
 * @param {*} props
 */
const DokodemoInput = (props) => {
  const [value, setValue] = useState('')
  const { bottom, left, fontSize, width, height, type, multipleLines, submitting, updateInputContent } = props

  const dynamicStyles = {
    bottom: `${bottom}px`,
    left: left,
    fontSize: `${fontSize}px`,
    width: `${width}px`,
    height: `${height}px`
  }

  let placeholder
  switch (type) {
    case 'content':
      placeholder = 'セリフ'
      break
    case 'title':
      placeholder = '作品名'
      break
    case 'author':
      placeholder = '作者'
      break
    case 'content':
      placeholder = '発話者'
      break
    default:
      break
  }

  if (multipleLines) {
    return (
      <textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          updateInputContent(type, value)
        }}
        style={dynamicStyles}
        className={styles.container}
        placeholder={placeholder}
      />
    )
  }

  return (
    <input
      value={value}
      onChange={(e) => {
        setValue(e.target.value)
        updateInputContent(type, value)
      }}
      style={dynamicStyles}
      className={styles.container}
      placeholder={placeholder}
    />
  )
}

export default DokodemoInput
