// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import createHistory from "history/createBrowserHistory";
import ReactAI from "../src/ReactAI";

const IKEY: string = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx";

describe("ReactAI", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("initializes correctly", () => {
    let reactAI = new ReactAI();
    let appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: IKEY,
        extensions: [reactAI],
        extensionConfig: {
          "ApplicationInsightsReactUsage": { debug: false }
        }
      }
    });
    expect(reactAI).not.toBe(undefined);
    expect(appInsights).not.toBe(undefined);
  });

  it("sets debug mode as expected", () => {

    let reactAI = new ReactAI();
    let appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: IKEY,
        extensions: [reactAI],
        extensionConfig: {
          "ApplicationInsightsReactUsage": { debug: true }
        }
      }
    });
    expect(reactAI.isDebugMode).toBe(true);
  });

  it("sets context correctly", () => {
    let reactAI = new ReactAI();
    let appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: IKEY,
        extensions: [reactAI],
        extensionConfig: {
          "ApplicationInsightsReactUsage": { debug: false }
        }
      }
    });
    reactAI.setContext({ prop1: "value1", prop2: "value2" });
    expect(reactAI.context.prop1).toBe("value1");
    expect(reactAI.context.prop2).toBe("value2");
  });

  it("resets context correctly", () => {
    let reactAI = new ReactAI();
    let appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: IKEY,
        extensions: [reactAI],
        extensionConfig: {
          "ApplicationInsightsReactUsage": { debug: false }
        }
      }
    });
    reactAI.setContext({ prop1: "value1" });
    expect(reactAI.context.prop1).toBe("value1");
    reactAI.setContext({ prop3: "value3" }, true);
    expect(reactAI.context.prop3).toBe("value3");
    expect(reactAI.context.prop1).toBe(undefined);
  });

  it("resets context on initialization", () => {
    let reactAI = new ReactAI();
    let appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: IKEY,
        extensions: [reactAI],
        extensionConfig: {
          "ApplicationInsightsReactUsage": { debug: false, initialContext: { prop1: "value1" } }
        }
      }
    });

    expect(reactAI.context.prop1).toBe("value1");
    expect(reactAI.context.prop2).toBe(undefined);
    expect(reactAI.context.prop3).toBe(undefined);
  });

  it("tracks page views", () => {

    const emulatedHistory = createHistory();
    const initialContext = { prop1: "value1" };
    let reactAI = new ReactAI();
    // Should call trackPageView upon initialization to track the view of the initial page
    let appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: IKEY,
        extensions: [reactAI],
        extensionConfig: {
          "ApplicationInsightsReactUsage": {
            debug: false, initialContext: initialContext, history: emulatedHistory
          }
        }
      }
    });

    // Mock the internal instance of AppInsights
    appInsights.trackPageView = jest.fn();
    appInsights.addTelemetryInitializer = jest.fn();
    jest.useFakeTimers();


    // Emulate navigation to different URL-addressed pages
    emulatedHistory.push("/home", { some: "state" });
    emulatedHistory.push("/new-fancy-page");
    jest.runOnlyPendingTimers();

    const pageViewTelemetry1 = { uri: "/", properties: initialContext };
    const pageViewTelemetry2 = { uri: "/home", properties: initialContext };
    const pageViewTelemetry3 = { uri: "/new-fancy-page", properties: initialContext };
    expect(appInsights.trackPageView).toHaveBeenCalledTimes(3);
    expect(appInsights.trackPageView).toHaveBeenNthCalledWith(1, pageViewTelemetry1);
    expect(appInsights.trackPageView).toHaveBeenNthCalledWith(2, pageViewTelemetry2);
    expect(appInsights.trackPageView).toHaveBeenNthCalledWith(3, pageViewTelemetry3);
  });
});
