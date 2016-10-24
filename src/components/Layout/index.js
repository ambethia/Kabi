import React, { Component } from 'react'
import classNames from 'classnames/bind'
import style from './screen.sass'

const cx = classNames.bind(style)

class Layout extends Component {

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
            <div className={style.frame}>1</div>
            <div className={style.frame}>2</div>
            <div className={style.frame}>3</div>
            <div className={cx('frame', 'current')}>4</div>
            <div className={style.frame}>5</div>
            <div className={style.frame}>6</div>
            <div className={style.frame}>7</div>
            <div className={style.frame}>8</div>
          </div>
        </header>
        <ul className={style.layers}>
          <li className={style.layer}>
            <div className={style.meta}>
              <div className={style.name}>Layer Name</div>
              <div className={style.toggle}><i className={cx('enabled')} /></div>
              <div className={style.toggle}><i className={cx('disabled')} /></div>
            </div>
            <div className={style.timeline}>
              <div className={style.frame} />
              <div className={style.frame} />
              <div className={style.frame} />
              <div className={cx(style.frame, style.current)} />
              <div className={style.frame} />
              <div className={style.frame} />
              <div className={style.frame} />
              <div className={style.frame} />
            </div>
          </li>
        </ul>
      </div>
    </div>
  }
}

export default Layout
