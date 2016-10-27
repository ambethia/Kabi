import React, { Component, PropTypes as T } from 'react'
import { BallpointPen } from '../ploma'

class Canvas extends Component {

  static propTypes = {
    height: T.number.isRequired,
    width: T.number.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      isDrawing: false,
      strokes: [],
      currentStroke: []
    }
  }

  componentDidMount () {
    this.context = this.canvas.getContext('2d')
    this.ploma = new BallpointPen(this.canvas, { paperColor: '#eee' })
    this.ploma.setStrokes(this.state.strokes)
    this.canvas.addEventListener('pointerdown', this.downHandler)
    this.canvas.addEventListener('pointerup', this.upHandler)
    this.canvas.addEventListener('pointermove', this.moveHandler)
  }

  componentWillUnmount (nextProps, nextState) {
    this.canvas.removeEventListener('pointerdown', this.downHandler)
    this.canvas.removeEventListener('pointerup', this.upHandler)
    this.canvas.removeEventListener('pointermove', this.moveHandler)
    this.setState({ isDrawing: false })
  }

  componentDidUpdate () {
    this.draw()
  }

  downHandler = (event) => {
    const x = event.offsetX
    const y = event.offsetY
    const p = event.pressure
    this.setState({
      isDrawing: true,
      currentStroke: [{ x, y, p }]
    })
    this.ploma.beginStroke(x, y, p)
  }

  upHandler = (event) => {
    const x = event.offsetX
    const y = event.offsetY
    const p = event.pressure
    const stroke = [...this.state.currentStroke, { x, y, p }]
    this.setState({
      isDrawing: false,
      strokes: [...this.state.strokes, stroke],
      currentStroke: []
    })
    this.ploma.endStroke(x, y, p)
  }

  moveHandler = (event) => {
    if (this.state.isDrawing) {
      const x = event.offsetX
      const y = event.offsetY
      const p = event.pressure
      this.setState({
        currentStroke: [...this.state.currentStroke, { x, y, p }]
      })
      this.ploma.extendStroke(x, y, p)
    }
  }

  draw () {
    // const ctx = this.context
    // ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    // const strokes = this.state.strokes
    // for (let i = 0; i < strokes.length; i++) {
    //   this.drawStroke(strokes[i], 'red', ctx)
    // }
    // this.drawStroke(this.state.currentStroke, 'orange', ctx)
  }

  drawStroke (stroke, color, ctx) {
    ctx.fillStyle = color
    for (let j = 0; j < stroke.length; j++) {
      const { x, y, p } = stroke[j]
      ctx.beginPath()
      ctx.arc(x, y, 4 * p, 0, Math.PI * 2)
      ctx.fill()
    }

    if (stroke[0]) {
      ctx.lineWidth = 0.25
      ctx.strokeStyle = color
      ctx.beginPath()
      ctx.moveTo(stroke[0].x, stroke[0].y)
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y)
      }
      ctx.stroke()
    }
  }

  render () {
    return <canvas
      ref={canvas => { this.canvas = canvas }}
      height={this.props.height}
      width={this.props.width}
    />
  }
}

export default Canvas
