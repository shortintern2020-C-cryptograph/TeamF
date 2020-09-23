import React, { useEffect, useState } from 'react'
import styles from '../styles/DokodemoInput.module.scss'

const DokodemoInput = (props) => {
  const [value, setValue] = useState('')
  const { top, left, fontSize, width, height, type, multipleLines, submitting, updateInputContent } = props

  const dynamicStyles = {
    top: `${top}px`,
    left: `${left}px`,
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
