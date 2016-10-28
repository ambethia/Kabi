import React, { PropTypes as T } from 'react'
import classNames from 'classnames/bind'
import LayerView from './LayerView'
import style from './screen.sass'

const cx = classNames.bind(style)

const TimelineView = ({ controls, animation, onSetFrame }) => (
  <div className={style.timeline}>
    <header style={{width: `calc(1.5em * ${controls.totalFrames})`}}>
      {[...Array(controls.totalFrames).keys()].map((i) => (
        <div
          className={cx({
            loop: ++i && controls.looping && i >= controls.loopFrom === i <= controls.loopTo,
            current: i === controls.currentFrame })}
          onClick={() => onSetFrame(i)}
          key={i}
        >
          <span>{i}</span>
        </div>
      ))}
    </header>
    <ul className={style.layers} style={{width: `calc(1.5em * ${controls.totalFrames})`}}>
      {animation.layers.map((layer, i) => (
        <LayerView {...layer} key={i} />
      ))}
    </ul>
  </div>
)

TimelineView.propTypes = {
  controls: T.object.isRequired,
  animation: T.object.isRequired
}

export default TimelineView
