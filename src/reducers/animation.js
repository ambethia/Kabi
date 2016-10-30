const initialState = {
  fps: 24,
  width: 1922 / 2,
  height: 1080 / 2,
  backgroundColor: '#ccc',
  layers: [{
    name: 'Layer 1',
    color: '#333',
    cels: [],
    visible: true,
    ghosted: false
  }]
}

// TODO: Figure out nested reducers (for layers -> cels -> strokes)
export default (state = initialState, action) => {
  let layer, index, cel
  layer = state.layers[action.layer]
  if (layer) {
    index = layer.cels.findIndex((cel) => {
      return cel.from <= action.frame && action.frame <= cel.to
    })
    cel = layer.cels[index] || {
      key: false,
      from: action.frame,
      to: action.frame,
      strokes: []
    }
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
    default:
      return state
  }
}
