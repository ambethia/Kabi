import { connect } from 'react-redux'
import { setFrame, setLoopTo, setLoopFrom, setLayer } from '../actions'
import TimelineView from '../components/TimelineView'

const Timeline = connect(
  state => ({
    controls: { ...state.controls },
    animation: { ...state.animation }
  }),
  dispatch => ({
    onSetFrame (frame) { dispatch(setFrame(frame)) },
    onSetLoopTo (frame) { dispatch(setLoopTo(frame)) },
    onSetLoopFrom (frame) { dispatch(setLoopFrom(frame)) },
    onSetFrameAndLayer (frame, layer) {
      dispatch(setFrame(frame))
      dispatch(setLayer(layer))
    }
  })
)(TimelineView)

export default Timeline
