import React from 'react'
import ReactDOM from 'react-dom'
import Root from './containers/Root'
import configureStore from './store'
import './styles/screen.sass'

const store = configureStore({})
const render = root => ReactDOM.render(root, document.getElementById('root'))

render(<Root store={store} />)

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root').default
    render(<NextRoot store={store} />)
  })
}
