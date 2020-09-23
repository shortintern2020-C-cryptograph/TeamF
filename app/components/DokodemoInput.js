import React from 'react'
import styles from '../styles/DokodemoInput.module.scss'

const DokodemoInput = (props) => {
  const { top, left, fontSize, width, height, placeholder, multipleLines } = props
  const dynamicStyles = {
    top: `${top}px`,
    left: `${left}px`,
    fontSize: `${fontSize}px`,
    width: `${width}px`,
    height: `${height}px`
  }

  if (multipleLines) {
    return <textarea style={dynamicStyles} className={styles.container} placeholder={placeholder} />
  }

  return <input style={dynamicStyles} className={styles.container} placeholder={placeholder} />
}

export default DokodemoInput
