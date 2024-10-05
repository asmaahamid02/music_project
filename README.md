# Music

>Music Player app that allows users to listen to, upload and comment on songs. It is built with VueJs.

## Features

- Vue3
- Vite
- Pinia
- Option API
- Lifecycle Hooks
- Form Validation using VeeValidate
- Authentication using Firebase
- Routing using Vue Router && Navigation Guards
- Upload Files to Firebase Storage
- Upload/Manage songs to Firebase Firestore/Storage
- Play Audio using Howler.js
- Vue Directives
- Internationalization using vue-i18n (English, Arabic)
- PWA and Offline Support using Workbox
- Optimizations for Production (Dynamic Imports, Code Coverage, Progress bar, Rollup visualizer)
- Error Handling
- Deployment to Vercel
- Unit/Snapshot Testing using Vitest
- E2E Testing using Cypress

## Live Site

[Music Player](https://music-project-neon.vercel.app/)

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```
