import { createStore } from 'redux'
import rootReducer from '../reducers'
import DevTools from '../containers/Root/DevTools'

export default function configureStore (initialState) {
  const store = createStore(rootReducer, initialState, DevTools.instrument())
  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers').default)
    )
  }
  return store
}
