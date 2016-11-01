import React, { PropTypes as T } from 'react'
import IconButton from '../IconButton'
import LayerView from './LayerView'
import style from './screen.sass'

const ControlsView = ({ controls, animation, actions }) => (
  <div className={style.controls}>
    <header>
      <div className={style.layerControls}>
        <IconButton
          glyph='add'
          onClick={() => actions.onCreateLayer(animation.layers.length)}
        />
        <IconButton
          glyph='trash'
          disabled={animation.layers.length <= 1}
          onClick={() => actions.onDeleteLayer(controls.currentLayer)}
        />
      </div>
      <div className={style.playbackControls}>
        <IconButton
          glyph={controls.playing ? 'pause' : 'play'}
          active={controls.playing}
          onClick={actions.onTogglePlayback}
        />
        <IconButton
          glyph='loop'
          active={controls.looping}
          onClick={actions.onToggleLooping}
        />
        <IconButton
          glyph='ghost'
          active={controls.ghosting}
          onClick={actions.onToggleGhosting}
        />
      </div>
    </header>
    <ul className={style.layers}>
      {animation.layers.map((layer, i) => (
        <LayerView
          {...layer}
          current={controls.currentLayer === i}
          onSetLayer={() => actions.onSetLayer(i)}
          onEditLayer={() => actions.onEditLayer(i)}
          onToggleVisibilty={() => actions.onToggleLayerVisibility(i)}
          onToggleGhosting={() => actions.onToggleLayerGhosting(i)}
          key={i}
        />
      ))}
    </ul>
  </div>
)

ControlsView.propTypes = {
  controls: T.object.isRequired,
  animation: T.object.isRequired,
  actions: T.object.isRequired
}

export default ControlsView
