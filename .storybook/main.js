// .storybook/main.js
export default {
  framework: { name: '@storybook/vue3-vite', options: {} },
  stories: [
    '../stories/**/*.stories.@(js|mdx)',
    '../src/**/*.stories.@(js|mdx)',
  ],
  addons: ['@storybook/addon-essentials'],
  staticDirs: ['../public'],
  features: {
    buildStoriesJson: false,
  },

  // Note: Storybook passes a second arg with configType in recent versions.
  async viteFinal(config, { configType } = {}) {
    // ✅ GitHub Pages base path support (safe for Vercel + local)
    // Only apply to production builds so local dev remains unaffected.
    if (configType === 'PRODUCTION') {
      const base = process.env.STORYBOOK_BASE_PATH || '/';
      config.base = base;
    }

    // Your existing fix: prevent process.env access issues
    config.define = { ...(config.define ?? {}), 'process.env': {} };

    // Fix maplibre-gl bundling issue - ensure it's included and not externalized
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: ['maplibre-gl', '@turf/turf', 'vue'],
      exclude: [],
    };

    // Ensure maplibre-gl is bundled properly (not externalized)
    config.ssr = config.ssr || {};
    if (config.ssr.noExternal === undefined) {
      config.ssr.noExternal = [];
    }
    if (Array.isArray(config.ssr.noExternal)) {
      // avoid duplicates if viteFinal runs more than once
      if (!config.ssr.noExternal.includes('maplibre-gl')) {
        config.ssr.noExternal.push('maplibre-gl');
      }
    }

    // Explicitly prevent maplibre-gl from being externalized in build
    config.build = config.build || {};
    config.build.rollupOptions = config.build.rollupOptions || {};

    // Override external to never externalize maplibre-gl
    const originalExternal = config.build.rollupOptions.external;
    config.build.rollupOptions.external = (id) => {
      // Never externalize maplibre-gl
      if (id === 'maplibre-gl' || id.includes('maplibre-gl')) {
        return false;
      }
      // Use original external function if it exists
      if (originalExternal) {
        if (typeof originalExternal === 'function') {
          return originalExternal(id);
        }
        if (Array.isArray(originalExternal)) {
          return originalExternal.includes(id);
        }
      }
      return false;
    };

    return config;
  },
};