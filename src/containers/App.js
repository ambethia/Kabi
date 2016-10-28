import { connect } from 'react-redux'
import { } from '../actions'

import AppView from '../components/AppView'

const mapStateToProps = state => ({
  controls: { ...state.controls },
  animation: { ...state.animation }
})

const mapDispatchToProps = dispatch => ({
  actions: {
  }
})

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppView)

export default App
