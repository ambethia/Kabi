import React, { Component, PropTypes as T } from 'react'

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
    const t = new Date().getTime()
    this.setState({
      isDrawing: true,
      currentStroke: [{ x, y, p, t }]
    })
  }

  upHandler = (event) => {
    const x = event.offsetX
    const y = event.offsetY
    const p = event.pressure
    const t = new Date().getTime()
    const stroke = [...this.state.currentStroke, { x, y, p, t }]
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
      const t = new Date().getTime()
      this.setState({
        currentStroke: [...this.state.currentStroke, { x, y, p, t }]
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
    // ctx.fillStyle = color
    // ctx.lineWidth = 1
    // for (let j = 0; j < stroke.length; j++) {
    //   const { x, y, p } = stroke[j]
    //   ctx.beginPath()
    //   // ctx.arc(x, y, 8 * p, 0, Math.PI * 2)
    //   ctx.rect(x - 1.5, y - 1.5, 3, 3)
    //   ctx.stroke()
    // }

    if (stroke.length > 0) {
      // ctx.lineWidth = 1
      // ctx.strokeStyle = 'red'
      // ctx.beginPath()
      // ctx.moveTo(stroke[0].x, stroke[0].y)
      const outline = []
      const maxWidth = 4
      const minWidth = maxWidth * 0.1
      outline.push([stroke[0].x, stroke[0].y])
      for (let i = 1; i < stroke.length; i++) {
        // this point
        const x0 = stroke[i].x
        const y0 = stroke[i].y
        // previous point
        const x1 = stroke[i - 1].x
        const y1 = stroke[i - 1].y
        // direction & magnitude
        const dx = x1 - x0
        const dy = y1 - y0
        const magnatude = Math.sqrt((dx * dx) + (dy * dy))
        // velocity with some
        const t0 = stroke[i].t
        const t1 = stroke[i - 1].t
        let velocity = (t0 === t1) ? magnatude / t0 - t1 : 1
        // Apply some cubic easing to the pressure
        let p = stroke[i].p
        p = p < 0.5 ? 4 * p * p * p : (p - 1) * (2 * p - 2) * (2 * p - 2) + 1
        // normalize the vector based on pressure and velocity
        const weight = Math.max(maxWidth / (velocity + 1) * p, minWidth)
        const nx = dx * weight / magnatude
        const ny = dy * weight / magnatude
        // Use the normalized vector to find points
        // perpendicular to the center line at the
        // midpoint between it's two two points
        const x2 = (x0 + x1) / 2 - ny
        const y2 = (y0 + y1) / 2 + nx
        const x3 = (x0 + x1) / 2 + ny
        const y3 = (y0 + y1) / 2 - nx
        // ctx.lineTo(x0, y0)
        // ctx.moveTo(x2, y2)
        // ctx.lineTo(x3, y3)
        // ctx.moveTo(x0, y0)

        outline.unshift([x2, y2])
        outline.push([x3, y3])
        if (i === stroke.length - 1) {
          outline.push([x0, y0])
        }
      }
      if (outline.length > 1) {
        ctx.beginPath()
        ctx.fillStyle = color
        ctx.moveTo(outline[0][0], outline[0][1])
        for (let i = 1; i < outline.length - 2; i++) {
          var xc = (outline[i][0] + outline[i + 1][0]) / 2
          var yc = (outline[i][1] + outline[i + 1][1]) / 2
          ctx.quadraticCurveTo(outline[i][0], outline[i][1], xc, yc)
        }
        ctx.quadraticCurveTo(outline[1][0], outline[1][1], outline[0][0], outline[0][1])
        ctx.fill()
      }
    }
  }

  render () {
    return <div style={{position: 'relative', width: `${this.props.width}px`, height: `${this.props.height}px`}}>
      <canvas style={{backgroundColor: '#eee', position: 'absolute'}}
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
