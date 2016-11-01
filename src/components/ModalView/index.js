import React, { Component, PropTypes as T } from 'react'
import style from './screen.sass'

class ModalView extends Component {
  static propTypes = {
    isOpen: T.bool,
    name: T.string,
    data: T.object,
    children: T.element,
    onDismiss: T.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      willDismiss: false
    }
  }

  componentDidUpdate () {
    const dialog = this.refs.dialog
    this.props.isOpen
      ? !dialog.open && dialog.showModal()
      : dialog.open && dialog.close()
  }

  handleClick = () => {
    const { children, onDismiss } = this.props
    children
      ? this.setState({ willDismiss: true })
      : onDismiss()
  }

  onDismiss = () => {
    this.setState(
      { willDismiss: false },
      () => this.props.onDismiss()
    )
  }

  render () {
    return <dialog ref='dialog'>
      <div className={style.modal}>
        <div className={style.content}>
          {this.props.children && React.cloneElement(
            this.props.children, {
              onDismiss: this.onDismiss,
              willDismiss: this.state.willDismiss
            }
          )}
        </div>
        <div className={style.controls}>
          {/* <button>Cancel</button> */}
          <button onClick={this.handleClick}>OK</button>
        </div>
      </div>
    </dialog>
  }
}

export default ModalView
