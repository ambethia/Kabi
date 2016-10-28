import { connect } from 'react-redux'
import { } from '../actions'

import AppView from '../components/AppView'

const App = connect(
  state => ({
    controls: { ...state.controls },
    animation: { ...state.animation }
  }),
  dispatch => ({
    actions: {
    }
  })
)(AppView)

export default App
