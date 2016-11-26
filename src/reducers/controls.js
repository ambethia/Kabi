const initialState = {
  playing: false,
  looping: false,
  ghosting: true,
  currentFrame: 1,
  currentTool: 'brush',
  currentLayer: 0,
  totalFrames: 64,
  loopFrom: 1,
  loopTo: 8,
  modalData: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_PLAYBACK':
      return { ...state, playing: !state.playing }
    case 'RESET_PLAYBACK':
      return { ...state, playing: false, currentFrame: 1 }
    case 'TOGGLE_LOOPING':
      return { ...state, looping: !state.looping }
    case 'TOGGLE_GHOSTING':
      return { ...state, ghosting: !state.ghosting }
    case 'SET_FRAME':
      return { ...state, currentFrame: action.frame }
    case 'SET_LOOP_FROM':
      return { ...state, loopFrom: action.frame }
    case 'SET_LOOP_TO':
      return { ...state, loopTo: action.frame }
    case 'SET_LAYER':
      return { ...state, currentLayer: action.index }
    case 'CREATE_LAYER':
      return { ...state, currentLayer: action.count }
    case 'DELETE_LAYER':
      return { ...state, currentLayer: 0 }
    case 'SET_TOOL':
      return { ...state, currentTool: action.tool }
    case 'OPEN_MODAL':
      const { name, data } = action
      return { ...state, modalData: { name, data } }
    case 'CLOSE_MODAL':
      return { ...state, modalData: {} }
    default:
      return state
  }
}
