import React, { Component, PropTypes as T } from 'react'

class CanvasView extends Component {

  static propTypes = {
    height: T.number.isRequired,
    width: T.number.isRequired,
    currentFrame: T.number.isRequired,
    currentLayer: T.number.isRequired,
    currentTool: T.string.isRequired,
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
    this.oContext.clearRect(0, 0, this.oCanvas.width, this.oCanvas.height)
    const { layers, currentLayer } = this.props
    for (let i = 0; i < layers.length; i++) {
      const cel = this.celForLayer(i)
      if (cel) {
        for (let j = 0; j < cel.strokes.length; j++) {
          const erased = i === currentLayer && this.state.erasedStrokes.includes(j)
          const color = erased ? '#900' : layers[i].color
          this.drawStroke(cel.strokes[j], color, this.oContext)
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
    const { currentLayer } = this.props
    const cel = this.celForLayer(currentLayer)
    if (cel) {
      const { currentStroke, erasedStrokes } = this.state
      const eraserBounds = this.boundsForStroke(currentStroke)
      for (let i = 0; i < cel.strokes.length; i++) {
        // Don't recheck strokes we've already tagged.
        if (!erasedStrokes.includes(i)) {
          const stroke = cel.strokes[i]
          const strokeBounds = this.boundsForStroke(stroke) // TODO: Cache these when updated
          if (this.boundsDoIntersect(eraserBounds, strokeBounds)) {
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

  celForLayer (index) {
    const {layers, currentFrame} = this.props
    if (layers[index]) {
      return layers[index].cels.find((cel) => (
        cel.from <= currentFrame && currentFrame <= cel.to
      ))
    }
  }

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

  boundsDoIntersect (a, b) {
    return a[2] > b[0] && a[0] < b[2] && a[3] > b[1] && a[1] < b[3]
  }

  doLineSegmentsIntersect (a, b) {
    function linesIntersect (seg1, seg2, precision) {
      var x1 = seg1[0][0],
        y1 = seg1[0][1],
        x2 = seg1[1][0],
        y2 = seg1[1][1],
        x3 = seg2[0][0],
        y3 = seg2[0][1],
        x4 = seg2[1][0],
        y4 = seg2[1][1],
        x, y, result = false,
        p = precision || 6,
        denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
      if (denominator === 0) {
        // check both segments are Coincident, we already know
        // that these two are parallel
        if (fix((y3 - y1) * (x2 - x1), p) === fix((y2 - y1) * (x3 - x1), p)) {
          // second segment any end point lies on first segment
          result = intPtOnSegment(x3, y3, x1, y1, x2, y2, p) ||
        intPtOnSegment(x4, y4, x1, y1, x2, y2, p)
        }
      } else {
        x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denominator
        y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denominator
        // check int point (x,y) lies on both segment
        result = intPtOnSegment(x, y, x1, y1, x2, y2, p) && intPtOnSegment(x, y, x3, y3, x4, y4, p)
      }
      return result
    }

    function intPtOnSegment (x, y, x1, y1, x2, y2, p) {
      return fix(Math.min(x1, x2), p) <= fix(x, p) && fix(x, p) <= fix(Math.max(x1, x2), p) && fix(Math.min(y1, y2), p) <= fix(y, p) && fix(y, p) <= fix(Math.max(y1, y2), p)
    }

    // fix to the precision
    function fix (n, p) {
      return parseInt(n * Math.pow(10, p))
    }
    return linesIntersect(a, b)
  }

  doLinesIntersect (a, b) {
    for (let i = 1; i < a.length; i++) {
      for (let j = 1; j < b.length; j++) {
        if (b[j]) {
          let c = [[a[i - 1].x, a[i - 1].y], [a[i].x, a[i].y]]
          let d = [[b[j - 1].x, b[j - 1].y], [b[j].x, b[j].y]]
          if (this.doLineSegmentsIntersect(c, d)) return true
        }
      }
    }
  }

  linesDoIntersect (p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y) {
    const s1x = p1x - p0x
    const s1y = p1y - p0y
    const s2x = p3x - p2x
    const s2y = p3y - p2y
    const s = (-s1y * (p0x - p2x) + s1x * (p0y - p2y)) / (-s2x * s1y + s1x * s2y)
    const t = (s2x * (p0y - p2y) - s2y * (p0x - p2x)) / (-s2x * s1y + s1x * s2y)
    return s >= 0 && s <= 1 && t >= 0 && t <= 1
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
