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

export const setLoopTo = (frame) => ({
  type: 'SET_LOOP_TO',
  frame
})

export const setLoopFrom = (frame) => ({
  type: 'SET_LOOP_FROM',
  frame
})

export const createLayer = (count) => ({
  type: 'CREATE_LAYER',
  count
})

export const deleteLayer = (index) => ({
  type: 'DELETE_LAYER',
  index
})

export const setLayer = (index) => ({
  type: 'SET_LAYER',
  index
})

export const updateLayer = (index, name, color) => ({
  type: 'UPDATE_LAYER',
  index,
  name,
  color
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

export const openModal = (name, data) => ({
  type: 'OPEN_MODAL',
  name,
  data
})

export const closeModal = () => ({
  type: 'CLOSE_MODAL'
})

export const saveDocument = () => ({
  type: 'SAVE_DOCUMENT'
})

export const loadDocument = () => ({
  type: 'LOAD_DOCUMENT'
})

export const newDocument = () => ({
  type: 'NEW_DOCUMENT'
})
