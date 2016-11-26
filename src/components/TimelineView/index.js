import React, { Component, PropTypes as T } from 'react'
import classNames from 'classnames/bind'
import LayerView from './LayerView'
import style from './screen.sass'

const cx = classNames.bind(style)

class TimelineView extends Component {

  static propTypes = {
    controls: T.object.isRequired,
    animation: T.object.isRequired,
    onSetFrame: T.func,
    onSetLoopTo: T.func,
    onSetLoopFrom: T.func,
    onSetFrameAndLayer: T.func
  }

  constructor (props) {
    super(props)
    this.state = {
      resizing: null
    }
  }

  _endResize () {
    if (!this.state.resizing) return
    this.setState({
      resizing: null
    })
  }

  _doResize (frame) {
    if (!this.state.resizing) return
    switch (this.state.resizing) {
      case 'left':
        this.props.onSetLoopFrom(frame)
        break
      case 'right':
        this.props.onSetLoopTo(frame)
        break
    }
  }

  _beginResize (side) {
    this.setState({
      resizing: side
    })
  }

  render () {
    const { controls, animation, onSetFrame, onSetFrameAndLayer } = this.props
    return <div className={style.timeline}>
      <header
        style={{width: `calc(1.5em * ${controls.totalFrames})`}}
        className={cx({resizing: !!this.state.resizing})}
        onMouseLeave={() => this._endResize()}
      >
        {[...Array(controls.totalFrames).keys()].map((i) => (
          <div
            onMouseUp={() => this._endResize()}
            onMouseOver={() => this._doResize(i)}
            className={cx({
              loop: ++i && controls.looping && i >= controls.loopFrom && i <= controls.loopTo,
              current: i === controls.currentFrame })}
            onClick={() => onSetFrame(i)}
            key={i}
          >
            {(() => {
              if (controls.looping && i === controls.loopFrom) {
                return <div
                  className={cx('handle', 'left')}
                  onMouseDown={() => this._beginResize('left')}
                />
              }
            })()}
            <span>{i}</span>
            {(() => {
              if (controls.looping && i === controls.loopTo) {
                return <div
                  className={cx('handle', 'right')}
                  onMouseDown={() => this._beginResize('right')}
                />
              }
            })()}
          </div>
        ))}
      </header>
      <ul className={style.layers} style={{width: `calc(1.5em * ${controls.totalFrames})`}}>
        {animation.layers.map((layer, i) => (
          <LayerView {...layer} key={i} onClickCel={(cel) => onSetFrameAndLayer(cel, i)} />
        ))}
      </ul>
    </div>
  }
}

export default TimelineView
