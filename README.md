# Kabi

Proposed schema for application state:

The `animation` part of the state is probably suitable for serializing into files.

```
{
  controls: {
    playing: Boolean,
    looping: Boolean,
    ghosting: Boolean,
    currentFrame: Integer,
    currentTool: String,
    currentLayer: Integer,
    totalFrames: Integer,
    loopFrom: Integer,
    loopTo: Integer
  },
  animation: {
    fps: Float,
    width: Integer,
    height: Integer,
    backgroundColor: String,
    layers: [
      {
        name: String,
        color: String,
        visible: Boolean,
        ghosted: Boolean,
        cels: [
          {
            key: Boolean,
            from: Integer,
            to: Integer,
            strokes: [
              [x:Integer, y:Integer, p:Float, t:Integer],
              ...
            ]
          },
          ...
        ]
      },
      ...
    ]
  }
}
```

Other parts of state for later revisions:

- Zoom in and out of canvas
- Pan around canvas (useful while zoomed)
- Rotation, to draw on canvas at different angles
