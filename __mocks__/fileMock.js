// @file __mocks__/fileMock.js
// @description Jest mock for binary asset files (mp3, wav, m4a, images).
// Returns a numeric stub so require() calls in audioMap.ts and artworkMap.ts
// resolve without the actual files being present in the CI environment.
// This is the standard React Native / Expo pattern for binary asset mocking.
module.exports = 1;
