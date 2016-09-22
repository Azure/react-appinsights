# react-ai
### ReactJS Application Insights Module
JavaScript module to include [Application Insights](https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md) in an application built with ReactJS.
It extends standard Application Insights functionality with additional ReactJS specific features:
* Tracking react-router changes.
* Component usage statistics.
* API to extend standard telemetry with additional dimensions.

## Installation

With npm:
```bash
npm install react-ai --save
```

## Usage
#### Initialize AppInsights 
To initialize Application Insights add following to index.js:

```javascript
    import {ReactAI} from 'react-ai';
    ReactAI.init({instrumentationKey:'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx'});
```
See [How to get instrumentation key for Applicaton Insights](https://azure.microsoft.com/en-us/documentation/articles/app-insights-nodejs/) for more details.

#### Track router changes
a. Using react-router history object:
    
```javascript
    import {ReactAI} from 'react-ai';
    import {Router, browserHistory} from 'react-router';

    ReactAI.init({instrumentationKey:'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx'}, browserHistory);
```
Or

b. Using Router.onUpdate:

```javascript
    import {ReactAI} from 'react-ai';
    ReactAI.init({instrumentationKey:'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx'});

    <Router routes={routes} history={browserHistory} onUpdate={ReactAI.trackRouterChange}/>
```


#### Enable React component usage tracking 
To enable React component usage tracking, inherit from TrackedComponent  

```javascript
    import {TrackedComponent} from 'react-ai';

    class MyComponent extends TrackedComponent{
        ...
    }
```

TrackedComponent uses ComponentWillUnmount and ComponentWillMount events to send telemetry, so if you override those, don't forget to call base methods:
```javascript
    componentWillMount() {
        super.componentWillMount();
        ..
    }
```

We will measure time from ComponentWillMount event through ComponentWillUnmount event. However, in order to make this time more accurate it will subtract idle time. 

This means that Router Component Engaged Time = ComponentWillUnmount timestamp - ComponentWillMount timestamp - idle time.  

To see this metric in Azure portal you need to navigate to Application Insights resource, select Metrics Explorer from the top menu and configure one of the empty charts to display Custom metrics "React Component Engaged Time" grouped by Component Name.

<img src="https://cloud.githubusercontent.com/assets/3801171/18735093/eeac0496-802f-11e6-9403-50c6fe8aaf9e.png"/>

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


