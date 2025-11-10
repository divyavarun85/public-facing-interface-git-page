<template>
  <div ref="mapEl" style="width:100%;height:100%"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import maplibregl from 'maplibre-gl'

const props = defineProps({
  data: { type: [String, Object], required: true },
  mapStyle: { type: [String, Object], required: true },

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

function findFirstLabelLayerId() {
  const style = map.getStyle()
  if (!style?.layers) return undefined
  // Heuristic: first symbol layer with a text-field
  const sym = style.layers.find(
    l => l.type === 'symbol' && l.layout && l.layout['text-field']
  )
  return sym?.id
}


function applyFilter() {
  if (map && map.getLayer(props.layerId)) {
    map.setFilter(props.layerId, props.filter ?? true)
  }
}

function updatePaint() {
  if (!map || !map.getLayer(props.layerId)) return
  map.setPaintProperty(props.layerId, 'fill-color',
    colorExpr(props.valueField, props.breaks, props.colors)
  )
  applyFilter()
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
    const beforeId = findFirstLabelLayerId() // 👈 place under labels

    map.addSource(props.sourceId, { type: 'geojson', data: props.data })

    // Hex fill BELOW labels
    map.addLayer({
      id: props.layerId,
      type: 'fill',
      source: props.sourceId,
      paint: {
        'fill-color': colorExpr(props.valueField, props.breaks, props.colors),
        'fill-opacity': 0.6   // tweak for readability
      }
    }, beforeId)

    // Optional thin outline, also below labels
    map.addLayer({
      id: 'hex-outline',
      type: 'line',
      source: props.sourceId,
      paint: { 'line-color': '#000', 'line-opacity': 0.10, 'line-width': 0.6 }
    }, beforeId)

    applyFilter()
    setTimeout(() => map.resize(), 0)
  })

})

watch(
  () => [props.valueField, JSON.stringify(props.breaks), JSON.stringify(props.colors), JSON.stringify(props.filter)],
  () => updatePaint()
)

onBeforeUnmount(() => map?.remove())
</script>
