// src/utils/mockChel.js
import { hexGrid, centroid } from '@turf/turf'

// simple seeded RNG (LCG)
function rng(seed) {
  let s = seed >>> 0
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 0xffffffff
}

function clamp(x, a, b) { return Math.max(a, Math.min(b, x)) }

export function generateMockHexFC(cellKm = 75, seed = 42) {
  // Rough CONUS bbox: west, south, east, north
  const BBOX = [-125, 24, -66.5, 49.5]
  const grid = hexGrid(BBOX, cellKm, { units: 'kilometers' })
  const rand = rng(seed)

  grid.features = grid.features.map((f, i) => {
    const c = centroid(f).geometry.coordinates // [lon, lat]
    const [lon, lat] = c

    // synthetic gradients + noise to make maps look plausible
    const n1 = rand() * 2 - 1
    const n2 = rand() * 2 - 1
    const n3 = rand() * 2 - 1

    // PM2.5 ~ higher in East + industrial belt
    let E_PM = 6.5
      + 2.2 * ((-lon - 70) / 55)         // east heavier
      + 0.8 * Math.cos((lat + lon) / 10) // banding
      + 1.5 * n1                         // noise
    E_PM = clamp(Number(E_PM.toFixed(2)), 3.5, 14)

    // PM percentile 0..1
    let EPL_PM = clamp(((E_PM - 3.5) / (14 - 3.5)) + 0.1 * n2, 0, 1)
    EPL_PM = Number(EPL_PM.toFixed(4))

    // Ozone (ppm) ~ similar spatial pattern to PM, different scale
    let E_OZONE = 0.02 + 0.4 * ((-lon - 70) / 55) + 0.3 * Math.cos((lat + lon) / 10) + 0.2 * n1
    E_OZONE = clamp(Number(E_OZONE.toFixed(2)), 0, 2.5)
    let EPL_OZONE = clamp(((E_OZONE - 0) / 2.5) + 0.1 * n2, 0, 1)
    EPL_OZONE = Number(EPL_OZONE.toFixed(4))

    // Asthma prevalence (%) ~ correlate with PM + humidity band
    let EP_ASTHMA = 5.5 + 0.8 * E_PM + 2 * Math.sin((lat + 20) / 7) + 1.2 * n2
    EP_ASTHMA = clamp(Number(EP_ASTHMA.toFixed(1)), 4, 20)

    // Social vulnerability 0..10 ~ southeast + urban cores
    let SPL_SVM = 4.5
      + 2.5 * Math.max(0, (35 - Math.abs(lat - 33)) / 20) // SE band
      + 2.0 * Math.max(0, (-(Math.abs(lon + 90) - 15)) / 15) // Mississippi corridor
      + 1.5 * n3
    SPL_SVM = clamp(Number(SPL_SVM.toFixed(3)), 0, 10)

    // Total population (mock, thousands) heavier near coasts + corridors
    let E_TOTPOP = 150
      + 220 * Math.exp(-Math.pow((lat - 34) / 9, 2))  // sunbelt
      + 200 * Math.exp(-Math.pow((lat - 40) / 6, 2))  // rust belt
      + 260 * Math.exp(-Math.pow((lon + 73) / 5, 2))  // NE corridor
      + 180 * Math.exp(-Math.pow((lon + 118) / 5, 2)) // CA
      + 80 * n1
    E_TOTPOP = clamp(Number(E_TOTPOP.toFixed(1)), 10, 1200)

    f.properties = {
      hex_id: i,
      E_PM,
      EPL_PM,
      E_OZONE,
      EPL_OZONE,
      EP_ASTHMA,
      SPL_SVM,
      E_TOTPOP
    }
    return f
  })

  return grid // GeoJSON FeatureCollection (EPSG:4326)
}
