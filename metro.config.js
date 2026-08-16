const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add 'cjs' to source extensions for Firebase
config.resolver.sourceExts.push('cjs');

// Disable unstable package exports which conflicts with Firebase Auth
config.resolver.unstable_enablePackageExports = false;

// Custom resolveRequest to handle @posthog/core/ subpaths since package exports are disabled
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('@posthog/core/')) {
    const subpath = moduleName.replace('@posthog/core/', '');
    return context.resolveRequest(context, `@posthog/core/dist/${subpath}/index.js`, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
