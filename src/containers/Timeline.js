import { connect } from 'react-redux'
import { setFrame } from '../actions'
import TimelineView from '../components/TimelineView'

const Timeline = connect(
  state => ({
    controls: { ...state.controls },
    animation: { ...state.animation }
  }),
  dispatch => ({
    onSetFrame (frame) { dispatch(setFrame(frame)) }
  })
)(TimelineView)

export default Timeline
