# react-appinsights Change Log

All notable changes to this project are documented in this file.  
The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## 2.0.0

 - Add component usage tracking API based on [higher-order components](https://reactjs.org/docs/higher-order-components.html): the `withTracking` function is used to add tracking to each component class.
 - Remove component usage tracking API based on inheritance
 - Remove `ReactAI.trackRouterChange` since `react-router` dropped support for `onXXX` methods [in v4](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/migrating.md#on-properties)
 - Dependencies' versions bump - add support for React 16.5.x
 

## 1.x.x

 - Add component usage tracking API based on class inheritance: tracked components have to inherit from the `TrackedComponent` class
 - Add tracking router changes API (compatible with `react-router` v3)
 - Add ability to enrich tracking with the `setAppContext` function
 - Add ability to access Application Insights SDK API through the `ai` function