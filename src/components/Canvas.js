import React, { Component, PropTypes as T } from 'react'

const SUCCESS = Symbol('SUCCESS')
const FAILURE = Symbol('FAILURE')
const CORNER = Symbol('CORNER')

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

    this.vectorDistMap = []
  }

  componentDidMount () {
    this.context = this.canvas.getContext('2d')
    this.canvas.addEventListener('pointerdown', this._downHandler)
    this.canvas.addEventListener('pointerup', this._upHandler)
    this.canvas.addEventListener('pointermove', this._moveHandler)
  }

  componentWillUnmount (nextProps, nextState) {
    this.canvas.removeEventListener('pointerdown', this._downHandler)
    this.canvas.removeEventListener('pointerup', this._upHandler)
    this.canvas.removeEventListener('pointermove', this._moveHandler)
    this.setState({ isDrawing: false })
  }

  componentDidUpdate () {
    this._draw()
  }

  _downHandler = (event) => {
    const x = event.offsetX
    const y = event.offsetY
    this.setState({
      isDrawing: true,
      currentStroke: [{ x, y, p: event.pressure }]
    })

    this.curve = [{ c0: { x, y }, c1: { x, y }, c2: { x, y }, c3: { x, y } }]
    this.vectorDistMap = []
  }

  _upHandler = (event) => {
    const stroke = [...this.state.currentStroke, { x: event.offsetX, y: event.offsetY, p: event.pressure }]
    this.setState({
      isDrawing: false,
      strokes: [...this.state.strokes, stroke],
      currentStroke: []
    })
  }

  _moveHandler = (event) => {
    if (this.state.isDrawing) {
      const x = event.offsetX
      const y = event.offsetY

      const currentSegment = this.curve[this.curve.length - 1]
      const result = this._updateCurveSegment(x, y, currentSegment)

      if (result !== SUCCESS) {
        // TODO: Handle it.
      }

      this.setState({
        currentStroke: [...this.state.currentStroke, { x, y, p: event.pressure }]
      })
    }
  }

  _updateCurveSegment = (x, y, segment) => {
    const prev = segment.c3
  }

  _draw = () => {
    const strokes = this.state.strokes
    for (let i = 0; i < strokes.length; i++) {
      this._drawStroke(strokes[i], '#ccc  ')
    }
    this._drawStroke(this.state.currentStroke, '#999')
  }

  _drawStroke = (stroke, color) => {
    const ctx = this.context
    // ctx.fillStyle = color
    // for (let j = 0; j < stroke.length; j++) {
    //   const { x, y, p } = stroke[j]
    //   ctx.beginPath()
    //   ctx.arc(x, y, 5 * p, 0, Math.PI * 2)
    //   ctx.fill()
    // }

    if (stroke[0]) {
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.moveTo(stroke[0].x, stroke[0].y)
      for (let i = 1; i < stroke.length; i++) {
        const { x, y } = stroke[i]
        ctx.lineTo(x, y)
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
