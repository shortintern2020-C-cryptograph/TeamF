import React, { useEffect, useState } from 'react'
import styles from '../styles/DokodemoInput.module.scss'

/**
 *
 * @param {*} props
 */
const DokodemoInput = (props) => {
  const {
    top,
    left,
    fontSize,
    width,
    height,
    type,
    multipleLines,
    submitting,
    updateInputContent,
    comment,
    setComment,
    t
  } = props

  const dynamicStyles = {
    top: `${top}px`,
    left: left,
    fontSize: `${fontSize}px`,
    width: `${width}px`,
    height: `${height}px`
  }

  let placeholder
  switch (type) {
    case 'dialog':
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
        value={comment}
        onChange={(e) => {
          setComment(e.target.value)
          // updateInputContent(type, value)
        }}
        style={dynamicStyles}
        className={styles.container}
        placeholder={placeholder}
      />
    )
  }

  // 無能
  return (
    <input
      value={comment}
      onChange={(e) => {
        setComment(e.target.value)
        // updateInputContent(type, value)
      }}
      style={dynamicStyles}
      className={styles.container}
      placeholder={placeholder}
    />
  )
}

export default DokodemoInput
