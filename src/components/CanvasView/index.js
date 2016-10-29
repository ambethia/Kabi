import React, { Component, PropTypes as T } from 'react'
import { BallpointPen } from '../../ploma'

class CanvasView extends Component {

  static propTypes = {
    height: T.number.isRequired,
    width: T.number.isRequired,
    currentFrame: T.number.isRequired,
    selectedLayer: T.number.isRequired,
    layers: T.array.isRequired,
    onCreateStroke: T.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      isDrawing: false,
      currentStroke: []
    }
  }

  componentDidMount () {
    this.ploma = new BallpointPen(this.oCanvas)
    this.iContext = this.iCanvas.getContext('2d')
    this.oContext = this.oCanvas.getContext('2d')
    this.iCanvas.addEventListener('pointerdown', this.downHandler)
    this.iCanvas.addEventListener('pointerup', this.upHandler)
    this.iCanvas.addEventListener('pointermove', this.moveHandler)
  }

  componentWillUnmount (nextProps, nextState) {
    this.iCanvas.removeEventListener('pointerdown', this.downHandler)
    this.iCanvas.removeEventListener('pointerup', this.upHandler)
    this.iCanvas.removeEventListener('pointermove', this.moveHandler)
    this.setState({ isDrawing: false })
  }

  // TODO: Separate these two so that we don't need to redraw the output
  // while the input is changing.
  componentDidUpdate () {
    this.drawOutput()
    this.drawInput()
  }

  downHandler = (event) => {
    const x = event.offsetX
    const y = event.offsetY
    const p = event.pressure
    this.setState({
      isDrawing: true,
      currentStroke: [{ x, y, p }]
    })
  }

  upHandler = (event) => {
    const x = event.offsetX
    const y = event.offsetY
    const p = event.pressure
    const stroke = [...this.state.currentStroke, { x, y, p }]
    this.setState({
      isDrawing: false,
      currentStroke: []
    }, () => {
      const { onCreateStroke, currentFrame, selectedLayer } = this.props
      onCreateStroke(stroke, currentFrame, selectedLayer)
      this.iContext.clearRect(0, 0, this.iCanvas.width, this.iCanvas.height)
    })
  }

  moveHandler = (event) => {
    if (this.state.isDrawing) {
      const x = event.offsetX
      const y = event.offsetY
      const p = event.pressure
      this.setState({
        currentStroke: [...this.state.currentStroke, { x, y, p }]
      })
    }
  }

  drawOutput () {
    this.oContext.clearRect(0, 0, this.oCanvas.width, this.oCanvas.height)
    const { layers, currentFrame } = this.props
    for (let i = 0; i < layers.length; i++) {
      const cel = layers[i].cels.find((cel) => (
        cel.from <= currentFrame && currentFrame <= cel.to
      ))
      if (cel) {
        for (let j = 0; j < cel.strokes.length; j++) {
          this.drawStroke(cel.strokes[j], layers[i].color, this.oContext)
        }
      }
    }
  }

  drawInput () {
    this.iContext.clearRect(0, 0, this.iCanvas.width, this.iCanvas.height)
    this.drawStroke(this.state.currentStroke, 'orange', this.iContext)
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
    return <div style={{position: 'relative', width: `${this.props.width}px`, height: `${this.props.height}px`}}>
      <canvas style={{backgroundColor: '#ccc', position: 'absolute'}}
        ref={canvas => { this.oCanvas = canvas }}
        height={this.props.height}
        width={this.props.width}
      />
      <canvas style={{backgroundColor: 'transparent', position: 'absolute'}}
        ref={canvas => { this.iCanvas = canvas }}
        height={this.props.height}
        width={this.props.width}
      />
    </div>
  }
}

export default CanvasView
