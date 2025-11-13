# project-3-group8-frontend-2.0
We decided to start over to implement react native instead of just react.  (Error by me)
## Description

A React Native rewrite of the original frontend for Project 3 (Group 8). This repo contains the mobile-first application and common utilities, rebuilt to target native iOS and Android environments.

## Tech stack

- React Native (Expo or React Native CLI)
- JavaScript / TypeScript (depending on branch)
- Redux / Context API (state management)
- Axios / Fetch (network requests)
- Jest / React Native Testing Library (tests)

## Prerequisites

- Node.js (LTS)
- npm or yarn
- For Expo: Expo CLI (`npm install -g expo-cli`) and Expo Go app on device
- For React Native CLI: Android Studio (Android SDK) and Xcode (macOS) as needed

## Setup

1. Clone the repo
    - git clone <repository-url>
2. Install dependencies
    - npm install
    - or
    - yarn install

## Running

Using Expo (recommended for quick development)
- Start Metro: npm start or yarn start
- Open the app in Expo Go (scan QR) or use a simulator via the Expo CLI UI

Using React Native CLI
- Start Metro: npm start
- Android: npm run android
- iOS: npm run ios (macOS + Xcode required)

## Building

- Follow platform-specific docs:
  - For Expo managed apps: expo build or EAS Build
  - For bare React Native: use Xcode (iOS) and Gradle (Android)

## Testing

- Run unit tests: npm test or yarn test
- Add component/integration tests using React Native Testing Library

## Project structure (example)

- /src
  - /components
  - /screens
  - /navigation
  - /services
  - /store
  - /assets
- App.js / index.js

## Code style & linting

- Use ESLint and Prettier (configure in repo)
- Run linter: npm run lint

## Contributing

- Fork the repo, create a feature branch, open a PR
- Keep commits atomic, write descriptive PRs
- Add tests for new behavior

## Troubleshooting

- Clear Metro cache: npm start -- --reset-cache
- Reinstall node modules if native build errors occur: rm -rf node_modules && npm install

## License

MIT — see LICENSE file for details

## Contact

Project 3 — Group 8. Open issues for bugs or feature requests.