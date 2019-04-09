// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import createHistory from "history/createBrowserHistory";
import { IReactAISettings, reactAI } from '../src';

const IKEY: string = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx";

let appInsights: ApplicationInsights;

describe("ReactAI", () => {

  function init(reactAIconfig: IReactAISettings) {
    reactAI._trackInitialPageViewInternal = jest.fn();
    appInsights = new ApplicationInsights({
      config: {
        extensionConfig: {
          [reactAI.extensionId]: reactAIconfig
        },
        extensions: [reactAI],
        instrumentationKey: IKEY
      }
    });
    appInsights.loadAppInsights();
  }

  it("initializes correctly", () => {
    init({});
    expect(reactAI).not.toBe(undefined);
    expect(appInsights).not.toBe(undefined);
    expect(reactAI.isDebugMode).toBe(false);
  });

  it("sets debug mode as expected", () => {
    init({ debug: true });
    expect(reactAI.isDebugMode).toBe(true);
  });

  it("sets context correctly", () => {
    init({});
    reactAI.setContext({ prop1: "value1", prop2: "value2" });
    expect(reactAI.context.prop1).toBe("value1");
    expect(reactAI.context.prop2).toBe("value2");
  });

  it("resets context correctly", () => {
    init({});
    reactAI.setContext({ prop1: "value1" });
    expect(reactAI.context.prop1).toBe("value1");

    reactAI.setContext({ prop2: "value2" }, true);
    expect(reactAI.context.prop2).toBe("value2");
    expect(reactAI.context.prop1).toBe(undefined);
  });

  it("resets context on initialization", () => {
    init({ initialContext: { prop1: "value1" } });
    expect(reactAI.context.prop1).toBe("value1");
    expect(reactAI.context.prop2).toBe(undefined);
  });

  it("tracks page views", () => {
    const emulatedHistory = createHistory();
    const initialContext = { prop1: "value1" };
    jest.useFakeTimers();
    init({ debug: false, initialContext, history: emulatedHistory });

    // Mock the internal instance of AppInsights
    reactAI.appInsights.trackPageView = jest.fn();
    reactAI.appInsights.addTelemetryInitializer = jest.fn();

    const pageViewTelemetry1 = { uri: "/", properties: initialContext };
    expect(reactAI._trackInitialPageViewInternal).toHaveBeenCalledTimes(1);
    expect(reactAI._trackInitialPageViewInternal).toHaveBeenNthCalledWith(1, pageViewTelemetry1);

    // Emulate navigation to different URL-addressed pages
    emulatedHistory.push("/home", { some: "state" });
    emulatedHistory.push("/new-fancy-page");
    jest.runOnlyPendingTimers();

    const pageViewTelemetry2 = { uri: "/home", properties: initialContext };
    const pageViewTelemetry3 = { uri: "/new-fancy-page", properties: initialContext };
    expect(reactAI.appInsights.trackPageView).toHaveBeenCalledTimes(2);
    expect(reactAI.appInsights.trackPageView).toHaveBeenNthCalledWith(1, pageViewTelemetry2);
    expect(reactAI.appInsights.trackPageView).toHaveBeenNthCalledWith(2, pageViewTelemetry3);
  });
});
