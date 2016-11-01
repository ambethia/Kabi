import React, { PropTypes as T } from 'react'
import classNames from 'classnames/bind'
import IconButton from '../IconButton'
import style from './screen.sass'

const cx = classNames.bind(style)

const LayerView = ({
  name,
  color,
  visible = false,
  ghosted = false,
  current = false,
  onSetLayer,
  onEditLayer,
  onToggleVisibilty,
  onToggleGhosting
}) => (
  <li className={cx('layer', { current })}>
    <div
      className={style.color}
      onClick={onEditLayer}
    >
      <div className={style.swatch} style={{backgroundColor: color}} />
    </div>
    <div
      className={style.name}
      onClick={onSetLayer}
      onDoubleClick={onEditLayer}
    >{name}</div>
    <IconButton type='dim' glyph='eye' active={visible} onClick={onToggleVisibilty} />
    <IconButton type='dim' glyph='ghost' active={ghosted} onClick={onToggleGhosting} />
  </li>
)

LayerView.propTypes = {
  name: T.string.isRequired,
  color: T.string.isRequired,
  visible: T.bool,
  ghosted: T.bool,
  current: T.bool,
  onSetLayer: T.func.isRequired,
  onEditLayer: T.func.isRequired,
  onToggleVisibilty: T.func.isRequired,
  onToggleGhosting: T.func.isRequired
}

export default LayerView
