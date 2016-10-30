import { connect } from 'react-redux'
import { createStroke, deleteStroke } from '../actions'
import CanvasView from '../components/CanvasView'

const Canvas = connect(
  state => ({
    width: state.animation.width,
    height: state.animation.height,
    currentFrame: state.controls.currentFrame,
    currentLayer: state.controls.currentLayer,
    currentTool: state.controls.currentTool,
    layers: state.animation.layers
  }),
  dispatch => ({
    onCreateStroke (stroke, frame, layer) { dispatch(createStroke(stroke, frame, layer)) },
    onDeleteStroke (index, frame, layer) { dispatch(deleteStroke(index, frame, layer)) }
  })
)(CanvasView)

export default Canvas
