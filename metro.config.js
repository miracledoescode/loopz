const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add 'cjs' to source extensions for Firebase
config.resolver.sourceExts.push('cjs');

// Disable unstable package exports which conflicts with Firebase Auth
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
