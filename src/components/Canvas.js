import React, { Component, PropTypes as T } from 'react'

const SUCCESS = Symbol('SUCCESS')
const FAILURE = Symbol('FAILURE')
const CORNER = Symbol('CORNER')
const MAX_ANGLE = 60 * Math.PI / 180
const MAX_ERROR = 3
const MAX_N_ITERATION = 4
const INCREASE_K = 0.2
const BOX_SIZE = 40
const LINE_D = 50
const N = 50
const TRASHOLD_K = 0
const TRASHOLD_V = Math.floor(N * TRASHOLD_K)
const ti = []
for (let i = 0; i < N; i++) {
  ti.push((i + 1 + TRASHOLD_V) / (N + 2 * TRASHOLD_V))
}

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
      currentStroke: [],
      currentCurve: []
    }
    this.clearVectorDistMap()
  }

  componentDidMount () {
    this.context = this.canvas.getContext('2d')
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
    this.setState({
      isDrawing: true,
      currentStroke: [{ x, y, p: event.pressure }],
      currentCurve: [this.initCurveSegment(x, y)]
    })
    this.clearVectorDistMap()
  }

  upHandler = (event) => {
    this.termCurveSegment()
    const stroke = [...this.state.currentStroke, { x: event.offsetX, y: event.offsetY, p: event.pressure }]
    this.setState({
      isDrawing: false,
      strokes: [...this.state.strokes, stroke],
      currentStroke: []
    })
  }

  moveHandler = (event) => {
    if (this.state.isDrawing) {
      const x = event.offsetX
      const y = event.offsetY

      if (x > 0 && x < this.props.width && y > 0 && y < this.props.height) {
        const updateResult = this.updateCurveSegment(x, y, this.currentCurveSegment)
        if (updateResult !== SUCCESS) {
          this.termCurveSegment()
          this.clearVectorDistMap()
          const prevSegment = this.currentCurveSegment
          const nextSegment = this.initCurveSegment(prevSegment.c3.x, prevSegment.c3.y)
          if (updateResult === FAILURE) {
            const segment = this.currentCurveSegment
            nextSegment.constrained = true
            nextSegment.tangent = this.normalizePoint({
              x: segment.c3.x - segment.c2.x,
              y: segment.c3.y - segment.c2.y
            })
          } else if (updateResult === CORNER) {
            nextSegment.constrained = false
          }
          this.updateCurveSegment(x, y, nextSegment)
          this.setState({
            currentCurve: [...this.state.currentCurve, nextSegment]
          })
        }
        this.setState({
          currentStroke: [...this.state.currentStroke, { x, y, p: event.pressure }]
        })
      }
    }
  }

  updateCurveSegment (x, y, segment) {
    let prev = { x: segment.c3.x, y: segment.c3.y }
    let error = 0
    let nIteration = 0
    let p = { x: 0, y: 0 }
    let dp = { x: 0, y: 0 }
    let projection = 0
    let v = {
      x: (segment.c3.x - segment.c0.x) / 3,
      y: (segment.c3.y - segment.c0.y) / 3
    }

    if (this.testCorner(x, y, segment)) {
      return CORNER
    }

    segment.save = { c1: segment.c1, c2: segment.c2, c3: segment.c3 }

    segment.c3 = { x, y }
    segment.c2 = {
      x: segment.c2.x + (x - prev.x),
      y: segment.c2.y + (y - prev.y)
    }

    if (this.pointLength(v) < LINE_D) {
      segment.c2.x = segment.c3.x - v.x
      segment.c2.y = segment.c3.y - v.y

      if (segment.constrained) {
        projection = segment.tangent.x * v.x + segment.tangent.y * v.y
        v = {
          x: projection * segment.tangent.x,
          y: projection * segment.tangent.y
        }
      }

      segment.c1.x = segment.c0.x + v.x
      segment.c1.y = segment.c0.y + v.y
    }

    this.renderLineCell(prev.x, prev.y, x, y, BOX_SIZE)
    this.renderPointCell(prev.x, prev.y, BOX_SIZE)

    do {
      let f1 = { x: 0, y: 0 }
      let f2 = { x: 0, y: 0 }
      let d = 0
      error = 0

      for (let i = 0; i < N; i += 1) {
        p = this.calc(segment, ti[i])
        dp = this.interpVectorDist(p.x, p.y)
        d = this.pointLength(dp)
        if (d > error) error = d
        error += d

        f1.x += 6 * ti[i] * (1 - ti[i]) * (1 - ti[i]) * d * dp.x / N
        f1.y += 6 * ti[i] * (1 - ti[i]) * (1 - ti[i]) * d * dp.y / N
        f2.x += 6 * ti[i] * ti[i] * (1 - ti[i]) * d * dp.x / N
        f2.y += 6 * ti[i] * ti[i] * (1 - ti[i]) * d * dp.y / N
      }

      error /= N

      if (segment.constrained) {
        projection = segment.tangent.x * f1.x + segment.tangent.y * f1.y
        f1 = {
          x: projection * segment.tangent.x,
          y: projection * segment.tangent.y
        }
      }

      segment.c1.x = segment.c1.x - INCREASE_K * f1.x
      segment.c1.y = segment.c1.y - INCREASE_K * f1.y
      segment.c2.x = segment.c2.x - INCREASE_K * f2.x
      segment.c2.y = segment.c2.y - INCREASE_K * f2.y

      nIteration++
    } while ((nIteration < MAX_N_ITERATION))

    if (error < MAX_ERROR) {
      delete segment.save
      return SUCCESS
    } else {
      if (segment.save) {
        segment.c1 = segment.save.c1
        segment.c2 = segment.save.c2
        segment.c3 = segment.save.c3
        delete segment.save
      }
      return FAILURE
    }
  }

  calc (seg, t) {
    const x = seg.c0.x * (1 - t) * (1 - t) * (1 - t) +
          3 * seg.c1.x * t * (1 - t) * (1 - t) +
          3 * seg.c2.x * t * t * (1 - t) +
              seg.c3.x * t * t * t
    const y = seg.c0.y * (1 - t) * (1 - t) * (1 - t) +
          3 * seg.c1.y * t * (1 - t) * (1 - t) +
          3 * seg.c2.y * t * t * (1 - t) +
              seg.c3.y * t * t * t
    return { x, y }
  }

  interpVectorDist (x, y) {
    const x1 = Math.floor(x)
    const y1 = Math.floor(y)
    const x2 = x1 + 1
    const y2 = y1 + 1
    const Q11 = this.vectorDistMap[y1][x1]
    const Q21 = this.vectorDistMap[y1][x2]
    const Q12 = this.vectorDistMap[y2][x1]
    const Q22 = this.vectorDistMap[y2][x2]

    return {
      x: Q11.x * (x2 - x) * (y2 - y) +
         Q21.x * (x - x1) * (y2 - y) +
         Q12.x * (x2 - x) * (y - y1) +
         Q22.x * (x - x1) * (y - y1),
      y: Q11.y * (x2 - x) * (y2 - y) +
         Q21.y * (x - x1) * (y2 - y) +
         Q12.y * (x2 - x) * (y - y1) +
         Q22.y * (x - x1) * (y - y1)
    }
  }

  clearVectorDistMap () {
    const w = Math.floor(this.props.width)
    const h = Math.floor(this.props.height)
    this.vectorDistMap = []
    this.rasterBorder = {
      minx: 0,
      miny: 0,
      maxx: 0,
      maxy: 0
    }
    for (let i = 0; i < h; i++) {
      const row = []
      for (let j = 0; j < w; j++) {
        const nullPoint = { x: 0, y: 0 }
        nullPoint.nil = true
        row.push(nullPoint)
      }
      this.vectorDistMap.push(row)
    }
  }

  getDistanceVectorLine (n, p, xPrev, yPrev) {
    const distance = n.x * (p.x - xPrev) + n.y * (p.y - yPrev)
    return { x: n.x * distance, y: n.y * distance }
  }

  getDistanceDeffVectorLine (points, x, y, xPrev, yPrev, n) {
    var distance, dy, dx

    if (points.length > 1) {
      distance = this.getDistanceVectorLine(n, points[0], xPrev, yPrev)
      dy = this.getDistanceVectorLine(n, { x: points[0].x, y: points[0].y + 1 }, xPrev, yPrev)
      dx = this.getDistanceVectorLine(n, { x: points[0].x + 1, y: points[0].y }, xPrev, yPrev)

      return {
        fx: { x: dx.x - distance.x, y: dy.x - distance.x },
        fy: { x: dx.y - distance.y, y: dy.y - distance.y }
      }
    } else {
      return {
        fx: { x: 0, y: 0 },
        fy: { x: 0, y: 0 }
      }
    }
  }

  getDistanceVectorPoint (xPrev, yPrev, p) {
    return { x: p.x - xPrev, y: p.y - yPrev }
  }

  getDistanceDeffVectorPoint (points, xPrev, yPrev) {
    var distance, dy, dx

    if (points.length > 1) {
      distance = this.getDistanceVectorPoint(xPrev, yPrev, points[0])
      dy = this.getDistanceVectorPoint(xPrev, yPrev, { x: points[0].x, y: points[0].y + 1 })
      dx = this.getDistanceVectorPoint(xPrev, yPrev, { x: points[0].x + 1, y: points[0].y })

      return {
        fx: { x: dx.x - distance.x, y: dy.x - distance.x },
        fy: { x: dx.y - distance.y, y: dy.y - distance.y }
      }
    } else {
      return {
        fx: { x: 0, y: 0 },
        fy: { x: 0, y: 0 }
      }
    }
  }

  processPoints (points, dV, oV, n, xPrev, yPrev) {
    for (let i = 0; i < points.length - 1; i++) {
      const v = {
        x: oV.x + (points[i + 1].x - points[0].x) * dV.fx.x +
                  (points[i + 1].y - points[0].y) * dV.fx.y,
        y: oV.y + (points[i + 1].x - points[0].x) * dV.fy.x +
                  (points[i + 1].y - points[0].y) * dV.fy.y
      }

      try {
        if (this.vectorDistMap[points[i + 1].y][points[i + 1].x].nil === true) {
          this.vectorDistMap[points[i + 1].y][points[i + 1].x] = v
          this.vectorDistMap[points[i + 1].y][points[i + 1].x].nil = false
        } else {
          if (this.pointLength(this.vectorDistMap[points[i + 1].y][points[i + 1].x]) > this.pointLength(v)) {
            this.vectorDistMap[points[i + 1].y][points[i + 1].x] = v
          }
        }
      } catch (e) {
      }
    }
  }

  renderLineCell (xPrev, yPrev, x, y, fieldRadius) {
    const n = this.normalizePoint({
      x: y - yPrev,
      y: -(x - xPrev)
    })
    const nF = {
      x: n.x * fieldRadius,
      y: n.y * fieldRadius
    }
    const edges = []
    edges.push({ p1: { x: x + nF.x, y: y + nF.y }, p2: { x: xPrev + nF.x, y: yPrev + nF.y } })
    edges.push({ p1: { x: xPrev + nF.x, y: yPrev + nF.y }, p2: { x: xPrev - nF.x, y: yPrev - nF.y } })
    edges.push({ p1: { x: xPrev - nF.x, y: yPrev - nF.y }, p2: { x: x - nF.x, y: y - nF.y } })
    edges.push({ p1: { x: x - nF.x, y: y - nF.y }, p2: { x: x + nF.x, y: y + nF.y } })
    const points = this.rasterize(edges)
    if (points.length > 0) {
      const dV = this.getDistanceDeffVectorLine(points, x, y, xPrev, yPrev, n)
      const oV = this.getDistanceVectorLine(n, points[0], xPrev, yPrev)
      this.processPoints(points, dV, oV, n, xPrev, yPrev)
    }
  }

  renderPointCell (xPrev, yPrev, fieldRadius) {
    const edges = []
    edges.push({ p1: { x: xPrev - fieldRadius, y: yPrev + fieldRadius }, p2: { x: xPrev + fieldRadius, y: yPrev + fieldRadius } })
    edges.push({ p1: { x: xPrev + fieldRadius, y: yPrev + fieldRadius }, p2: { x: xPrev + fieldRadius, y: yPrev - fieldRadius } })
    edges.push({ p1: { x: xPrev + fieldRadius, y: yPrev - fieldRadius }, p2: { x: xPrev - fieldRadius, y: yPrev - fieldRadius } })
    edges.push({ p1: { x: xPrev - fieldRadius, y: yPrev - fieldRadius }, p2: { x: xPrev - fieldRadius, y: yPrev + fieldRadius } })
    const points = this.rasterize(edges)
    if (points.length > 0) {
      const dV = this.getDistanceDeffVectorPoint(points, xPrev, yPrev)
      const oV = this.getDistanceVectorPoint(xPrev, yPrev, points[0])
      this.processPoints(points, dV, oV, null, xPrev, yPrev)
    }
  }

  rasterize (edges) {
    let points = []
    let ymax = 0
    let ymin = this.props.height

    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i]
      if (edge.p1.y > edge.p2.y) {
        const temp = edge.p2
        edge.p2 = edge.p1
        edge.p1 = temp
      }

      if (edge.p1.y < ymin) {
        ymin = edge.p1.y
      }

      if (edge.p2.y > ymax) {
        ymax = edge.p2.y
      }

      edge.startY = this.props.height - Math.floor(this.props.height - edge.p1.y)
      edge.k = (edge.p2.x - edge.p1.x) / (edge.p2.y - edge.p1.y)
      edge.startX = edge.p1.x + (edge.startY - edge.p1.y) * edge.k
      edge.stopY = Math.floor(edge.p2.y)
    }

    for (let i = edges.length - 1; i >= 0; i--) {
      if (edges[i].p1.y === edges[i].p2.y) {
        edges.splice(i, 1)
      }
    }

    ymax = Math.floor(ymax)
    ymin = this.props.height - Math.floor(this.props.height - ymin)
    const ET = []
    for (let i = 0; i < edges.length; i++) {
      const index = edges[i].startY - ymin
      if (typeof ET[index] === 'undefined') {
        ET[index] = []
      }
      ET[index].push(edges[i])
    }

    let SLB = []
    for (let i = ymin; i <= ymax; i++) {
      for (let j = SLB.length - 1; j >= 0; j--) {
        SLB[j].startX += SLB[j].k
      }

      if ((typeof ET[i - ymin] !== 'undefined') && (ET[i - ymin].length > 0)) {
        SLB = SLB.concat(ET[i - ymin])
        SLB.sort(function (a, b) {
          if (a.startX - b.startX !== 0) {
            return a.startX - b.startX
          } else {
            return a.p2.x - b.p2.x
          }
        })
      }

      for (let j = SLB.length - 1; j >= 0; j--) {
        if (SLB[j].stopY === i) {
          SLB.splice(j, 1)
        }
      }

      if (SLB.length > 1) {
        let pixelIterator = Math.round(SLB[0].startX)
        let SLBIterator = 1
        let activeFlag = true

        do {
          if (activeFlag) {
            points.push({x: pixelIterator, y: i})
            if (pixelIterator > this.rasterBorder.maxx) {
              this.rasterBorder.maxx = pixelIterator
            }
            if (pixelIterator < this.rasterBorder.minx) {
              this.rasterBorder.minx = pixelIterator
            }
            if (i > this.rasterBorder.maxy) {
              this.rasterBorder.maxy = i
            }
            if (i < this.rasterBorder.miny) {
              this.rasterBorder.miny = i
            }
          }
          pixelIterator++

          if ((activeFlag) && (pixelIterator > Math.round(SLB[SLBIterator].startX)) ||
                       (!activeFlag) && (pixelIterator >= Math.round(SLB[SLBIterator].startX))) {
            SLBIterator++
            activeFlag = !activeFlag
          }
        } while (SLBIterator < SLB.length)
      }
    }
    return points
  }

  termCurveSegment () {
  }

  get currentCurveSegment () {
    return this.state.currentCurve[this.state.currentCurve.length - 1]
  }

  initCurveSegment (x, y) {
    return {
      c0: { x, y },
      c1: { x, y },
      c2: { x, y },
      c3: { x, y }
    }
  }

  normalizePoint (point) {
    const length = this.pointLength(point)
    return {
      x: point.x / length,
      y: point.y / length
    }
  }

  pointLength (point) {
    return Math.sqrt(point.x * point.x + point.y * point.y)
  }

  testCorner (x, y, segment) {
    const p1 = { x: segment.c2.x - segment.c3.x, y: segment.c2.y - segment.c3.y }
    const p2 = { x: x - segment.c3.x, y: y - segment.c3.y }
    const angle = this.vectorAngle(p1, p2)
    return angle > MAX_ANGLE
  }

  vectorAngle (v1, v2) {
    const d1 = this.pointLength(v1)
    const d2 = this.pointLength(v2)
    return Math.acos(v1.x * v2.x + v1.y * v2.y / (d1 * d2))
  }

  draw = () => {
    const ctx = this.context
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    const strokes = this.state.strokes
    for (let i = 0; i < strokes.length; i++) {
      this.drawStroke(strokes[i], 'purple', ctx)
    }
    this.drawStroke(this.state.currentStroke, 'orange', ctx)

    for (let i = 0; i < this.state.currentCurve.length; i++) {
      const segment = this.state.currentCurve[i]

      ctx.fillStyle = 'green'
      ctx.beginPath()
      ctx.arc(segment.c0.x, segment.c0.y, 2, 0, Math.PI * 2)
      ctx.arc(segment.c3.x, segment.c3.y, 2, 0, Math.PI * 2)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = 'blue'
      ctx.beginPath()
      ctx.arc(segment.c1.x, segment.c1.y, 2, 0, Math.PI * 2)
      ctx.arc(segment.c2.x, segment.c2.y, 2, 0, Math.PI * 2)
      ctx.closePath()
      ctx.fill()

      ctx.strokeStyle = '#999'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(segment.c1.x, segment.c1.y)
      ctx.lineTo(segment.c0.x, segment.c0.y)
      ctx.stroke()
      ctx.closePath()

      ctx.strokeStyle = '#999'
      ctx.beginPath()
      ctx.moveTo(segment.c2.x, segment.c2.y)
      ctx.lineTo(segment.c3.x, segment.c3.y)
      ctx.stroke()
      ctx.closePath()

      ctx.strokeStyle = 'red'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(segment.c0.x, segment.c0.y)
      ctx.bezierCurveTo(segment.c1.x, segment.c1.y,
                        segment.c2.x, segment.c2.y,
                        segment.c3.x, segment.c3.y)
      ctx.stroke()
      ctx.closePath()
    }
  }

  drawStroke = (stroke, color, ctx) => {
    ctx.fillStyle = color
    for (let j = 0; j < stroke.length; j++) {
      const { x, y, p } = stroke[j]
      ctx.beginPath()
      ctx.arc(x, y, 2 * p, 0, Math.PI * 2)
      ctx.fill()
    }

    if (stroke[0]) {
      ctx.lineWidth = 0.5
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
