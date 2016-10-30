export const togglePlayback = () => ({
  type: 'TOGGLE_PLAYBACK'
})

export const resetPlayback = () => ({
  type: 'RESET_PLAYBACK'
})

export const toggleLooping = () => ({
  type: 'TOGGLE_LOOPING'
})

export const toggleGhosting = () => ({
  type: 'TOGGLE_GHOSTING'
})

export const setFrame = (frame) => ({
  type: 'SET_FRAME',
  frame
})

export const createLayer = () => ({
  type: 'CREATE_LAYER'
})

export const deleteLayer = (index) => ({
  type: 'DELETE_LAYER',
  index
})

export const setLayer = (index) => ({
  type: 'SET_LAYER',
  index
})

export const toggleLayerVisibility = (index) => ({
  type: 'TOGGLE_LAYER_VISIBILITY',
  index
})

export const toggleLayerGhosting = (index) => ({
  type: 'TOGGLE_LAYER_GHOSTING',
  index
})

export const createStroke = (stroke, frame, layer) => ({
  type: 'CREATE_STROKE',
  stroke,
  frame,
  layer
})

export const deleteStroke = (index, frame, layer) => ({
  type: 'DELETE_STROKE',
  index,
  frame,
  layer
})

export const setTool = (tool) => ({
  type: 'SET_TOOL',
  tool
})
