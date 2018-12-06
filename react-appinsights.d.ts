// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

declare module "react-appinsights" {
    import "applicationinsights-js";
    import * as React from 'react';
    import { History } from 'history';

    interface ReactAppInsights {
        init(
            appInsightsOptions: Microsoft.ApplicationInsights.IConfig,
            history?: History
        ): void;

        ai(): Microsoft.ApplicationInsights.IAppInsights;

        setAppContext(properties: {}): void;

        withTracking<TProp>(
            WrappedComponent: React.ComponentType<TProp>,
            componentName?: string
        ): React.ComponentType<TProp>;
    }

    const reactAppInsights: ReactAppInsights;
    export default reactAppInsights;
}
