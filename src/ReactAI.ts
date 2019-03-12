// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { PropertiesPluginIdentifier } from "@microsoft/applicationinsights-common";
import { IPlugin } from "@microsoft/applicationinsights-core-js";
import { ApplicationInsights as AppInsightsPlugin, IAppInsightsCore, IConfig, IConfiguration, IPageViewTelemetry, ITelemetryItem, ITelemetryPlugin, PropertiesPlugin } from "@microsoft/applicationinsights-web";
import { Action, History, Location } from "history";
import IReactAISettings from "./IReactAISettings";


/**
 * Module to include Microsoft Application Insights in React applications.
 *
 * @export
 * @class ReactAI  
 */
class ReactAI implements ITelemetryPlugin {
  public extensionId: string = "ApplicationInsightsReactUsage";
  public ApplicationInsightsAnalyticsIdentifier: string = "ApplicationInsightsAnalytics";
  public processTelemetry: (env: ITelemetryItem) => void;
  public identifier = this.extensionId;
  public priority: number = 190;
  public appInsights!: AppInsightsPlugin;
  private propertiesPlugin: PropertiesPlugin;

  private nextPlugin!: ITelemetryPlugin;
  private contextProps: { [key: string]: any } = {};
  private debug: boolean = false;

  public constructor() {
    this.processTelemetry = this.customDimensionsInitializer.bind(this);
  }

  public setNextPlugin(plugin: ITelemetryPlugin) {
    this.nextPlugin = plugin;
  }

  /**
   * Returns the current value of context/custom dimensions.
   *
   * @readonly
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
   * @type {boolean}
   * @memberof ReactAI
   */
  public get isDebugMode(): boolean {
    return this.debug;
  }

  /**
   * Initializes a singleton instance of ReactAI based on supplied parameters.
   *
   * @param {IReactAISettings} settings
   * @memberof ReactAI
   */
  public initialize(
    settings: IReactAISettings & IConfiguration & IConfig,
    core: IAppInsightsCore,
    extensions: IPlugin[]
  ): void {
    const reactAISettings =
      settings.extensionConfig && settings.extensionConfig[this.identifier]
        ? (settings.extensionConfig[this.identifier] as IReactAISettings)
        : { debug: false };
    this.debug = reactAISettings.debug || false;
    this.setContext(reactAISettings.initialContext || {}, true);
    extensions.forEach((ext) => {
      let identifier = (ext as ITelemetryPlugin).identifier;
      if (identifier === this.ApplicationInsightsAnalyticsIdentifier) {
        this.appInsights = ext as AppInsightsPlugin;
      }

      if (identifier === PropertiesPluginIdentifier) {
        this.propertiesPlugin = ext as PropertiesPlugin;
      }
    });
    if (reactAISettings.history) {
      this.addHistoryListener(reactAISettings.history);
      const pageViewTelemetry: IPageViewTelemetry = {
        uri: reactAISettings.history.location.pathname,
        properties: this.context
      };
      this._trackInitialPageViewInternal(pageViewTelemetry);
    }
  }

  // internal only, public method for testing
  public _trackInitialPageViewInternal(telemetry: IPageViewTelemetry) {
    // Record initial page view, since history.listen is not fired for the initial page
    // (see: https://github.com/ReactTraining/history/issues/479#issuecomment-307544999 )
    this.appInsights.trackPageView(telemetry);
    this.debugLog("recording initial page view.", `uri: ${location.pathname}`);
  }

  /**
   * Set custom context/custom dimensions for Application Insights
   *
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

  private customDimensionsInitializer(): (item: ITelemetryItem) => boolean | void {
    return (envelope: ITelemetryItem) => {
      envelope.data = envelope.data || {};
      const props = this.context;
      for (const key in props) {
        if (props.hasOwnProperty(key)) {
          envelope.data[key] = props[key];
        }
      }
    };
  }

  private addHistoryListener(history: History): void {
    history.listen(
      (location: Location, action: Action): void => {
        // Timeout to ensure any changes to the DOM made by route changes get included in pageView telemetry
        setTimeout(() => {
          const pageViewTelemetry: IPageViewTelemetry = { uri: location.pathname, properties: this.context };
          this.appInsights.trackPageView(pageViewTelemetry);
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

export const reactAI = new ReactAI();
