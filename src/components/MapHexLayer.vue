<template>
  <div ref="mapEl" style="width:100%;height:100%"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import maplibregl from 'maplibre-gl'

const props = defineProps({
  data: { type: [String, Object], required: true },

  mapStyle: {
    type: [String, Object],
    default: () => ({
      version: 8,
      sources: {
        osm: {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256
        }
      },
      layers: [{ id: 'osm', type: 'raster', source: 'osm' }]
    })
  },

  valueField: { type: String, default: 'E_PM' },
  breaks: { type: Array, default: () => [5, 7, 9, 11] },
  colors: { type: Array, default: () => ['#2c7bb6', '#abd9e9', '#ffffbf', '#fdae61', '#d7191c'] },
  center: { type: Array, default: () => [-98.5795, 39.8283] },
  zoom: { type: Number, default: 3.4 },
  sourceId: { type: String, default: 'src' },
  layerId: { type: String, default: 'fill' },

  // optional filter expression from parent
  filter: { type: [Array, Boolean, null], default: null }
})

const mapEl = ref(null)
let map

const colorExpr = (f, b, c) => {
  const e = ['step', ['get', f], c[0]]
  b.forEach((brk, i) => e.push(brk, c[i + 1]))
  return e
}


function applyFilter() {
  if (map && map.getLayer(props.layerId)) {
    map.setFilter(props.layerId, props.filter ?? true)
  }
}

function updatePaint() {
  if (!map || !map.getLayer(props.layerId)) return
  // repaint with current factor / breaks / colors
  map.setPaintProperty(
    props.layerId,
    'fill-color',
    colorExpr(props.valueField, props.breaks, props.colors)
  )
  // apply filter if present
  map.setFilter(props.layerId, props.filter ?? true)
}

onMounted(() => {
  map = new maplibregl.Map({
    container: mapEl.value,
    style: props.mapStyle,         // 🔁 use mapStyle
    center: props.center,
    zoom: props.zoom
  })

  map.on('error', e => console.error('MapLibre error:', e?.error || e))

  map.on('load', () => {
    map.addSource(props.sourceId, { type: 'geojson', data: props.data })

    map.addLayer({
      id: props.layerId,
      type: 'fill',
      source: props.sourceId,
      paint: {
        'fill-color': colorExpr(props.valueField, props.breaks, props.colors),
        'fill-opacity': 0.85
      }
    })

    // optional semi-transparent overlay to show hex footprint
    map.addLayer({
      id: 'hex-overlay',
      type: 'line',
      source: props.sourceId,
      paint: { 'line-color': '#000', 'line-opacity': 0.08, 'line-width': 0.6 }
    })

    applyFilter()           // ✅ apply after the layer exists
    setTimeout(() => map.resize(), 0)
  })
})

watch(
  () => [props.valueField, JSON.stringify(props.breaks), JSON.stringify(props.colors), JSON.stringify(props.filter)],
  () => updatePaint()
)

onBeforeUnmount(() => map?.remove())
</script>
