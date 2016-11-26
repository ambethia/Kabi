import { connect } from 'react-redux'
import { setTool, saveDocument, loadDocument, newDocument } from '../actions'
import ToolbarView from '../components/ToolbarView'

const Toolbar = connect(
  state => ({
    currentTool: state.controls.currentTool
  }),
  dispatch => ({
    onSetTool (tool) { dispatch(setTool(tool)) },
    onSaveDocument () { dispatch(saveDocument()) },
    onLoadDocument () { dispatch(loadDocument()) },
    onNewDocument () { dispatch(newDocument()) }
  })
)(ToolbarView)

export default Toolbar
