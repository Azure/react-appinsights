# react-appinsights Change Log

All notable changes to this project are documented in this file.  
The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Change
- Bump `merge` indirect dependency to remediate security vulnerability [772](https://www.npmjs.com/advisories/722)

## [2.0.0] - 2018-11-20
### Add
- Component usage tracking API based on [higher-order components](https://reactjs.org/docs/higher-order-components.html): the `withTracking` function has to be used to add tracking to each component class
- Typescript types definition file

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


[Unreleased]: https://github.com/Azure/react-appinsights/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/Azure/react-appinsights/compare/v1.0.4...v2.0.0