const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Basic fixes for import.meta
config.resolver.unstable_enablePackageExports = true;
config.transformer.unstable_allowRequireContext = true;

// Add explicit platform support
config.resolver.platforms = ['web', 'native', 'ios', 'android'];

module.exports = config;