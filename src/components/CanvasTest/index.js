import React, { Component } from 'react'
import { BallpointPen } from './ploma'

class CanvasTest extends Component {

  constructor (props) {
    super(props)
    this.state = {
      isDrawing: false
    }
  }

  componentDidMount () {
    this.ploma = new BallpointPen(this.canvas)
    this.canvas.addEventListener('pointerdown', this.downHandler)
    this.canvas.addEventListener('pointerup', this.upHandler)
    this.canvas.addEventListener('pointermove', this.moveHandler)
  }

  componentWillUnmount () {
    this.canvas.removeEventListener('pointerdown', this.downHandler)
    this.canvas.removeEventListener('pointerup', this.upHandler)
    this.canvas.removeEventListener('pointermove', this.moveHandler)
    this.setState({ isDrawing: false })
  }

  downHandler = (event) => {
    const x = event.offsetX
    const y = event.offsetY
    const p = event.pressure
    this.setState({
      isDrawing: true
    }, () => {
      this.ploma.beginStroke(x, y, p)
    })
  }

  upHandler = (event) => {
    const x = event.offsetX
    const y = event.offsetY
    const p = event.pressure
    this.setState({
      isDrawing: false
    }, () => {
      this.ploma.endStroke(x, y, p)
    })
  }

  moveHandler = (event) => {
    if (this.state.isDrawing) {
      const x = event.offsetX
      const y = event.offsetY
      const p = event.pressure
      this.ploma.extendStroke(x, y, p)
    }
  }

  render () {
    return <canvas
      ref={canvas => { this.canvas = canvas }}
      height={1080 / 2}
      width={1922 / 2}
    />
  }
}

export default CanvasTest
