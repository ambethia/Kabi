# Kabi

Proposed schema for application state:

```
{
  controls: {
    playing: Boolean,
    looping: Boolean,
    currentFrame: Integer,
    loopFrom: Integer,
    loopTo: Integer,
    ghosting: Boolean
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
        cels: [
          {
            key: Boolean,
            from: Integer,
            to: Integer,
            strokes: [
              [x:Integer, y:Integer, pressure:Float],
              ...
            ]
          },
          ...
        ],
        visible: Boolean,
        ghosted: Boolean
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
