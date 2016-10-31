import React, { Component } from 'react'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import DevTools from './DevTools'
import App from '../App'

export default class Root extends Component {
  static propTypes = {
    store: React.PropTypes.object.isRequired
  }

  render () {
    const { store } = this.props
    return (
      <AppContainer>
        <Provider store={store}>
          <div>
            <App />
            <DevTools />
          </div>
        </Provider>
      </AppContainer>
    )
  }
}
