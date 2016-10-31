const initialState = {
  playing: false,
  looping: false,
  ghosting: true,
  currentFrame: 1,
  currentTool: 'brush',
  currentLayer: 0,
  totalFrames: 64,
  loopFrom: 1,
  loopTo: 8
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
    case 'SET_LAYER':
      return { ...state, currentLayer: action.index }
    case 'SET_TOOL':
      return { ...state, currentTool: action.tool }
    default:
      return state
  }
}
