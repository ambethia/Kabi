import React, { PropTypes as T } from 'react'
import style from './screen.sass'

const LayerListView = ({ layers, view }) => (
  <ul className={style.layers}>
    {layers.map((layer, i) => (
      React.createElement(view, { ...layer, key: i })
    ))}
  </ul>
)

LayerListView.propTypes = {
  layers: T.array,
  view: T.func
}

export default LayerListView
