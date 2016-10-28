import React, { PropTypes as T } from 'react'
import IconButton from '../IconButton'
import style from './screen.sass'

const LayerView = ({ name, color, visible = false, ghosted = false }) => (
  <li className={style.layer}>
    <div className={style.color}>
      <div className={style.swatch} style={{backgroundColor: color}} />
    </div>
    <div className={style.name}>{name}</div>
    <IconButton glyph='eye' disabled={!visible} />
    <IconButton glyph='ghost' disabled={!ghosted} />
  </li>
)

LayerView.propTypes = {
  name: T.string.isRequired,
  color: T.string.isRequired,
  visible: T.bool,
  ghosted: T.bool
}

export default LayerView
