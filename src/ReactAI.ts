// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ApplicationInsights, IAppInsightsCore, IConfiguration, IPageViewTelemetry, ITelemetryItem, ITelemetryPlugin } from "@microsoft/applicationinsights-web";
import { Action, Location } from "history";
import { IReactAISettings } from ".";

/**
 * Module to include Microsoft Application Insights in React applications.
 *
 * @export
 * @class ReactAI
 */
export class ReactAI implements ITelemetryPlugin {

  private constructor() {
    // if (ReactAI.instance) {
    //   throw new Error("ReactAI: use ReactAI.Instance() instead.");
    // }
    // ReactAI.instance = this;
    this.processTelemetry = this.customDimensionsInitializer.bind(this);
  }

  /**
   * Returns the underlying root instance of Application Insights.
   *
  //  * @readonly
  //  * @static
  //  * @type {ApplicationInsights}
  //  * @memberof ReactAI
   */

  private _applicationInsights: ApplicationInsights;
  private _nextPlugin: ITelemetryPlugin;

  public get rootInstance(): ApplicationInsights {
    return this._applicationInsights;
  }

  public processTelemetry: (env: ITelemetryItem) => void;

  public priority = 200;

  public identifier = "ApplicationInsightsReactUsage";

  public setNextPlugin(plugin: ITelemetryPlugin) {
    this._nextPlugin = plugin;
  }

  /**
   * Returns the current value of context/custom dimensions.
   *
   * @readonly
   * @static
   * @type {{ [key: string]: any }}
   * @memberof ReactAI
   */
  public get context(): { [key: string]: any } {
    return this.contextProps || {};
  }

  /**
   * Returns if ReactAI is in debug mode.
   *
   * @readonly
   * @static
   * @type {boolean}
   * @memberof ReactAI
   */
  public get isDebugMode(): boolean {
    return this.debug ? true : false;
  }
  /**
   * Initializes a singleton instance of ReactAI based on supplied parameters.
   *
   * @static
   * @param {IReactAISettings} settings
   * @memberof ReactAI
   */
  public initialize(config: IConfiguration, core: IAppInsightsCore, extensions: ITelemetryPlugin[]): void {
    let settings = config && config.extensionConfig && config.extensionConfig[this.identifier] ?
      <IReactAISettings>(config.extensionConfig[this.identifier]) : { debug: false };

    let idx = extensions.indexOf((e: ITelemetryPlugin) => e.identifier === 'ApplicationInsightsAnalytics');
    if (idx > 0) {
      this._applicationInsights = <ApplicationInsights>extensions[idx];
    }

    this.debug = settings.debug;
    this.setContext(settings.initialContext || {}, true);
    if (settings.history) {
      this.addHistoryListener(settings.history);
    }
  }

  /**
   * Set custom context/custom dimensions for Application Insights
   *
   * @static
   * @param {{ [key: string]: any }} properties - custom properties to add to all outbound Application Insights telemetry
   * @param {boolean} [clearPrevious=false] - if false(default) multiple calls to setContext will append to/overwrite existing custom dimensions, if true the values are reset
   * @memberof ReactAI
   */
  public setContext(properties: { [key: string]: any }, clearPrevious: boolean = false): void {
    if (clearPrevious) {
      this.contextProps = {};
      this.debugLog("context is reset.");
    }
    properties = properties || {};
    for (const key in properties) {
      if (properties.hasOwnProperty(key)) {
        this.contextProps[key] = properties[key];
      }
    }
    this.debugLog("context is set to:", this.context);
  }

  // private instance: ReactAI = new ReactAI();
  // private ai: ApplicationInsights;
  private contextProps: { [key: string]: any } = {};
  private debug?: boolean;

  private customDimensionsInitializer(envelope: ITelemetryItem): void {
    envelope.data = envelope.data || {};
    const props = this.context;
    for (const key in props) {
      if (props.hasOwnProperty(key)) {
        envelope.data[key] = props[key];
      }
    }

    if (this._nextPlugin) {
      this._nextPlugin.processTelemetry(envelope);
    }
  }

  private addHistoryListener(history: History): void {
    history.listen(
      (location: Location, action: Action): void => {
        // Timeout to ensure any changes to the DOM made by route changes get included in pageView telemetry
        setTimeout(() => {
          const pageViewTelemetry: IPageViewTelemetry = { uri: location.pathname, properties: this.context };
          this._applicationInsights.trackPageView(pageViewTelemetry);
          this.debugLog("recording page view.", `uri: ${location.pathname} action: ${action}`);
        }, 500);
      }
    );
  }

  private debugLog(message: string, payload?: any): void {
    if (this.isDebugMode) {
      console.log(`ReactAI: ${message}`, payload === undefined ? "" : payload);
    }
  }

}
