const initialState = {
  playing: false,
  looping: false,
  ghosting: true,
  currentFrame: 1,
  totalFrames: 32,
  loopFrom: 4,
  loopTo: 8
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_PLAYBACK':
      return { ...state, playing: !state.playing }
    case 'TOGGLE_LOOPING':
      return { ...state, looping: !state.looping }
    case 'TOGGLE_GHOSTING':
      return { ...state, ghosting: !state.ghosting }
    default:
      return state
  }
}
