import React, { Component, PropTypes as T } from 'react'
import classNames from 'classnames/bind'
import Icon from './Icon'
import Canvas from '../Canvas'
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
        <Canvas width={1920 / 2} height={1080 / 2} />
      </main>
      <div className={style.controls}>
        <header>
          <div className={style.meta}>
            <div className={style.layerControls}>
              <button><Icon glyph='add' /></button>
              <button><Icon glyph='trash' /></button>
            </div>
            <div className={style.playbackControls}>
              <button className={cx('toggle', 'enabled')}><Icon glyph='play' /></button>
              <button className={cx('toggle', 'disabled')}><Icon glyph='loop' /></button>
              <button className={cx('toggle', 'enabled')}><Icon glyph='ghost' /></button>
            </div>
          </div>
          <div className={style.timeline}>
            <div><span>1</span></div>
            <div><span>2</span></div>
            <div className={cx('loop')}><span>3</span></div>
            <div className={cx('loop')}><span>4</span></div>
            <div className={cx('loop', 'current')}><span>5</span></div>
            <div className={cx('loop')}><span>6</span></div>
            <div className={cx('loop')}><span>7</span></div>
            <div className={cx('loop')}><span>8</span></div>
            <div className={cx('loop')}><span>9</span></div>
            <div><span>10</span></div>
            <div><span>11</span></div>
            <div><span>12</span></div>
          </div>
        </header>
        <ul className={style.layers}>
          <li className={style.layer}>
            <div className={style.meta}>
              <div className={style.color}>
                <div className={style.swatch} style={{backgroundColor: '#333'}} />
              </div>
              <div className={style.name}>Layer 1</div>
              <button className={cx('toggle', 'enabled')}><Icon glyph='eye' /></button>
              <button className={cx('toggle', 'enabled')}><Icon glyph='ghost' /></button>
            </div>
            <div className={style.frames}>
              <div className={style.frame} style={this.frameStyle(1, 1)} />
              <div className={style.frame} style={this.frameStyle(2, 2)} />
              <div className={style.frame} style={this.frameStyle(4, 3)} />
              <div className={style.frame} style={this.frameStyle(7, 4)} />
            </div>
          </li>
          <li className={style.layer}>
            <div className={style.meta}>
              <div className={style.color}>
                <div className={style.swatch} style={{backgroundColor: '#600'}} />
              </div>
              <div className={style.name}>Layer 2</div>
              <button className={cx('toggle', 'enabled')}><Icon glyph='eye' /></button>
              <button className={cx('toggle', 'disabled')}><Icon glyph='ghost' /></button>
            </div>
            <div className={style.frames}>
              <div className={style.frame} style={this.frameStyle(2, 1)} />
              <div className={style.frame} style={this.frameStyle(3, 1)} />
              <div className={style.frame} style={this.frameStyle(5, 4)} />
              <div className={style.frame} style={this.frameStyle(9, 2)} />
            </div>
          </li>
        </ul>
      </div>
    </div>
  }
}

export default Layout
