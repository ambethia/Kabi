export const findCel = (layers, layerNumber, frameNumber) => {
  const layer = layers[layerNumber]
  if (layer) {
    return layer.cels.find((cel) => (
      cel.from <= frameNumber && frameNumber <= cel.to
    ))
  }
}
