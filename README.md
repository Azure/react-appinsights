# react-appinsights

[![npm](https://img.shields.io/npm/v/react-appinsights.svg)](https://www.npmjs.com/package/react-appinsights) [![Build Status](https://dev.azure.com/azure-public/react-appinsights/_apis/build/status/Azure.react-appinsights)](https://dev.azure.com/azure-public/react-appinsights/_build/latest?definitionId=16) [![Greenkeeper badge](https://badges.greenkeeper.io/Azure/react-appinsights.svg)](https://greenkeeper.io/) [![Downloads per month](https://img.shields.io/npm/dm/react-appinsights.svg)](https://www.npmjs.com/package/react-appinsights) 

Javascript library to integrate [Application Insights][appinsights-js] in applications built with [React][react].  
`react-appinsights` extends Application Insights with additional React-specific features:

- tracking of router changes
- React components usage statistics
- API to extend the standard telemetry with additional dimensions

## IMPORTANT - please read!

Please note that the latest stable version of this package is 2.0.2 and the corresponding documentation for this version resides [here][2-0-2]. However, the package is soon going to be upgraded to its next major version (3.0.0). The release candidate (3.0.0-rc6) for this version is published [here][3-0-0-rc-6]. The content of this readme refers to the next major version.

## Installation

Using npm:

```bash
npm install --save react-appinsights@beta
```

## Usage

To initialize Application Insights, add the following to the entry point
file of your application (e.g. `index.js`):

```javascript
import { reactAI } from "react-appinsights";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";

let appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx",
    extensions: [reactAI],
    extensionConfig: {
      [reactAI.extensionId]: { debug: false }
    }
  }
});
appInsights.loadAppInsights();
```

See [this Application Insights tutorial for Node.js][appinsights-nodejs]
for more details on how to obtain the instrumentation key.

`IReactAISettings` has following non-mandatory configuration options to be passed into the `extensionConfig` object:

```typescript
interface IReactAISettings {
  initialContext?: { [key: string]: any };  // Initial context to initialize with
  history?: History;                        // React router history - to enable page view tracking
  debug?: boolean;                          // Debug mode: displays debug messages from ReactAI in console
}
```

#### Track router changes

To track page views, pass a history object to the init method.  
For more information see the [documentation][react-router] of the `react-router` package.

```javascript
import { reactAI } from "react-appinsights";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

/*
 * In the code sample above, set configuration as follows:
 *   extensionConfig: {
 *     [ReactAI.extensionId]: { history: history }
 *   }
 */

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById("root")
);
```

#### Enable React components usage tracking

To instrument various React components usage tracking, apply the `withAITracking` higher-order
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

To see this metric in the Azure portal you need to navigate to the Application Insights resource, select "Metrics" tab and configure the empty charts to display Custom metric named "React Component Engaged Time (seconds)", select aggregation (sum, avg, etc.) of your liking and apply split by "Component Name".

![image](https://user-images.githubusercontent.com/1005174/51357010-c168ac80-1a71-11e9-8df9-348febd2d6dd.png)

You can also run custom queries to slice and dice AI data to generate reports and visualizations as per your requirements. In the Azure portal, navigate to the Application Insights resource, select "Analytics" from the top menu of the Overview tab and run your query.

![image](https://user-images.githubusercontent.com/1005174/51356821-e872ae80-1a70-11e9-9e12-e56a1edcde68.png)

Please note that it can take up to 10 minutes for new custom metric to appear in the Azure Portal.

#### Set application context

To augment all telemetry with additional properties use `setContext` method. For instance:

```javascript
reactAI.setContext({ CorrelationId: "some-unique-correlation-id", Referrer: document.referrer });
```

This will add CorrelationId and Referrer property to all page views, ajax calls, exceptions and other telemetry sent to Application Insights.

<img width="600" src="https://cloud.githubusercontent.com/assets/3801171/18721651/43c4861e-7fe6-11e6-8541-3614111acc8f.png"/>

#### Get original AppInsights object

Use the following method to get the original AppInsights object:

```javascript
var appInsights = reactAI.appInsights;
```

Refer to [this doc][appinsights-js-api] for information on the Javascript API of Application Insights.


[react]: https://reactjs.org/
[appinsights-js]: https://docs.microsoft.com/en-us/azure/application-insights/app-insights-javascript
[appinsights-nodejs]: https://azure.microsoft.com/en-us/documentation/articles/app-insights-nodejs/
[appinsights-js-api]: https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md
[react-router]: https://github.com/ReactTraining/react-router/blob/master/FAQ.md#how-do-i-access-the-history-object-outside-of-components
[2-0-2]: https://github.com/Azure/react-appinsights/tree/v2.0.2
[3-0-0-rc-6]: https://www.npmjs.com/package/react-appinsights/v/3.0.0-rc.6