import { connect } from 'react-redux'
import { togglePlayback, toggleLooping, toggleGhosting } from '../actions'
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
      onToggleGhosting () { dispatch(toggleGhosting()) }
    }
  })
)(ControlsView)

export default Controls
