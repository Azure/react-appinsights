// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ApplicationInsights, ITelemetryItem } from "@microsoft/applicationinsights-web";
import { Action, History, Location } from "history";
import { IReactAISettings } from ".";

export default class ReactAI {
  public static initialize(settings: IReactAISettings): void {
    this.debug = settings.debug;
    if (!this.ai) {
      this.ai = new ApplicationInsights({ config: { instrumentationKey: settings.instrumentationKey }, queue: [] });
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

  public static get Instance(): ReactAI {
    return this.instance;
  }

  public static get RootInstance(): ApplicationInsights {
    return this.ai;
  }

  public static get Context(): { [key: string]: any } {
    return this.contextProps || {};
  }

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
