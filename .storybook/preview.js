import 'maplibre-gl/dist/maplibre-gl.css'
import maplibregl from 'maplibre-gl'
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-csp-worker.js?url'

// Set worker URL so MapLibre works on GitHub Pages (subpath deployment)
maplibregl.setWorkerUrl(maplibreWorkerUrl)

export const parameters = {
  layout: 'fullscreen',
  viewMode: 'story',
  previewTabs: {
    'storybook/docs/panel': { hidden: true },
  },
  options: {
    showPanel: false,
    showNav: false,
    isFullscreen: true,
  },
}
