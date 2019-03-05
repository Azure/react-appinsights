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
          "[ReactAI.extensionIdentifier]": { debug: false }
        }
      }
    });
    appInsights.loadAppInsights();
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
          [ReactAI.extensionIdentifier]: { debug: true }
        }
      }
    });
    appInsights.loadAppInsights();

    expect(reactAI.isDebugMode).toBe(true);
  });

  it("sets context correctly", () => {
    let reactAI = new ReactAI();
    let appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: IKEY,
        extensions: [reactAI],
        extensionConfig: {
          [ReactAI.extensionIdentifier]: { debug: false }
        }
      }
    });
    appInsights.loadAppInsights();
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
          [ReactAI.extensionIdentifier]: { debug: false }
        }
      }
    });
    appInsights.loadAppInsights();
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
          [ReactAI.extensionIdentifier]: { debug: false, initialContext: { prop1: "value1" } }
        }
      }
    });
    appInsights.loadAppInsights();

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
          [ReactAI.extensionIdentifier]: {
            debug: false, initialContext: initialContext, history: emulatedHistory
          }
        }
      }
    });

    reactAI._trackInitialPageViewInternal = jest.fn();
    jest.useFakeTimers();
    appInsights.loadAppInsights();

    const pageViewTelemetry1 = { uri: "/", properties: initialContext };
    expect(reactAI._trackInitialPageViewInternal).toHaveBeenNthCalledWith(1, pageViewTelemetry1);

    jest.restoreAllMocks();

    // Mock the internal instance of AppInsights
    reactAI._aiInternal.trackPageView = jest.fn();
    reactAI._aiInternal.addTelemetryInitializer = jest.fn();

    // Emulate navigation to different URL-addressed pages
    emulatedHistory.push("/home", { some: "state" });
    emulatedHistory.push("/new-fancy-page");
    jest.runOnlyPendingTimers();

    const pageViewTelemetry2 = { uri: "/home", properties: initialContext };
    const pageViewTelemetry3 = { uri: "/new-fancy-page", properties: initialContext };
    expect(reactAI._aiInternal.trackPageView).toHaveBeenCalledTimes(2);
    expect(reactAI._aiInternal.trackPageView).toHaveBeenNthCalledWith(1, pageViewTelemetry2);
    expect(reactAI._aiInternal.trackPageView).toHaveBeenNthCalledWith(2, pageViewTelemetry3);
  });
});
