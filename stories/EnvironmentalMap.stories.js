// stories/EnvironmentalMap.stories.js  (root-level /stories)
import EnvironmentalMap from '../src/components/EnvironmentalMap.vue';
import { MAP_STYLE } from '../src/config/mapStyle';
const OSM_RASTER_STYLE = {
  version: 8,
  sources: {
    osm: { type: 'raster', tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256 },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
};

export default {
  title: 'Maps/Environmental Map',
  component: EnvironmentalMap,
  parameters: { layout: 'fullscreen' },
  decorators: [() => ({ template: '<div style="height:90vh;min-height:600px"><story/></div>' })],
  mapStyle: MAP_STYLE,
};

export const Default = {
  args: {
    data: 'chel2022_wgs84.geojson',  // relative path - resolves against current page (works on GitHub Pages subpath)
    initialFactorId: '',  // No default selection - user must choose a variable
    center: [-98.6, 39.8],
    zoom: 3.4,
    style: OSM_RASTER_STYLE,
  },
  render: (args) => ({
    components: { EnvironmentalMap },
    setup() { return { args }; },
    template: '<EnvironmentalMap v-bind="args" />',
  }),
};
