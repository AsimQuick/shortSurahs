/**
 * @file __mocks__/@react-native-async-storage/async-storage.js
 * @description Jest mock for AsyncStorage (the native module is unavailable in
 *              Jest). Uses the in-memory mock shipped with the package, as its
 *              docs recommend. Added in Sprint 7 when the persisted prayer
 *              settings store became part of the prayer store's import chain.
 * @project shortSurahs
 * @story US-13: Accurate prayer times and location
 * @created 2026-11-07
 */
module.exports = require('@react-native-async-storage/async-storage/jest/async-storage-mock');
