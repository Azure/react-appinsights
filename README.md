# react-appinsights

[![Build Status](https://dev.azure.com/azure-public/react-appinsights/_apis/build/status/Azure.react-appinsights)](https://dev.azure.com/azure-public/react-appinsights/_build/latest?definitionId=16)
[![npm](https://img.shields.io/npm/v/react-appinsights.svg)](https://www.npmjs.com/package/react-appinsights)
[![Downloads per month](https://img.shields.io/npm/dm/react-appinsights.svg)](https://www.npmjs.com/package/react-appinsights)
[![dependencies](https://david-dm.org/Azure/react-appinsights.svg)](https://david-dm.org/Azure/react-appinsights)
[![Greenkeeper badge](https://badges.greenkeeper.io/Azure/react-appinsights.svg)](https://greenkeeper.io/)

Javascript library to integrate [Application Insights][appinsights-js] in applications built with [React][react].  
`react-appinsights` extends Application Insights with additional React-specific features:
 * tracking of router changes
 * React components usage statistics
 * API to extend the standard telemetry with additional dimensions

## Installation

Using npm:
```bash
npm install --save react-appinsights
```

## Usage

To initialize Application Insights add the following to the entry point 
file of your application (e.g. index.js):

```javascript
import { ReactAI } from 'react-appinsights';
ReactAI.initialize({instrumentationKey:'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx'});
```
See [this Application Insights tutorial for Node.js][appinsights-nodejs] 
for more details on how to obtain the instrumentation key.

The initialization function takes as parameter an object with the following properties:
```typescript
interface IReactAISettings {
  instrumentationKey: string;   // Required - get it from Azure Portal
  initialContext?: { [key: string]: any };  // If you want to initialize with custom context
  history?: History;    // React router history - if supplied, it enables page view tracking
  debug?: boolean;  // Debug mode: useful when debugging to see messages from the library displayed on the console
}
```

#### Track router changes

To track page views, pass a history object to the init method.  
For more information see the [documentation][react-router] of the `react-router` package.

    
```javascript
import ReactAI from 'react-appinsights';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory()
ReactAI.init({instrumentationKey:'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx', history: history});

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById("root")
);
```

#### Enable React components usage tracking

To enable React components usage tracking, apply the `withAITracking` higher-order 
component function.

```javascript
import { withAITracking } from 'react-appinsights';

class MyComponent extends React.Component {
    ... 
}

export default withAITracking(MyComponent);
```

To change the name string of the component that appears in Application Insights, 
you can pass a custom name as second argument of `withAITracking`.

```javascript
export default withAITracking(MyComponent, "CustomMyComponentName");
```

It will measure time from the `ComponentDidMount` event through the `ComponentWillUnmount` event. 
However, in order to make this more accurate, it will subtract the time in which the user was idle. 
In other words, `React Component Engaged Time = ComponentWillUnmount timestamp - ComponentDidMount timestamp - idle time`.  

To see this metric in the Azure portal you need to navigate to the Application Insights resource, 
select Metrics Explorer from the top menu 
and configure one of the empty charts to display Custom metrics "React Component Engaged Time" 
grouped by Component Name. 
It can take up to 10 minutes for new custom metric to appear in the Azure Portal.

<img width="550" src="https://cloud.githubusercontent.com/assets/3801171/18735093/eeac0496-802f-11e6-9403-50c6fe8aaf9e.png"/>

#### Set application context

To augment all telemetry with additional properties use `setContext` method. For instance:

```javascript
ReactAI.setContext({CorrelationId: 'some-unique-correlation-id', Referrer: document.referrer});
```

This will add CorrelationId and Referrer property to all page views, ajax calls, exceptions and other telemetry sent to Application Insights.

<img width="600" src="https://cloud.githubusercontent.com/assets/3801171/18721651/43c4861e-7fe6-11e6-8541-3614111acc8f.png"/>

#### Get original AppInsights object

Use the following method to get the original AppInsights object:

```javascript
var appInsights = ReactAI.rootInstance;
```

#### 

Refer to [this doc][appinsights-js-api] for information on the Javascript API of Application Insights. 


 [react]: https://reactjs.org/
 [appinsights-js]: https://docs.microsoft.com/en-us/azure/application-insights/app-insights-javascript
 [appinsights-nodejs]: https://azure.microsoft.com/en-us/documentation/articles/app-insights-nodejs/
 [appinsights-js-api]: https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md
 [react-router]: https://github.com/ReactTraining/react-router/blob/master/FAQ.md#how-do-i-access-the-history-object-outside-of-components
