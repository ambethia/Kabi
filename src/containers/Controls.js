import { connect } from 'react-redux'
import {
  togglePlayback, toggleLooping, toggleGhosting,
  createLayer, deleteLayer, setLayer
} from '../actions'
import ControlsView from '../components/ControlsView'

const Controls = connect(
  state => ({
    controls: { ...state.controls },
    animation: { ...state.animation }
  }),
  dispatch => ({
    actions: {
      onTogglePlayback () { dispatch(togglePlayback()) },
      onToggleLooping () { dispatch(toggleLooping()) },
      onToggleGhosting () { dispatch(toggleGhosting()) },
      onCreateLayer (count) { dispatch(createLayer(count)) },
      onDeleteLayer (index) { dispatch(deleteLayer(index)) },
      onSetLayer (index) { dispatch(setLayer(index)) }
    }
  })
)(ControlsView)

export default Controls
