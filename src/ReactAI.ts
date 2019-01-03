// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ApplicationInsights, IConfig, IConfiguration, ITelemetryItem } from "@microsoft/applicationinsights-web";
import { Action, History, Location } from "history";
import { IReactAISettings } from ".";

/**
 * Module to include Microsoft Application Insights in React applications
 *
 * @export
 * @class ReactAI
 */
export default class ReactAI {
  /**
   * Initializaes a singleton instance of ReactAI based on supplied parameters
   *
   * @static
   * @param {IReactAISettings} settings
   * @memberof ReactAI
   */
  public static initialize(settings: IReactAISettings & IConfiguration & IConfig): void {
    this.debug = settings.debug;
    if (!this.ai) {
      this.ai = new ApplicationInsights({ config: settings, queue: [] });
      this.ai.loadAppInsights();
      if (this.debug) {
        console.log("ReactAI: Application Insights initialized with:", settings);
      }
    }
    this.setContext(settings.initialContext || {}, true);
    this.ai.addTelemetryInitializer(this.customDimensionsInitializer());
    if (settings.history) {
      this.addHistoryListener(settings.history);
    }
  }

  /**
   * Returns underlying root instance of Application Insights
   *
   * @readonly
   * @static
   * @type {ApplicationInsights}
   * @memberof ReactAI
   */
  public static get RootInstance(): ApplicationInsights {
    return this.ai;
  }

  /**
   * Returns current value of context/custom dimensions
   *
   * @readonly
   * @static
   * @type {{ [key: string]: any }}
   * @memberof ReactAI
   */
  public static get Context(): { [key: string]: any } {
    return this.contextProps || {};
  }

  /**
   * Returns if ReactAI is in debug mode
   *
   * @readonly
   * @static
   * @type {boolean}
   * @memberof ReactAI
   */
  public static get IsDebugMode(): boolean {
    return this.debug ? true : false;
  }

  /**
   * Set custom context/custom dimensions for Application Insights
   *
   * @static
   * @param {{ [key: string]: any }} properties - custom properties to add to all outbound Application Insights telemetry
   * @param {boolean} [clearPrevious=false] - if false(default) multiple calls to setContext will append to/overwrite existing custom dimensions, if true the values are reset
   * @memberof ReactAI
   */
  public static setContext(properties: { [key: string]: any }, clearPrevious: boolean = false): void {
    if (clearPrevious) {
      this.contextProps = {};
      if (this.debug) {
        console.log("Context reset.");
      }
    }
    properties = properties || {};
    for (const key in properties) {
      if (properties.hasOwnProperty(key)) {
        this.contextProps[key] = properties[key];
      }
    }
    if (this.debug) {
      console.log("Context set to:", this.contextProps);
    }
  }

  private static instance: ReactAI = new ReactAI();
  private static ai: ApplicationInsights;
  private static contextProps: { [key: string]: any } = {};
  private static debug?: boolean;

  private static customDimensionsInitializer(): (item: ITelemetryItem) => boolean | void {
    return (envelope: ITelemetryItem) => {
      envelope.data = envelope.data || {};
      const props = this.Context;
      for (const key in props) {
        if (props.hasOwnProperty(key)) {
          envelope.data[key] = props[key];
        }
      }
    };
  }

  private static addHistoryListener(history: History): void {
    history.listen(
      (location: Location, action: Action): void => {
        this.ai.trackPageView({});
        if (this.debug) {
          console.log("ReactAI: Recording page view", location, action);
        }
      }
    );
  }

  private constructor() {
    if (ReactAI.instance) {
      throw new Error("ReactAI: use ReactAI.Instance() instead.");
    }
    ReactAI.instance = this;
  }
}
