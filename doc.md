Architecture & Functionality Overview
=====================================

This project presents an interactive environmental map experience built with Vue 3, MapLibre, Storybook, and a curated control panel. The core functionality is implemented across three major components, with additional styling and interaction logic shared through supporting modules.

High-Level Architecture
-----------------------

* `EnvironmentalMap.vue`: Container responsible for data loading, state management, ZIP lookups, palette definitions, and coordinating interactions between controls and the map.
* `MapControls.vue`: Professional sidebar console that hosts factor selection, legend interaction, range filtering, and ZIP lookup UI.
* `MapHexLayer.vue`: MapLibre wrapper that renders the choropleth, handles highlighting, hover states, selection outlines, and responds to prop changes (center, zoom, colors).
* `MapControls` and `EnvironmentalMap` communicate through events (`factor-change`, `range-change`, `pin-search`, `toggle-overlay`) which update reactive state and feed into `MapHexLayer`.

Data Flow & State
-----------------

1. **Data Loading**: `EnvironmentalMap.vue` loads the GeoJSON dataset (either string URL or inline object). It extracts numeric keys, calculates statistics, and builds a catalog of available factors.
2. **Reactive State**:
   * `selectedFactor`, `currentRange`, `selectedHexIds`, `mapCenter`, `mapZoom`, `pinLoading`, `pinErrorMessage`.
   * `active` computed property returns the current palette, breaks, unit, and value field for the selected factor.
3. **Legend Bins**: Calculated from quantile statistics (`q20`, `q40`, `q60`, `q80`). `MapControls` emits range filters derived from legend labels.
4. **Filtering**: Range updates emit `[min, max]` or helper tokens (`first`, `last`, `exclusive`) which are translated into MapLibre filter expressions (`layerFilter`) and passed to `MapHexLayer`.
5. **ZIP Lookup**:
   * User input is handled by `MapControls` and forwarded via `pin-search` event.
   * `EnvironmentalMap` uses the Zippopotam API to fetch coordinates, then finds the hex(es) containing that point via Turf’s `booleanPointInPolygon`.
   * A small in-memory cache avoids redundant lookups.
   * On success the map recenters, zooms (minimum 7.2), and highlights the matched hex IDs.
6. **Selected Hex Highlighting**: IDs are passed to `MapHexLayer`, which applies a line layer filter to draw a bold outline for the selection. Hover logic is separate and uses feature-state.

Map Rendering (`MapHexLayer.vue`)
---------------------------------

* Instantiates a MapLibre map with provided style.
* Adds a choropleth fill layer (`props.layerId`) using a generated step expression based on quantile breaks.
* Hover highlighting: Feature state is toggled on mouse move when `hoverHighlight` is enabled. Fill opacity increases on hover.
* Selection layer: Additional line layer (`selectionLayerId`) reuses the main GeoJSON source. Applied filter highlights any hex ID contained in `selectedHexIds`.
* Dynamic updates: watchers respond to changes in center, zoom, colors, palette, filters, and selected hex list.
* Tooltip logic: Popups display computed fields using `tooltipFields` or a custom formatter. Clicking off the map or mousing out closes popups.
* Optional state boundaries: When `showStateBorders` and `statesUrl` are provided, MapLibre fetches, renders both casing and line layers for state boundaries.

Control Panel Design (`MapControls.vue`)
----------------------------------------

* Header with collapsible “Quick Tips”.
* Factor selection, legend, and numeric range filters are unified into a single card stack for a cohesive “Filter” section.
* Zip lookup card with validation, loading state, and error feedback.
* Overlay toggle currently emits an event without active overlay logic (placeholder for future expansion).
* Styling emphasizes professional pastel aesthetics, subtle shadows, and consistent spacing using flex/grid layouts.
* Legend items are clickable, emit range filter events, and display an active dot when the current filter intersects the bin.

Palettes & Visual Encoding
--------------------------

* Air Quality uses a reversed gradient to emphasize low values with a deeper amber (`#a93b07 → #fdd8b4`), per requested emphasis.
* Other factors follow light-to-dark sequences (teal, blue, pink, gray) ensuring adequate contrast while retaining a calm, professional look.
* Hover opacity was increased (0.75 base, 0.9 hover) to ensure low-value hues remain visible against the basemap.

Header & Layout
---------------

* `EnvironmentalMap.vue` wraps the entire experience in `environmental-map-shell`, includes a static header modeled after “All of Us” design with logo, navigation, and user chip.
* Main content flexes vertically: header + two-column layout (controls + map).

Event Sequence Summary
----------------------

1. User selects a factor → `factor-change` resets the range, active palette updates, map re-colors.
2. User clicks legend bin → `range-change` emits new min/max, map filter narrows results.
3. User edits numeric fields → same `range-change` pipeline refreshes filters.
4. User enters ZIP → `handlePinSearch` fetches, centers, enlarges zoom, highlights hex, tooltip ready on hover.
5. Map interactions (hover/click) update visual feedback without altering core state unless selection occurs.

Extensibility Notes
-------------------

* Overlay toggle ready to drive a no-data visualization layer.
* Palettes, breaks, and legend labeling isolated within `EnvironmentalMap` to allow expansion or user customization.
* `MapControls` styling uses scoped CSS; theming changes can be localized without impacting map rendering.
* `MapHexLayer` watchers ensure minimal re-renders; additional layers (e.g., points, tooltips) can be added in the `map.on('load')` hook.

Additional Notes
----------------

* Header is static; navigation links currently use placeholders.
* The control panel is scoped-styled, so global CSS remains untouched. Adjusting the visual theme can be done within `MapControls.vue`.
* Build tooling uses Vite and Storybook; the `EnvironmentalMap.stories.js` file showcases the default configuration for manual testing.
Architecture & Functionality Overview
=====================================

This project presents an interactive environmental map experience built with Vue 3, MapLibre, Storybook, and a curated control panel. The core functionality is implemented across three major components, with additional styling and interaction logic shared through supporting modules.

High-Level Architecture
-----------------------

* `EnvironmentalMap.vue`: Container responsible for data loading, state management, ZIP lookups, palette definitions, and coordinating interactions between controls and the map.
* `MapControls.vue`: Professional sidebar console that hosts factor selection, legend interaction, range filtering, and ZIP lookup UI.
* `MapHexLayer.vue`: MapLibre wrapper that renders the choropleth, handles highlighting, hover states, selection outlines, and responds to prop changes (center, zoom, colors).
* `MapControls` and `EnvironmentalMap` communicate through events (`factor-change`, `range-change`, `pin-search`, `toggle-overlay`) which update reactive state and feed into `MapHexLayer`.

Data Flow & State
-----------------

1. **Data Loading**: `EnvironmentalMap.vue` loads the GeoJSON dataset (either string URL or inline object). It extracts numeric keys, calculates statistics, and builds a catalog of available factors.
2. **Reactive State**:
   * `selectedFactor`, `currentRange`, `selectedHexIds`, `mapCenter`, `mapZoom`, `pinLoading`, `pinErrorMessage`.
   * `active` computed property returns the current palette, breaks, unit, and value field for the selected factor.
3. **Legend Bins**: Calculated from quantile statistics (`q20`, `q40`, `q60`, `q80`). `MapControls` emits range filters derived from legend labels.
4. **Filtering**: Range updates emit `[min, max]` or helper tokens (`first`, `last`, `exclusive`) which are translated into MapLibre filter expressions (`layerFilter`) and passed to `MapHexLayer`.
5. **ZIP Lookup**:
   * User input is handled by `MapControls` and forwarded via `pin-search` event.
   * `EnvironmentalMap` uses the Zippopotam API to fetch coordinates, then finds the hex(es) containing that point via Turf’s `booleanPointInPolygon`.
   * A small in-memory cache avoids redundant lookups.
   * On success the map recenters, zooms (minimum 7.2), and highlights the matched hex IDs.
6. **Selected Hex Highlighting**: IDs are passed to `MapHexLayer`, which applies a line layer filter to draw a bold outline for the selection. Hover logic is separate and uses feature-state.

Map Rendering (`MapHexLayer.vue`)
---------------------------------

* Instantiates a MapLibre map with provided style.
* Adds a choropleth fill layer (`props.layerId`) using a generated step expression based on quantile breaks.
* Hover highlighting: Feature state is toggled on mouse move when `hoverHighlight` is enabled. Fill opacity increases on hover.
* Selection layer: Additional line layer (`selectionLayerId`) reuses the main GeoJSON source. Applied filter highlights any hex ID contained in `selectedHexIds`.
* Dynamic updates: watchers respond to changes in center, zoom, colors, palette, filters, and selected hex list.
* Tooltip logic: Popups display computed fields using `tooltipFields` or a custom formatter. Clicking off the map or mousing out closes popups.
* Optional state boundaries: When `showStateBorders` and `statesUrl` are provided, MapLibre fetches, renders both casing and line layers for state boundaries.

Control Panel Design (`MapControls.vue`)
----------------------------------------

* Header with collapsible “Quick Tips”.
* Factor selection, legend, and numeric range filters are unified into a single card stack for a cohesive “Filter” section.
* Zip lookup card with validation, loading state, and error feedback.
* Overlay toggle currently emits an event without active overlay logic (placeholder for future expansion).
* Styling emphasizes professional pastel aesthetics, subtle shadows, and consistent spacing using flex/grid layouts.
* Legend items are clickable, emit range filter events, and display an active dot when the current filter intersects the bin.

Palettes & Visual Encoding
--------------------------

* Air Quality uses a reversed gradient to emphasize low values with a deeper amber (`#a93b07 → #fdd8b4`), per requested emphasis.
* Other factors follow light-to-dark sequences (teal, blue, pink, gray) ensuring adequate contrast while retaining a calm, professional look.
* Hover opacity was increased (0.75 base, 0.9 hover) to ensure low-value hues remain visible against the basemap.

Header & Layout
---------------

* `EnvironmentalMap.vue` wraps the entire experience in `environmental-map-shell`, includes a static header modeled after “All of Us” design with logo, navigation, and user chip.
* Main content flexes vertically: header + two-column layout (controls + map).

Event Sequence Summary
----------------------

1. User selects a factor → `factor-change` resets the range, active palette updates, map re-colors.
2. User clicks legend bin → `range-change` emits new min/max, map filter narrows results.
3. User edits numeric fields → same `range-change` pipeline refreshes filters.
4. User enters ZIP → `handlePinSearch` fetches, centers, enlarges zoom, highlights hex, tooltip ready on hover.
5. Map interactions (hover/click) update visual feedback without altering core state unless selection occurs.

Extensibility Notes
-------------------

* Overlay toggle ready to drive a no-data visualization layer.
* Palettes, breaks, and legend labeling isolated within `EnvironmentalMap` to allow expansion or user customization.
* `MapControls` styling uses scoped CSS; theming changes can be localized without impacting map rendering.
* `MapHexLayer` watchers ensure minimal re-renders; additional layers (e.g., points, tooltips) can be added in the `map.on('load')` hook.

This document summarizes both minute and major pieces of logic to help maintainers understand data flow, interactions, and design decisions across the project.
