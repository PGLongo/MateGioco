# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.6.0](https://github.com/PGLongo/MateGioco/compare/v1.5.0...v1.6.0) (2025-12-29)


### 📝 Documentation

* update README with badges and improved documentation ([529f350](https://github.com/PGLongo/MateGioco/commit/529f350f5ee82bdc0670cb5e000928d29ee04315))


### ✨ Features

* add @nuxt/hints module for performance and accessibility insights ([da2bf15](https://github.com/PGLongo/MateGioco/commit/da2bf1594604695ee9f639e1f4f522d6157b5306))
* add i18n support with Italian and English translations ([2d06229](https://github.com/PGLongo/MateGioco/commit/2d06229b5f046d68dd6d8158881735c0e20089c3))
* **assets:** generate complete set of icons and favicons ([3230039](https://github.com/PGLongo/MateGioco/commit/3230039d78d7505fedc226562f8ddf44557b6414))
* **assets:** update favicon to happy calculator with numbers ([e596d89](https://github.com/PGLongo/MateGioco/commit/e596d89e568dc2b1c726566b96d95939cd947c09))
* modernize footer with GitHub link and icon-based design ([b0fab69](https://github.com/PGLongo/MateGioco/commit/b0fab695721a6adf765bd055a3bea3d7c20cccc4))
* replace custom SVG icons with nuxt-icon ([1ce3d74](https://github.com/PGLongo/MateGioco/commit/1ce3d7400be4fd6a8e034009abd527df9ea2a4b6))
* replace emoji with Material Design Icons in calculator ([676f419](https://github.com/PGLongo/MateGioco/commit/676f419e36eda90e7f4dd58210e17f62680b17b0))
* **ui:** add player name back to header below app title ([1059a53](https://github.com/PGLongo/MateGioco/commit/1059a53717819c899b18564dd2e5d67b38df417f))
* **ui:** enhance stars container with 3D gold effect and animation ([720563b](https://github.com/PGLongo/MateGioco/commit/720563b3ee14d366948cff9fe4ba9f88d6365634))
* **ui:** playful modern redesign with 3d jelly buttons and glassmorphism ([8a79872](https://github.com/PGLongo/MateGioco/commit/8a79872aacb4ed7f9de2fb1bcd57075b6402507f))
* **ui:** replace greeting with app title in header ([d621eb0](https://github.com/PGLongo/MateGioco/commit/d621eb09aeab3c36c0c339893d4c80a9bdb429ca))
* **ui:** update palette to use flat pastel colors inspired by Bluey ([6a912cc](https://github.com/PGLongo/MateGioco/commit/6a912cc41beb8ed3d5d1b84062664610e84fbf88))


### 🐛 Bug Fixes

* **assets:** regenerate icons with correct background color for maskable icons ([1d3091a](https://github.com/PGLongo/MateGioco/commit/1d3091a4fd4bb573c8133c3d02ef9c694d06c3f0))
* configure @nuxt/icon with Material Design Icons collection ([7f4f6e2](https://github.com/PGLongo/MateGioco/commit/7f4f6e25c8d7034a40e66c4cf065a7b6162e0d0b))
* i18n langDir ([142a682](https://github.com/PGLongo/MateGioco/commit/142a68214e2ce290d8d1eab83f9c823372336c55))
* increase calculator button icon size to match button scale ([a94e603](https://github.com/PGLongo/MateGioco/commit/a94e603e2b0ed3663c933f54e90f1e47347eb337))
* increase icon size for better visibility ([0395f5c](https://github.com/PGLongo/MateGioco/commit/0395f5c6013c06ac12e991aa08812f0d3b66ad6d))
* install @iconify-json/mdi to load Material Design Icons ([7eaf8f8](https://github.com/PGLongo/MateGioco/commit/7eaf8f891691419a5ebf4d53ef7c90ba5f416c2d))
* **type:** resolve implicit any in audio context init ([8c3b4e4](https://github.com/PGLongo/MateGioco/commit/8c3b4e4854c8ef2932fd92fe7255942f440efa2e))
* **ui:** increase button spacing for better accessibility ([3a32eb1](https://github.com/PGLongo/MateGioco/commit/3a32eb1103e1b68191bb112750efe867c2305ddb))
* **ui:** remove gradients from header and background for flat pastel look ([079f6c7](https://github.com/PGLongo/MateGioco/commit/079f6c76042cd38fab57576a1b94404c378e7566))
* **ui:** remove rounded corners from app header bottom ([483d773](https://github.com/PGLongo/MateGioco/commit/483d773c4ad87c447ed025f805130ceeee98ef83))

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
