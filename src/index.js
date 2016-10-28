import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'
import App from './containers/App'
import reducer from './reducers'
import './styles/screen.sass'

const store = createStore(reducer)

const root = document.getElementById('root')

const render = (app) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        {app}
      </Provider>
    </AppContainer>,
    root
  )
}

render(<App />)

if (module.hot) {
  module.hot.accept('./containers/App', () => {
    const NextApp = require('./containers/App').default
    render(<NextApp />)
  })
}
