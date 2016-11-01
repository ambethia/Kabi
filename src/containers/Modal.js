import React from 'react'
import { connect } from 'react-redux'
import { closeModal } from '../actions'
import ModalView from '../components/ModalView'

import EditLayer from './EditLayer'

// TODO: Does this list belong somewhere else?
// Can they register themselves?
const MAP = {
  editLayer: props => <EditLayer {...props} />,
  undefined: () => null
}

const Modal = connect(
  state => {
    const { name, data } = state.controls.modalData
    return { isOpen: !!name, children: MAP[name](data) }
  },
  dispatch => ({
    onDismiss () { dispatch(closeModal()) }
  })
)(ModalView)

export default Modal
