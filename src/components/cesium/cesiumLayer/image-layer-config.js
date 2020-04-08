export const LayerConfig = [
  {
    'layerId': '1',
    'layerName': '铁路',
    'isChecked': false,
    'layerConfig': {
      'url': 'http://52.83.226.193:8080/geoserver/Infrastructure/wms',
      'type': 'WMS',
      'layers': 'Infrastructure:G_railway',
      'transparent': 'true',
      'format': 'image/png',
      'version': '1.1.0'
    },
    'styleConfig': {
      'styleType': 'default',
      'opacity': 100
    }
  },
  {
    'layerId': '2',
    'layerName': '高速公路',
    'isChecked': false
  },
  // {
  //   'layerId': '3',
  //   'layerName': '国道',
  //   'isChecked': false
  // },
  // {
  //   'layerId': '4',
  //   'layerName': '省道',
  //   'isChecked': false
  // },
  {
    'layerId': '5',
    'layerName': '全国道路',
    'isChecked': false,
    'layerConfig': {
      'url': 'http://10.35.191.14:8080/geoserver/Infrastructure/wms',
      'type': 'WMS',
      'layers': 'Infrastructure:Chind_road_line',
      'transparent': 'true',
      'format': 'image/png',
      'version': '1.1.0'
    },
    'styleConfig': {
      'styleType': 'default',
      'opacity': 100
    }
  },
  {
    'layerId': '6',
    'layerName': '线状水系',
    'isChecked': false,
    'layerConfig': {
      'url': 'http://10.35.191.14:8080/geoserver/topography/wms',
      'type': 'WMS',
      'layers': 'topography:C_river_line',
      'transparent': 'true',
      'format': 'image/png',
      'version': '1.1.0'
    },
    'styleConfig': {
      'styleType': 'default',
      'opacity': 100
    }
  },
  {
    'layerId': '7',
    'layerName': '面状水系',
    'isChecked': false,
    'layerConfig': {
      'url': 'http://10.35.191.14:8080/geoserver/topography/wms',
      'type': 'WMS',
      'layers': 'topography:C_river',
      'transparent': 'true',
      'format': 'image/png',
      'version': '1.1.0'
    },
    'styleConfig': {
      'styleType': 'default',
      'opacity': 100
    }
  },
  {
    'layerId': '8',
    'layerName': '居民区',
    'isChecked': false,
    'layerConfig': {
      'url': 'http://10.35.191.14:8080/geoserver/Infrastructure/wms',
      'type': 'WMS',
      'layers': 'Infrastructure:C_residential',
      'transparent': 'true',
      'format': 'image/png',
      'version': '1.1.0'
    },
    'styleConfig': {
      'styleType': 'default',
      'opacity': 100
    }
  }
]
  
  