import React, { PropTypes as T } from 'react'
import classNames from 'classnames/bind'
import style from './screen.sass'
const cx = classNames.bind(style)

const ICONS = {
  add: require('./Add.svg'),
  eye: require('./Eye.svg'),
  ghost: require('./Ghost.svg'),
  trash: require('./Trash.svg')
}

const Icon = ({glyph, width = 16, height = 16, className = 'icon'}) => {
  return <img src={ICONS[glyph]} className={cx('icon', className)} width={width} height={height} />
}

Icon.propTypes = {
  glyph: T.string.isRequired,
  className: T.string,
  width: T.number,
  height: T.number
}

export default Icon
