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

const LayerView = ({ name, color, visible = false, ghosted = false, cels = [], onClickCel }) => (
  <li className={style.layer}>
    <div className={style.frames}>
      {cels.map((cel, i) => {
        return <div
          className={style.frame}
          style={frameStyle(cel.from, cel.to - cel.from + 1)}
          onClick={() => onClickCel(cel.from)}
          key={i}
        />
      })}
    </div>
  </li>
)

LayerView.propTypes = {
  name: T.string.isRequired,
  color: T.string.isRequired,
  visible: T.bool,
  ghosted: T.bool,
  cels: T.array.isRequired,
  onClickCel: T.func
}

export default LayerView
