# appinsights-react

[![npm](https://img.shields.io/npm/v/appinsights-react.svg)](https://www.npmjs.com/package/appinsights-react) [![Downloads per month](https://img.shields.io/npm/dm/appinsights-react.svg)](https://www.npmjs.com/package/appinsights-react) [![dependencies](https://david-dm.org/hiraldesai/appinsights-react.svg)](https://david-dm.org/hiraldesai/appinsights-react)

NPM library that wraps Microsoft Application Insights new [JavaScript SDK](https://github.com/Microsoft/ApplicationInsights-JS/tree/master/AISKU) for applications built with [React](https://reactjs.org/).

## Installation

With npm:
```bash
npm install --save appinsights-react
```

## Usage

* Step 1 - initialize by adding the following to your application (preferably to an entry point like index.js, index.tsx, etc.). Instrumentation Key for your Application Insights instance can be obtained from  [Azure Portal](https://portal.azure.com).

#### Minimal initialization without PageView tracking

```typescript
import ReactAI from 'appinsights-react';
ReactAI.initialize({ instrumentationKey:'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx' });
```

#### Initialization with PageView tracking

```typescript
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory()
ReactAI.initialize({ instrumentationKey:'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx', history: history });

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById("root")
);
```

#### The initialization settings has following properties available
```typescript
interface IReactAISettings {
  instrumentationKey: string;   // Required - get it from Azure Portal
  initialContext?: { [key: string]: any };  // If you want to initialize with custom context
  history?: History;    // React router history
  debug?: boolean;  // Debug mode: to see messages on browser console
}
```

* Step 2 - set application context properties (optional). If you want all the telemetry data posted to Application Insights (traces, metrics, events, page views, exceptions) to have some extra properties specified by your application. Add this snippet inside your React component that receives the property to be collected by Application Insights.

```typescript
ReactAI.setContext({TenantId: this.props.tenantId});
```

