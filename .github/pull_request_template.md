## Summary

<!-- Describe what this PR does and which AC it closes. -->

## Acceptance Criterion

<!-- e.g. Closes AC-5.4 -->

## Test Plan

- [ ] `npm ci` passes
- [ ] `npx tsc --noEmit` passes
- [ ] `npm test` passes (all tests green)
- [ ] CI passes on this PR

## US-6 Manual Test Checklist

> Complete this section for any PR that touches background audio or lock screen behaviour (US-6).
> Skip with "N/A — not a US-6 PR" if this PR does not affect background audio.

### Background Audio — iOS

- [ ] Audio continues when app is minimised (home button / swipe up)
- [ ] Audio continues when screen is locked

### Background Audio — Android

- [ ] Audio continues when app is minimised
- [ ] Audio continues when screen is locked

### Lock Screen Controls — iOS

- [ ] Play/Pause control visible and functional on lock screen
- [ ] Next control visible and functional on lock screen
- [ ] Previous control visible and functional on lock screen

### Lock Screen Controls — Android

- [ ] Play/Pause control visible and functional in notification
- [ ] Next control visible and functional in notification
- [ ] Previous control visible and functional in notification

### Metadata Display

- [ ] Surah name displayed correctly on lock screen / notification
- [ ] Aya number displayed correctly on lock screen / notification
- [ ] Artwork displayed correctly on lock screen / notification
