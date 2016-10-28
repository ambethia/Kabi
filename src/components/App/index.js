import React from 'react'
import Canvas from '../Canvas'
import Controls from '../../containers/Controls'
import Timeline from '../../containers/Timeline'
import style from './screen.sass'

const App = () => (
  <div className={style.app}>
    <main>
      <Canvas width={1920 / 2} height={1080 / 2} />
    </main>
    <nav>
      <Controls />
      <Timeline />
    </nav>
  </div>
)

export default App
