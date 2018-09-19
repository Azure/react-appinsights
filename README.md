# react-appinsights
### React Application Insights Module
JavaScript module to include [Application Insights](https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md) to application built with React.
It extends standard Application Insights functionality with additional react specific features:
* Tracking router changes.
* React components usage statistics.
* API to extend standard telemetry with additional dimensions.

## Installation

With npm:
```bash
npm install react-appinsights --save
```

## Usage
#### Initialize AppInsights 
To initialize Application Insights add following to index.js:

```javascript
    var ReactAI  = require('react-appinsights');
    ReactAI.init({instrumentationKey:'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx'});
```
See [How to get instrumentation key for Applicaton Insights](https://azure.microsoft.com/en-us/documentation/articles/app-insights-nodejs/) for more details.

#### Track router changes
To track page views, pass a history object to the init method.
    
```javascript
    import ReactAI from 'react-appinsights';
    import createHistory from "history/createBrowserHistory"

    const history = createHistory()
    ReactAI.init({instrumentationKey:'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx'}, history);
```

#### Enable React component usage tracking
To enable React component usage tracking, you just need to call the function `withTracking`.

```javascript
    import ReactAI from 'react-appinsights';

    class MyComponent extends React.Component {
        ... 
    }

    export default ReactAI.withTracking(MyComponent);
```

If for any reason you want to change the name string of the component that appears in Application Insights, 
you can pass in a custom name as second argument of `withTracking`.

```javascript
    export default ReactAI.withTracking(MyComponent, "CustomMyComponentName");
```

We will measure time from ComponentDidMount event through ComponentWillUnmount event. However, in order to make this time more accurate it will subtract idle time. 

This means that: `Component Engaged Time = ComponentWillUnmount timestamp - ComponentDidMount timestamp - idle time`.  

To see this metric in Azure portal you need to navigate to Application Insights resource, select Metrics Explorer from the top menu and configure one of the empty charts to display Custom metrics "React Component Engaged Time" grouped by Component Name. It can take up to 10 minutes for new custom metric to appear in Azure Portal.

<img img width="550" src="https://cloud.githubusercontent.com/assets/3801171/18735093/eeac0496-802f-11e6-9403-50c6fe8aaf9e.png"/>

#### Set Application Context

To augment all telemetry with aditional properties use ReactAI.setAppContext method:

E.g.
```javascript
    ReactAI.setAppContext({urlReferrer:document.referrer});
```

This will add urlReferrer property to all page views, ajax calls, exceptions and other telemetry sent to Application Insights:

<img src ="https://cloud.githubusercontent.com/assets/3801171/18721651/43c4861e-7fe6-11e6-8541-3614111acc8f.png"/>

#### Get AppInsights object

Use following method to get original AppInsight object:

```javascript
    var AppInsigts = ReactAI.ai();
```

Refer to [this doc](https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md) for  information on Application Insights SDK JavaScript API. 


