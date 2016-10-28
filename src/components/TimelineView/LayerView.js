import React, { PropTypes as T } from 'react'
import style from './screen.sass'

const sizes = {
  frameWidth: 1.5,
  baseDotSize: 1
}

const frameStyle = (position, length) => {
  const frame = sizes.frameWidth
  const size = sizes.baseDotSize
  const left = `${frame * position - size / 2 - frame / 2}em`
  const width = `${size + frame * (length - 1)}em`
  return { left, width }
}

const LayerView = ({ name, color, visible = false, ghosted = false, cels = [] }) => (
  <li className={style.layer}>
    <div className={style.frames}>
      <div className={style.frame} style={frameStyle(1, 1)} />
      <div className={style.frame} style={frameStyle(2, 2)} />
      <div className={style.frame} style={frameStyle(4, 3)} />
      <div className={style.frame} style={frameStyle(7, 4)} />
    </div>
  </li>
)

LayerView.propTypes = {
  name: T.string.isRequired,
  color: T.string.isRequired,
  visible: T.bool,
  ghosted: T.bool,
  cels: T.array
}

export default LayerView
