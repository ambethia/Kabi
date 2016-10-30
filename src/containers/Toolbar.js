import { connect } from 'react-redux'
import { setTool } from '../actions'
import ToolbarView from '../components/ToolbarView'

const Toolbar = connect(
  state => ({
    currentTool: state.controls.currentTool
  }),
  dispatch => ({
    onSetTool (tool) { dispatch(setTool(tool)) }
  })
)(ToolbarView)

export default Toolbar
