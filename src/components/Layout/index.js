import React, { Component, PropTypes as T } from 'react'
import classNames from 'classnames/bind'
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
            <div className={style.name} />
            <div className={cx('visible', 'toggle')}><i /></div>
            <div className={cx('ghosted', 'toggle')}><i /></div>
          </div>
          <div className={style.timeline}>
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div className={style.current}>5</div>
            <div>6</div>
            <div>7</div>
            <div>8</div>
            <div>9</div>
            <div>10</div>
            <div>11</div>
            <div>12</div>
          </div>
        </header>
        <ul className={style.layers}>
          <li className={style.layer}>
            <div className={style.meta}>
              <div className={style.name}>Layer Name</div>
              <div className={style.toggle}><i className={cx('enabled')} /></div>
              <div className={style.toggle}><i className={cx('disabled')} /></div>
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
