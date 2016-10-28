import React, { PropTypes as T } from 'react'
import classNames from 'classnames/bind'
import LayerListView from '../LayerListView'
import LayerView from './LayerView'
import style from './screen.sass'

const cx = classNames.bind(style)

const TimelineView = ({ controls, animation }) => (
  <div className={style.timeline}>
    <header>
      {[...Array(controls.totalFrames).keys()].map((i) => (
        <div className={cx({
          loop: ++i >= controls.loopFrom === i <= controls.loopTo,
          current: i === controls.currentFrame })} key={i}>
          <span>{i}</span>
        </div>
      ))}
    </header>
    <LayerListView layers={animation.layers} view={LayerView} />
  </div>
)

TimelineView.propTypes = {
  controls: T.object.isRequired,
  animation: T.object.isRequired
}

export default TimelineView
