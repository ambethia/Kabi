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

export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state
  }
}
