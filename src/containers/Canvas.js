import { connect } from 'react-redux'
import { createStroke } from '../actions'
import CanvasView from '../components/CanvasView'

const Canvas = connect(
  state => ({
    width: state.animation.width,
    height: state.animation.height,
    currentFrame: state.controls.currentFrame,
    selectedLayer: state.controls.selectedLayer,
    layers: state.animation.layers
  }),
  dispatch => ({
    onCreateStroke (stroke, frame, layer) { dispatch(createStroke(stroke, frame, layer)) }
  })
)(CanvasView)

export default Canvas
