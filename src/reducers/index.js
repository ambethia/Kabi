import { combineReducers } from 'redux'
import controls from './controls'
import animation from './animation'

const reducers = combineReducers({
  controls,
  animation
})

export default reducers
