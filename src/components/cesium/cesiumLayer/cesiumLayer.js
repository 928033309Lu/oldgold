
import ImageLayerGroup from './image-layer-group'
import {
    loadLayerByConfig
  } from './layer-config-util'
const gwmap = {}
const layerDist = {}
let serviceLayerGroup = null
gwmap.loadServiceLayer = function (layerData) {
    if (!layerData || layerDist.hasOwnProperty(layerData.layerId)) return
    if (!serviceLayerGroup) {
      serviceLayerGroup = new ImageLayerGroup(window.viewer.viewer)
      serviceLayerGroup.bringToBack()
    }
  
    const layer = loadLayerByConfig(layerData)
    if (!layer) {
      return
    }
    serviceLayerGroup.addLayer(layer)
    layerDist[layerData.layerId] = layer
  }
gwmap.removeServiceLayer = function (layerData) {
    if (!layerData || !layerDist.hasOwnProperty(layerData.layerId)) return
  
    serviceLayerGroup.removeLayer(layerDist[layerData.layerId])
    delete layerDist[layerData.layerId]
}
export default gwmap