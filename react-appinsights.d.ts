// Type definitions for react-appinsights 1.0.5
// Project: https://github.com/anastasiia-zolochevska/react-appinsights
// Definitions by: Kenneth Kolstad <https://github.com/kkolstad>
// TypeScript Version: 2.7
declare module 'react-appinsights' {
    import * as React from 'react';
    import { History } from 'history';
    interface IReactAI {
        init(
            appInsightsOptions: Microsoft.ApplicationInsights.IConfig,
            history: History
        ): void;
        ai(): Microsoft.ApplicationInsights.IAppInsights;
        trackRouterChange(): void;
        setAppContext(properties: {}): void;
    }
  
    export class TrackedComponent<P = {}, S = {}> extends React.Component<P, S> {}
  
    let ReactAI: IReactAI;
    export default ReactAI;
}
  