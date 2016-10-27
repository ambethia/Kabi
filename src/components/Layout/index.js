import React, { Component, PropTypes as T } from 'react'
import classNames from 'classnames/bind'
import Icon from './Icon'
import style from './screen.sass'

const cx = classNames.bind(style)

class Layout extends Component {

  static propTypes = {
    frameWidth: T.number,
    baseDotSize: T.number
  }

  static defaultProps = {
    frameWidth: 1.5,
    baseDotSize: 1
  }

  frameStyle (position, length) {
    const frame = this.props.frameWidth
    const size = this.props.baseDotSize
    const left = `${frame * position - size / 2 - frame / 2}em`
    const width = `${size + frame * (length - 1)}em`
    return { left, width }
  }

  render () {
    return <div className={style.layout}>
      <main>
        <canvas />
      </main>
      <div className={style.controls}>
        <header>
          <div className={style.meta}>
            <button><Icon glyph='add' /></button>
            <button><Icon glyph='trash' /></button>
          </div>
          <div className={style.timeline}>
            <div><span>1</span></div>
            <div><span>2</span></div>
            <div><span>3</span></div>
            <div><span>4</span></div>
            <div className={style.current}><span>5</span></div>
            <div><span>6</span></div>
            <div><span>7</span></div>
            <div><span>8</span></div>
            <div><span>9</span></div>
            <div><span>10</span></div>
            <div><span>11</span></div>
            <div><span>12</span></div>
          </div>
        </header>
        <ul className={style.layers}>
          <li className={style.layer}>
            <div className={style.meta}>
              <div className={style.name}>Layer 1</div>
              <div className={style.toggle}><Icon glyph='eye' className={cx('enabled')} /></div>
              <div className={style.toggle}><Icon glyph='ghost' className={cx('disabled')} /></div>
            </div>
            <div className={style.frames}>
              <div className={style.frame} style={this.frameStyle(1, 1)} />
              <div className={style.frame} style={this.frameStyle(2, 2)} />
              <div className={style.frame} style={this.frameStyle(4, 3)} />
              <div className={style.frame} style={this.frameStyle(7, 4)} />
            </div>
          </li>
        </ul>
      </div>
    </div>
  }
}

export default Layout
