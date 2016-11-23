# Kabi

An app for sketching simple frame-by-frame animations.

## Features

- Pressure sensitive (in Chrome 54+) sketching tool
- Eraser tool (removes full strokes)
- Layers, with choosable color per layer
- Toggle visibility of layers
- Ghosting/Onion Skinning (per layer control)
- Looping playback (partially implemented)

## Planned Features

- Saving and loading of animation
- Adjust looping range (currently fixed to 1-8)
- User defined FPS/timing
- Keyboard shortcuts for tool switching and navigating timeline/layers
- Export rendered animation as a series of images or animated gif
- Standalone Electron app
- Persistence to cloud storage (for authenticated web users)
- Persistence to local storage (for anonymous web users)
- Persistence to file (for desktop users)
- Adjustable range of ghosted frames (current fixed to +/- 2)
- Adjustable canvas size
- Adjustable brush size
- Vertical resize of bottom timeline/controls
- Zoom in and out of canvas
- Pan around canvas (useful while zoomed)
- Rotation, to draw on canvas at different angles
- Trim eraser (don't erased full stroke, only erase up to the next intersecting stroke)
- Standard eraser (don't erase full stroke, only the portion covered by eraser, maybe just by splitting segments)
- Adjust duration of cels by dragging handles that appear on hover
- Move cels between frames and layers with drag and drop
- Easy timeline scrubbing (click and drag playhead marker back and forth)
- Audio loading, playback, and waveform visualization
- Sharing, e.g. Imgur, Instagram, etc.

## Known Issues

- Duration of timeline should extend dynamically (fixed to 64)
- Current layer should render on top of all ghosted layers (current it's between past and future layers)
- Erasing all of the strokes in a given frame should remove the cel from the timeline.
- Relies exclusively on `PointerEvent`, should refactor to fall back to `MouseEvent`
- Redux dev tools seem to seriously affect performance
