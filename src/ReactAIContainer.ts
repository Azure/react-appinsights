// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ApplicationInsights, ITelemetryPlugin } from '@microsoft/applicationinsights-web';
import { ReactAI } from ".";

/**
 * Utility singleton object that contains instances of ReactAI and Application Insights.
 * This is used in the withAITracking higher-order component function.
 *
 * @export
 * @class ReactAIContainer
 */
export default class ReactAIContainer {

    private ai!: ApplicationInsights;
    private _reactAI: ReactAI;
    public constructor(appInsights: ApplicationInsights, reactAI: ReactAI) {
        if (appInsights === undefined || appInsights === null) {
            throw new Error("Invalid input for application insights");
        }
        this.ai = appInsights;

        this._reactAI = reactAI;
        if (this._reactAI === undefined || this._reactAI === null) {
            throw new Error("Invalid input for ReactAI");
        }

        let found = false;
        // In version 2.0 of applicationinsights-web, any cast is not required as the property _extensions is public 
        let exts = <ITelemetryPlugin[]>(<any>this.ai.core)._extensions;
        exts = exts ? exts : [];
        for (let i = 0; i < exts.length; i++) {
            if (exts[i].identifier === ReactAI.extensionId) {
                found = true;
                break;
            }
        };

        if (!found) {
            throw new Error("Input ReactAI extension is not one of extensions in appInsights instance");
        }
    }

    public get reactAI(): ReactAI {
        return this._reactAI;
    }

    public get applicationInsights(): ApplicationInsights {
        return this.ai;
    }

    private static _defaultValue: ReactAIContainer;
    public static get defaultReactAIContainer(): ReactAIContainer {
        return ReactAIContainer._defaultValue;
    }

    public static set defaultReactAIContainer(container: ReactAIContainer) {
        ReactAIContainer._defaultValue = container;
    }
}