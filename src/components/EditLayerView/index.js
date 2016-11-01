import React, { Component, PropTypes as T } from 'react'
import style from './screen.sass'

class EditLayerView extends Component {

  static propTypes = {
    index: T.number.isRequired,
    name: T.string.isRequired,
    color: T.string.isRequired,
    onDismiss: T.func.isRequired,
    onUpdateLayer: T.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      name: props.name,
      ...this.parseColor(props.color)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.willDismiss) {
      this.props.onUpdateLayer(
        this.props.index,
        this.state.name,
        this.swatchColor
      )
      this.props.onDismiss()
    }
  }

  parseColor (color) {
    const [h, s, l, a] = color.match(/hsla\((.+),(.+)%,(.+)%,(.+)\)/).slice(1)
    return { h, s, l, a }
  }

  randomizeColor = (color) => {
    this.setState({
      h: Math.floor(Math.random() * 361),
      s: Math.floor(Math.random() * 101),
      l: Math.floor(Math.random() * 101)
    })
  }

  get swatchColor () {
    const { h, s, l, a } = this.state
    return `hsla(${h},${s}%,${l}%,${a})`
  }

  render () {
    return <table className={style.editLayer}>
      <caption>Edit Layer</caption>
      <tbody>
        <tr>
          <th>Name</th>
          <td>
            <input type='text'
              value={this.state.name}
              onChange={(e) => this.setState({ name: e.target.value })}
            />
          </td>
        </tr>
        <tr>
          <th>
            Color
            <div className={style.well}>
              <div
                className={style.swatch}
                style={{backgroundColor: this.swatchColor}}
                onClick={this.randomizeColor}
              />
            </div>
          </th>
          <td>
            <table className={style.colorPicker}>
              <tbody>
                <tr>
                  <th>H</th>
                  <td>
                    <input type='range'
                      value={this.state.h}
                      min={0}
                      max={360}
                      onChange={(e) => this.setState({ h: e.target.value })}
                    />
                  </td>
                </tr>
                <tr>
                  <th>S</th>
                  <td>
                    <input type='range'
                      value={this.state.s}
                      min={0}
                      max={100}
                      onChange={(e) => this.setState({ s: e.target.value })}
                    />
                  </td>
                </tr>
                <tr>
                  <th>L</th>
                  <td>
                    <input type='range'
                      value={this.state.l}
                      min={0}
                      max={100}
                      onChange={(e) => this.setState({ l: e.target.value })}
                    />
                  </td>
                </tr>
                <tr>
                  <th>A</th>
                  <td>
                    <input type='range'
                      value={this.state.a}
                      min={0}
                      max={1}
                      step={0.01}
                      onChange={(e) => this.setState({ a: e.target.value })}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  }
}

export default EditLayerView
