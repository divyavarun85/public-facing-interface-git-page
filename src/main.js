export default {
  framework: { name: '@storybook/vue3-vite', options: {} },
  stories: ['../src/**/*.stories.@(js|mdx)'],
  addons: ['@storybook/addon-essentials'],
  staticDirs: ['../public'],   // so /chel2022.geojson works later
  async viteFinal(config) {
    config.optimizeDeps ??= {}
    config.optimizeDeps.exclude = [ ...(config.optimizeDeps.exclude ?? []), 'maplibre-gl' ]
    config.define = { ...(config.define ?? {}), 'process.env': {} }
    return config
  },
}
