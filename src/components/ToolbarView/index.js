import React, { PropTypes as T } from 'react'
import IconButton from '../IconButton'
import style from './screen.sass'

const ToolbarView = ({ currentTool, onSetTool }) => (
  <div className={style.toolbar}>
    <IconButton
      glyph='brush'
      active={currentTool === 'brush'}
      onClick={() => onSetTool('brush')}
    />
    <IconButton
      glyph='eraser'
      active={currentTool === 'eraser'}
      onClick={() => onSetTool('eraser')}
    />
  </div>
)

ToolbarView.propTypes = {
  currentTool: T.string.isRequired,
  onSetTool: T.func.isRequired
}

export default ToolbarView
