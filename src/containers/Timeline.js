import { connect } from 'react-redux'
import { setFrame, setLayer } from '../actions'
import TimelineView from '../components/TimelineView'

const Timeline = connect(
  state => ({
    controls: { ...state.controls },
    animation: { ...state.animation }
  }),
  dispatch => ({
    onSetFrame (frame) { dispatch(setFrame(frame)) },
    onSetFrameAndLayer (frame, layer) {
      dispatch(setFrame(frame))
      dispatch(setLayer(layer))
    }
  })
)(TimelineView)

export default Timeline
