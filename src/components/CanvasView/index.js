import React, { Component, PropTypes as T } from 'react'
import { findCel } from '../../utility'

// TODO: Refactor this component, moving the brush and eraser
// code to separate modules as well as, possibly, a separate
// rendering class for drawing.
class CanvasView extends Component {

  static propTypes = {
    height: T.number.isRequired,
    width: T.number.isRequired,
    playing: T.bool.isRequired,
    ghosting: T.bool.isRequired,
    looping: T.bool.isRequired,
    loopFrom: T.number.isRequired,
    loopTo: T.number.isRequired,
    currentFrame: T.number.isRequired,
    currentLayer: T.number.isRequired,
    currentTool: T.string.isRequired,
    totalFrames: T.number.isRequired,
    layers: T.array.isRequired,
    onCreateStroke: T.func.isRequired,
    onDeleteStroke: T.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      isDrawing: false,
      currentStroke: [],
      erasedStrokes: []
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
    if (this.state.currentStroke.length > 0) {
      if (this.props.currentTool === 'eraser') this.eraseStrokes()
      this.drawInput()
    }
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
    const erasedStrokes = this.state.erasedStrokes.slice()
    const stroke = [...this.state.currentStroke, { x, y, p, t }]
    this.setState({
      isDrawing: false,
      currentStroke: [],
      erasedStrokes: []
    }, () => {
      const {
        currentFrame, currentLayer, currentTool,
        onCreateStroke, onDeleteStroke
      } = this.props
      switch (currentTool) {
        case 'brush':
          onCreateStroke(stroke, currentFrame, currentLayer)
          break
        case 'eraser':
          for (let i = 0; i < erasedStrokes.length; i++) {
            onDeleteStroke(erasedStrokes[i], currentFrame, currentLayer)
          }
          break
        default:
          break
      }
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
    const GHOST_FRAMES = 2
    const {
      playing, layers, currentLayer, currentFrame, totalFrames,
      ghosting, looping, loopFrom, loopTo
    } = this.props
    const frames = [currentFrame]
    if (ghosting && !playing) {
      for (let i = 1; i <= GHOST_FRAMES; i++) {
        let left = currentFrame - i
        let right = currentFrame + i
        if (looping && currentFrame >= loopFrom && currentFrame <= loopTo) {
          if (left < loopFrom) left = loopTo + left
          if (right > loopTo) right = right - loopTo
        }
        frames.unshift(left)
        frames.push(right)
      }
    }
    this.oContext.clearRect(0, 0, this.oCanvas.width, this.oCanvas.height)
    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i]
      if (frame > 0 && frame <= totalFrames) {
        for (let j = 0; j < layers.length; j++) {
          const isCurrentFrame = frame === currentFrame
          const isCurrentLayer = j === currentLayer
          const layer = layers[j]
          if (layer.visible && (isCurrentFrame || layer.ghosted)) {
            const cel = findCel(layers, j, frame)
            if (cel) {
              const color = (() => {
                if (isCurrentFrame) return layer.color
                const mid = frames.length / 2
                const opacity = 1 - (1 / Math.round(mid) * Math.abs(i - Math.floor(mid)))
                const hue = i > mid ? 128 : 0
                return `hsla(${hue},75%,75%,${opacity})`
              })()
              for (let k = 0; k < cel.strokes.length; k++) {
                const isErased = isCurrentFrame &&
                                 isCurrentLayer &&
                                 this.state.erasedStrokes.includes(k)
                this.drawStroke(cel.strokes[k], isErased ? '#900' : color, this.oContext)
              }
            }
          }
        }
      }
    }
  }

  drawInput () {
    const { currentTool, currentLayer, layers } = this.props
    // const color = (() => {
    //   switch (currentTool) {
    //     case 'brush':
    //       return layers[currentLayer].color
    //     case 'eraser':
    //       return '#C00'
    //   }
    // })()
    const color = currentTool === 'eraser' ? '#C00' : layers[currentLayer].color
    this.iContext.clearRect(0, 0, this.iCanvas.width, this.iCanvas.height)
    this.drawStroke(this.state.currentStroke, color, this.iContext)
  }

  drawStroke (stroke, color, ctx) {
    const maxWidth = 4 // TODO configurable brush size
    const minWidth = maxWidth * 0.1
    if (stroke.length > 0) {
      const outline = []
      // TODO: Refacter this when stroke point handling is converted from objects to arrays
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
        // TODO: Refactor to use pre-allocated array rather than resizing for every point.
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

  eraseStrokes () {
    const { layers, currentLayer, currentFrame } = this.props
    const cel = findCel(layers, currentLayer, currentFrame)
    if (cel) {
      const { currentStroke, erasedStrokes } = this.state
      const eraserBounds = this.boundsForStroke(currentStroke)
      for (let i = 0; i < cel.strokes.length; i++) {
        // Don't recheck strokes we've already tagged.
        if (!erasedStrokes.includes(i)) {
          const stroke = cel.strokes[i]
          // TODO: Cache these when updated
          const strokeBounds = this.boundsForStroke(stroke)
          if (this.boundsDoIntersect(...eraserBounds, ...strokeBounds)) {
            // Tag this stroke for erasure if they really intersect
            if (this.doLinesIntersect(stroke, currentStroke)) {
              // NOTE: It's possible this could end up adding the same stroke twice... is that a problem?
              this.setState({ erasedStrokes: [...this.state.erasedStrokes, i] })
            }
          }
        }
      }
    }
  }

  // TODO: Refacter `boundsForStroke` when stroke point handling is converted from objects to arrays
  boundsForStroke (stroke) {
    const length = stroke.length
    if (length === 0) return []
    let lo = Object.assign({}, stroke[0])
    let hi = Object.assign({}, stroke[0])
    for (let i = 1; i < length; ++i) {
      var point = stroke[i]
      for (let prop in point) {
        lo[prop] = Math.min(lo[prop], point[prop])
        hi[prop] = Math.max(hi[prop], point[prop])
      }
    }
    return [lo.x, lo.y, hi.x, hi.y]
  }

  // TODO: Refacter `doLinesIntersect` when stroke point handling is converted from objects to arrays
  doLinesIntersect (a, b) {
    for (let i = 1; i < a.length; i++) {
      for (let j = 1; j < b.length; j++) {
        if (b[j]) {
          if (this.doLineSegmentsIntersect(
            a[i - 1].x, a[i - 1].y, a[i].x, a[i].y,
            b[j - 1].x, b[j - 1].y, b[j].x, b[j].y
          )) return true
        }
      }
    }
  }

  // Test if a box from AB intersects with one from CD
  boundsDoIntersect (Ax, Ay, Bx, By, Cx, Cy, Dx, Dy) {
    return Bx > Cx && Ax < Dx && By > Cy && Ay < Dy
  }

  // Test if segments AB and CD intersect
  doLineSegmentsIntersect (Ax, Ay, Bx, By, Cx, Cy, Dx, Dy) {
    const Sx = Bx - Ax
    const Sy = By - Ay
    const Tx = Dx - Cx
    const Ty = Dy - Cy
    const u = (-Sy * (Ax - Cx) + Sx * (Ay - Cy)) / (-Tx * Sy + Sx * Ty)
    const v = (Tx * (Ay - Cy) - Ty * (Ax - Cx)) / (-Tx * Sy + Sx * Ty)
    return u >= 0 && u <= 1 && v >= 0 && v <= 1
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
