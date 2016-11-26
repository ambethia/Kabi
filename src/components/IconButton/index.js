import React, { PropTypes as T } from 'react'
import classNames from 'classnames/bind'
import style from './screen.sass'

const cx = classNames.bind(style)

const ICONS = {
  add: require('./add.svg'),
  brush: require('./brush.svg'),
  cross: require('./cross.svg'),
  eraser: require('./eraser.svg'),
  eye: require('./eye.svg'),
  ghost: require('./ghost.svg'),
  load: require('./load.svg'),
  loop: require('./loop.svg'),
  new: require('./new.svg'),
  pause: require('./pause.svg'),
  play: require('./play.svg'),
  save: require('./save.svg'),
  settings: require('./settings.svg'),
  trash: require('./trash.svg'),
  viewReset: require('./view-reset.svg')
}

const IconButton = ({
  glyph,
  disabled = false,
  active = false,
  width = 16,
  height = 16,
  type,
  onClick
}) => {
  const handleClick = (event) => {
    event.preventDefault()
    if (!disabled && onClick) onClick()
  }
  return <button
    onClick={handleClick}
    className={cx('icon', type, { disabled, active })}
    style={{height: `${height + 4}px`}}
  >
    <img src={ICONS[glyph]} width={width} height={height} />
  </button>
}

IconButton.propTypes = {
  glyph: T.string.isRequired,
  active: T.bool,
  disabled: T.bool,
  width: T.number,
  height: T.number,
  type: T.string,
  onClick: T.func
}

export default IconButton
