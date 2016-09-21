# react-ai
### React Application Insights Module
JavaScript module to include [Application Insights](https://azure.microsoft.com/en-us/services/application-insights/) to application built with React.

## Installation

With [npm](https://www.npmjs.com/):
```bash
npm install react-ai --save
```

With [bower](http://bower.io/):
```bash
bower install react-ai --save
```

## Usage

1. To initialize AppInsigt

import {ReactAI} from 'react-ai';
ReactAI.init({instrumentationKey:'d4b3645a-9207-480c-b08c-ede7624ffd7f'}, browserHistory);


2. To enable usage tracking of React component, it should be inherited from TrackedComponent  

import {TrackedComponent} from 'react-ai';
class MyComponent extends TrackedComponent{
    ...
}

