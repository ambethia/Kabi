import { connect } from 'react-redux'
import { } from '../actions'

import TimelineView from '../components/TimelineView'

const mapStateToProps = state => ({
  controls: { ...state.controls },
  animation: { ...state.animation }
})

const mapDispatchToProps = dispatch => ({
  actions: {
  }
})

const Timeline = connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineView)

export default Timeline
