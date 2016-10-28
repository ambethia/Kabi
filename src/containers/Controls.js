import { connect } from 'react-redux'
import { togglePlayback, toggleLooping, toggleGhosting } from '../actions'

import ControlsView from '../components/ControlsView'

const mapStateToProps = state => ({
  controls: { ...state.controls },
  animation: { ...state.animation }
})

const mapDispatchToProps = dispatch => ({
  actions: {
    onTogglePlayback: () => { dispatch(togglePlayback()) },
    onToggleLooping: () => { dispatch(toggleLooping()) },
    onToggleGhosting: () => { dispatch(toggleGhosting()) }
  }
})

const Controls = connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlsView)

export default Controls
