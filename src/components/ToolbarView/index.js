import React, { PropTypes as T } from 'react'
import IconButton from '../IconButton'
import style from './screen.sass'

const ToolbarView = ({ currentTool, onSetTool, onNewDocument, onLoadDocument, onSaveDocument }) => (
  <div className={style.toolbar}>
    <div className={style.group}>
      <IconButton glyph='new' onClick={() => onNewDocument()} />
      <IconButton glyph='load' onClick={() => onLoadDocument()} />
      <IconButton glyph='save' onClick={() => onSaveDocument()} />
    </div>

    <div className={style.group}>
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

    <div className={style.group}>
      <IconButton glyph='viewReset' disabled />
      <IconButton glyph='settings' disabled />
    </div>
  </div>
)

ToolbarView.propTypes = {
  currentTool: T.string.isRequired,
  onSetTool: T.func.isRequired,
  onNewDocument: T.func.isRequired,
  onLoadDocument: T.func.isRequired,
  onSaveDocument: T.func.isRequired
}

export default ToolbarView
