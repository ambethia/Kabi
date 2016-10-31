import React, { PropTypes as T } from 'react'
import classNames from 'classnames/bind'
import style from './screen.sass'

const cx = classNames.bind(style)

const ICONS = {
  add: require('./Add.svg'),
  brush: require('./Brush.svg'),
  eraser: require('./Eraser.svg'),
  eye: require('./Eye.svg'),
  ghost: require('./Ghost.svg'),
  loop: require('./Loop.svg'),
  pause: require('./Pause.svg'),
  play: require('./Play.svg'),
  trash: require('./Trash.svg')
}

const IconButton = ({
  glyph,
  disabled = false,
  active = false,
  width = 16,
  height = 16,
  onClick
}) => {
  const handleClick = (event) => {
    event.preventDefault()
    if (!disabled && onClick) onClick()
  }
  return <button onClick={handleClick} className={cx('icon', { disabled, active })}>
    <img src={ICONS[glyph]} width={width} height={height} />
  </button>
}

IconButton.propTypes = {
  glyph: T.string.isRequired,
  active: T.bool,
  disabled: T.bool,
  width: T.number,
  height: T.number,
  onClick: T.func
}

export default IconButton
