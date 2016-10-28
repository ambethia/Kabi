import React, { PropTypes as T } from 'react'
import Canvas from '../../containers/Canvas'
import Controls from '../../containers/Controls'
import Timeline from '../../containers/Timeline'
import AnimationController from '../../containers/AnimationController'
import style from './screen.sass'

const AppView = ({ animation, controls }) => (
  <div className={style.app}>
    <AnimationController />
    <main>
      <Canvas width={animation.width} height={animation.height} />
    </main>
    <nav>
      <Controls />
      <Timeline />
    </nav>
  </div>
)

AppView.propTypes = {
  controls: T.object.isRequired,
  animation: T.object.isRequired,
  actions: T.object.isRequired
}

export default AppView
