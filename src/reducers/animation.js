const newLayer = {
  name: 'Layer 1',
  color: '#333',
  visible: true,
  ghosted: true,
  cels: []
}

const newCell = {
  key: false,
  from: 1,
  to: 1,
  strokes: []
}

const initialState = {
  fps: 24,
  width: 1922 / 2,
  height: 1080 / 2,
  backgroundColor: '#ccc',
  layers: [
    Object.assign({}, newLayer)
  ]
}

// TODO: Figure out nested reducers (for layers -> cels -> strokes)
export default (state = initialState, action) => {
  let layer, index, cel
  layer = state.layers[action.layer]
  if (layer) {
    index = layer.cels.findIndex((cel) => {
      return cel.from <= action.frame && action.frame <= cel.to
    })
    cel = layer.cels[index] || Object.assign({}, newCell, {
      from: action.frame,
      to: action.frame
    })
  }

  switch (action.type) {
    case 'CREATE_STROKE':
      return {
        ...state,
        layers: [
          ...state.layers.slice(0, action.layer),
          {
            ...layer,
            cels: [
              ...layer.cels.slice(0, index),
              {
                ...cel,
                strokes: [
                  ...cel.strokes,
                  action.stroke
                ]
              },
              ...layer.cels.slice(index + 1)
            ]
          },
          ...state.layers.slice(action.layer + 1)
        ]
      }
    case 'DELETE_STROKE':
      return {
        ...state,
        layers: [
          ...state.layers.slice(0, action.layer),
          {
            ...layer,
            cels: [
              ...layer.cels.slice(0, index),
              {
                ...cel,
                strokes: [
                  ...cel.strokes.slice(0, action.index),
                  ...cel.strokes.slice(action.index + 1)
                ]
              },
              ...layer.cels.slice(index + 1)
            ]
          },
          ...state.layers.slice(action.layer + 1)
        ]
      }
    case 'CREATE_LAYER':
      const n = state.layers.length + 1
      return {
        ...state,
        layers: [
          ...state.layers,
          Object.assign({}, newLayer, {
            name: `Layer ${n}`
          })
        ]
      }
    case 'DELETE_LAYER':
      if (state.layers.length > 1) {
        return {
          ...state,
          layers: [
            ...state.layers.slice(0, action.index),
            ...state.layers.slice(action.index + 1)
          ]
        }
      } else {
        // Don't remove the last layer.
        return state
      }
    case 'TOGGLE_LAYER_VISIBILITY':
      return {
        ...state,
        layers: [
          ...state.layers.slice(0, action.index),
          {
            ...state.layers[action.index],
            visible: !state.layers[action.index].visible
          },
          ...state.layers.slice(action.index + 1)
        ]
      }
    case 'TOGGLE_LAYER_GHOSTING':
      return {
        ...state,
        layers: [
          ...state.layers.slice(0, action.index),
          {
            ...state.layers[action.index],
            ghosted: !state.layers[action.index].ghosted
          },
          ...state.layers.slice(action.index + 1)
        ]
      }
    default:
      return state
  }
}
