import { Component, PropTypes as T } from 'react'
import { connect } from 'react-redux'
import { setFrame, resetPlayback } from '../actions'

class AnimationController extends Component {

  static propTypes = {
    controls: T.object.isRequired,
    fps: T.number.isRequired,
    setFrame: T.func.isRequired,
    resetPlayback: T.func.isRequired
  }

  componentDidMount () {
    if (this.props.controls.playing) {
      this.animate()
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.controls.playing &&
        !prevProps.controls.playing) {
      this.animate()
    } else {
      this.cancelAnimation()
    }
  }

  componentWillUnmount () {
    this.cancelAnimation()
  }

  cancelAnimation () {
    if (this.request) {
      window.cancelAnimationFrame(this.request)
      delete this.request
    }
  }

  animate () {
    setTimeout(() => {
      const { playing, looping, loopFrom, loopTo, currentFrame, totalFrames } = this.props.controls
      if (playing) {
        const nextFrame = currentFrame + 1
        if (looping) {
          this.props.setFrame(currentFrame < loopTo ? nextFrame : loopFrom)
        } else {
          if (currentFrame < totalFrames) {
            this.props.setFrame(nextFrame)
          } else {
            this.props.resetPlayback()
          }
        }
        this.request = window.requestAnimationFrame(::this.animate)
      } else {
        this.cancelAnimation()
      }
    }, 1000 / this.props.fps)
  }

  render = () => null
}

export default connect(
  state => ({
    controls: {...state.controls},
    fps: state.animation.fps
  }),
  dispatch => ({
    setFrame (frame) { dispatch(setFrame(frame)) },
    resetPlayback () { dispatch(resetPlayback()) }
  })
)(AnimationController)
