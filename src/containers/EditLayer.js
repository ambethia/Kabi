import { connect } from 'react-redux'
import { updateLayer } from '../actions'
import EditLayerView from '../components/EditLayerView'

const EditLayer = connect(
  (state, ownProps) => {
    const layer = state.animation.layers[ownProps.index]
    const { name, color } = layer
    return { name, color }
  },
  dispatch => ({
    onUpdateLayer (index, name, color) { dispatch(updateLayer(index, name, color)) }
  })
)(EditLayerView)

export default EditLayer
