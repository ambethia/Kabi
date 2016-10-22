import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './components/App'

const render = (root) => {
  ReactDOM.render(
    <AppContainer>{root}</AppContainer>,
    document.getElementById('root')
  )
}

render(<App />)

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const NextApp = require('./components/App').default
    render(<NextApp />)
  })
}
