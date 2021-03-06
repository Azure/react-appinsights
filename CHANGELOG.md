# react-appinsights Change Log

All notable changes to this project are documented in this file.  
The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [3.0.0-rc6] - 2019-04-09

### Change
- Upgraded Application Insights SDK to [latest release candidate](ai-latest-rc)
- Upgraded various package
- Updated readme

## [3.0.0-rc5] - 2019-03-18

### Change
- Upgraded the underlying Application Insights reference to the [new beta version](ai-beta)
- Completely rewritten in TypeScript

## [2.0.2] - 2019-01-20

### Change

- Dependencies' versions bump - add support for React 16.8.x

## [2.0.1] - 2018-12-10

### Fixed

- Fix `setAppContext` null issue on AI.queue #22 (thanks to @hiraldesai)
- Make history `init` parameter optional in the TypeScript typings (thanks to @milohansen)
- Bump `merge` indirect dependency to mitigate security vulnerability [772](https://www.npmjs.com/advisories/722)

## [2.0.0] - 2018-11-20

### Add

- Component usage tracking API based on [higher-order components](https://reactjs.org/docs/higher-order-components.html): the `withTracking` function has to be used to add tracking to each component class
- TypeScript types definition file

### Remove

- Component usage tracking API based on inheritance
- `ReactAI.trackRouterChange`, since `react-router` dropped support for `onXXX` properties [in v4](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/migrating.md#on-properties)

### Change

- Dependencies' versions bump - add support for React 16.5.x

## 1.x.x - 2017

### Add

- Component usage tracking API based on class inheritance: tracked components have to inherit from the `TrackedComponent` class
- Tracking router changes API (compatible with `react-router` v3)
- `setAppContext` function to enrich tracking with custom information
- `ai` function to access Application Insights SDK API

[unreleased]: https://github.com/Azure/react-appinsights/compare/v2.0.2...HEAD
[2.0.0]: https://github.com/Azure/react-appinsights/compare/v1.0.4...v2.0.0
[2.0.1]: https://github.com/Azure/react-appinsights/compare/v2.0.0...v2.0.1
[2.0.2]: https://github.com/Azure/react-appinsights/compare/v2.0.1...v2.0.2
[3.0.0-rc5]: https://github.com/Azure/react-appinsights/compare/v2.0.2...v3.0.0-rc5
[3.0.0-rc6]: https://github.com/Azure/react-appinsights/compare/v3.0.0-rc5...v3.0.0-rc6
[ai-beta]: https://www.npmjs.com/package/@microsoft/applicationinsights-web/v/2.0.0-beta.3
[ai-latest-rc]: https://www.npmjs.com/package/@microsoft/applicationinsights-web/v/2.0.0-rc1