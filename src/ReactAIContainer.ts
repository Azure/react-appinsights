// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ApplicationInsights, ITelemetryPlugin } from '@microsoft/applicationinsights-web';
import { ReactAI } from ".";

/**
 * Module to include Microsoft Application Insights in React applications.
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
        let exts = <ITelemetryPlugin[]>(<any>this.ai.core)._extensions;
        exts = exts ? exts : [];
        for (let i = 0; i < exts.length; i++) {
            if (exts[i].identifier === ReactAI.extensionIdentifier) {
                found = true;
                break;
            }
        };

        if (!found) {
            throw new Error("Input ReactAI extension is not one of extensions in appInsights instance");
        }
    }

    /**
    * Returns the underlying root instance of Application Insights.
    *
    * @readonly
    * @static
    * @type {ApplicationInsights}
    * @memberof ReactAI
    */
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