# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.5.0](https://github.com/PGLongo/MateGioco/compare/v1.4.0...v1.5.0) (2025-12-29)


### ✨ Features

* add audio feedback with useSound composable ([80f9403](https://github.com/PGLongo/MateGioco/commit/80f9403bdd0024349b8c612c234d30909782aa06))
* add celebration fanfare sound for session completion ([79f41e9](https://github.com/PGLongo/MateGioco/commit/79f41e99624b67532e63b034bd3b0848a780a35f))
* add confetti animations with useConfetti composable ([be3e281](https://github.com/PGLongo/MateGioco/commit/be3e2813d98708bbb61a8e24aa14701874d22dd3))
* implement dark mode with @nuxtjs/color-mode ([94457d2](https://github.com/PGLongo/MateGioco/commit/94457d2993f75167fd66aff55e84919b1c73cc76)), closes [#EBF4F6](https://github.com/PGLongo/MateGioco/issues/EBF4F6) [#D6EAF8](https://github.com/PGLongo/MateGioco/issues/D6EAF8) [#F8F9F9](https://github.com/PGLongo/MateGioco/issues/F8F9F9) [#2C3E50](https://github.com/PGLongo/MateGioco/issues/2C3E50) [#1a1f2](https://github.com/PGLongo/MateGioco/issues/1a1f2) [#252b3](https://github.com/PGLongo/MateGioco/issues/252b3) [#2d3548](https://github.com/PGLongo/MateGioco/issues/2d3548) [#E8E8E8](https://github.com/PGLongo/MateGioco/issues/E8E8E8)
* improve dark mode palette and settings modal UX ([14f52ed](https://github.com/PGLongo/MateGioco/commit/14f52edfaf7dd4b3a1c45413b21b3cc43d086f3d)), closes [#2C3E50](https://github.com/PGLongo/MateGioco/issues/2C3E50) [#1a1f2](https://github.com/PGLongo/MateGioco/issues/1a1f2)


### 🐛 Bug Fixes

* add click sound to delete and help buttons ([987e489](https://github.com/PGLongo/MateGioco/commit/987e489c6655d151addcc8e969f81dabd7b60934))
* settings name not updating in header without refresh ([f4470c1](https://github.com/PGLongo/MateGioco/commit/f4470c1403feb2b9b07d2289f868b569358bb8ca))

## [1.4.0](https://github.com/PGLongo/MateGioco/compare/v1.3.0...v1.4.0) (2025-12-29)


### ✨ Features

* generate comprehensive PWA assets for iOS and Android ([5d5bcb9](https://github.com/PGLongo/MateGioco/commit/5d5bcb9536fb5b3089c1a9cb502579f71f1490f3))
* integrate feedback into calculator display with dynamic colors ([486f574](https://github.com/PGLongo/MateGioco/commit/486f574bc4c65cd294f0a0cf2a7bcac11ce1e993))

## [1.3.0](https://github.com/PGLongo/MateGioco/compare/v1.2.1...v1.3.0) (2025-12-29)


### 🐛 Bug Fixes

* ensure exact same height for math problem and answer display ([9d9c59b](https://github.com/PGLongo/MateGioco/commit/9d9c59bbd57d3308910ad54a54c9d89dc48c2932))
* improve feedback message positioning and replace native alert ([a4d9037](https://github.com/PGLongo/MateGioco/commit/a4d9037b3e8e1d300b37adb3d62d5e78da359c7e))
* prevent text selection for child-friendly touch interactions ([1b94278](https://github.com/PGLongo/MateGioco/commit/1b942788ca0f33553adf49a482ae0d155b2deff9))


### ✨ Features

* enhance haptic feedback with comprehensive vibration patterns ([a7cd309](https://github.com/PGLongo/MateGioco/commit/a7cd309df139bf68de22c5cc66bd58f89a4dc34c))

### [1.2.1](https://github.com/PGLongo/MateGioco/compare/v1.2.0...v1.2.1) (2025-12-29)


### 🐛 Bug Fixes

* correct PWA asset paths for GitHub Pages deployment ([c0989e5](https://github.com/PGLongo/MateGioco/commit/c0989e5ab80f02fc2f4c5846f775e8b23f151476))
* prevent alert from causing layout resize by using fixed positioning ([189bd7a](https://github.com/PGLongo/MateGioco/commit/189bd7a978c9fb9532cce16372684e15bd169ac3))
* resolve input field resize issue and improve footer spacing ([a90dc96](https://github.com/PGLongo/MateGioco/commit/a90dc96d5eeb756cc24cb991081136f4f27ad666))

## [1.2.0](https://github.com/PGLongo/MateGioco/compare/v1.1.0...v1.2.0) (2025-12-29)


### ✨ Features

* add PWA support with offline capability ([519a925](https://github.com/PGLongo/MateGioco/commit/519a9251589b6029e492d6863b09e734cb7ecc50))

## 1.1.0 (2025-12-28)


### 📝 Documentation

* add comprehensive README with live demo link ([e93f22e](https://github.com/PGLongo/MateGioco/commit/e93f22ebe34b5566d5f0cd10119886d09c8b7785))


### 🐛 Bug Fixes

* disable double-tap zoom on buttons ([3fb11b8](https://github.com/PGLongo/MateGioco/commit/3fb11b80aa51feaf92f9173510986b3f68d8922f))
* optimize layout to fit in viewport without scroll ([733470b](https://github.com/PGLongo/MateGioco/commit/733470bc66556a2238b01509e546b863d7c9869a))
* regenerate package-lock.json to sync with package.json ([7430257](https://github.com/PGLongo/MateGioco/commit/7430257eb500c99dde38cfedae021a0d8711525b))


### ✨ Features

* add standard-version for automated releases ([632f344](https://github.com/PGLongo/MateGioco/commit/632f344ad3e51b410714e6f259c36a92982b98cb))
* create MateGioco math learning app for kids ([13a7d4b](https://github.com/PGLongo/MateGioco/commit/13a7d4b9250bae3c591b31edae0806d53e40313d))
* replace Comic Sans with Quicksand font for better readability ([a95e45f](https://github.com/PGLongo/MateGioco/commit/a95e45ffe14419c5e338dcbaec3249171a44d1aa))
