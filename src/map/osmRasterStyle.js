export const OSM_RASTER_LIGHT = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256
    }
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
      paint: {
        // make base map brighter, lower-contrast, lower-saturation
        'raster-brightness-min': 0.95,
        'raster-brightness-max': 1.10,
        'raster-contrast': -0.25,
        'raster-saturation': -0.35
      }
    }
  ]
}