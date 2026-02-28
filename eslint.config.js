/**
 * @file eslint.config.js
 * @description ESLint flat config for the shortSurahs React Native Expo project.
 * @project shortSurahs
 * @sprint Sprint 1 — US-1 AC-1.1 (CI infrastructure)
 */

const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const globals = require('globals');

module.exports = defineConfig([
  ...expoConfig,
  {
    ignores: ['node_modules/', 'dist/', '.expo/'],
  },
  {
    files: ['__tests__/**/*.js', '__tests__/**/*.ts', '**/*.test.js', '**/*.test.ts'],
    languageOptions: {
      globals: { ...globals.jest, ...globals.node },
    },
  },
]);
