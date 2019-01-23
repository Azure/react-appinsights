// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import createHistory from "history/createBrowserHistory";

const IKEY: string = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx";

describe("ReactAI", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("fails initialization without instrumentation key", () => {
    const ReactAI = require("../src/ReactAI").default;
    expect(() => ReactAI.initialize({ instrumentationKey: "" })).toThrow();
    expect(() => ReactAI.initialize({})).toThrow();
  });

  it("initializes correctly", () => {
    const ReactAI = require("../src/ReactAI").default;
    ReactAI.initialize({ instrumentationKey: IKEY });
    expect(ReactAI.rootInstance).not.toBe(undefined);
    expect(ReactAI.rootInstance.config.instrumentationKey).toBe(IKEY);
  });

  it("sets debug mode as expected", () => {
    const ReactAI = require("../src/ReactAI").default;
    ReactAI.initialize({ instrumentationKey: IKEY, debug: true });
    expect(ReactAI.isDebugMode).toBe(true);
  });

  it("sets context correctly", () => {
    const ReactAI = require("../src/ReactAI").default;
    ReactAI.initialize({ instrumentationKey: IKEY });
    ReactAI.setContext({ prop1: "value1", prop2: "value2" });
    expect(ReactAI.context.prop1).toBe("value1");
    expect(ReactAI.context.prop2).toBe("value2");
  });

  it("resets context correctly", () => {
    const ReactAI = require("../src/ReactAI").default;
    ReactAI.initialize({ instrumentationKey: IKEY });
    ReactAI.setContext({ prop1: "value1" });
    expect(ReactAI.context.prop1).toBe("value1");
    ReactAI.setContext({ prop3: "value3" }, true);
    expect(ReactAI.context.prop3).toBe("value3");
    expect(ReactAI.context.prop1).toBe(undefined);
  });

  it("resets context on initialization", () => {
    const ReactAI = require("../src/ReactAI").default;
    ReactAI.initialize({ instrumentationKey: IKEY, initialContext: { prop1: "value1" } });
    expect(ReactAI.context.prop1).toBe("value1");
    expect(ReactAI.context.prop2).toBe(undefined);
    expect(ReactAI.context.prop3).toBe(undefined);
  });

  it("tracks page views", () => {
    const ReactAI = require("../src/ReactAI").default;
    const emulatedHistory = createHistory();
    const initialContext = { prop1: "value1" };
    ReactAI.initialize({ instrumentationKey: IKEY, initialContext, debug: true, history: emulatedHistory });
    ReactAI.rootInstance.trackPageView = jest.fn();
    jest.useFakeTimers();

    // emulate change in history
    emulatedHistory.push("/home", { some: "state" });
    emulatedHistory.push("/new-fancy-page");
    jest.runOnlyPendingTimers();

    const pageViewTelemetry1 = { uri: "/home", properties: initialContext };
    const pageViewTelemetry2 = { uri: "/new-fancy-page", properties: initialContext };
    expect(ReactAI.rootInstance.trackPageView).toHaveBeenCalledTimes(2);
    expect(ReactAI.rootInstance.trackPageView).toHaveBeenNthCalledWith(1, pageViewTelemetry1);
    expect(ReactAI.rootInstance.trackPageView).toHaveBeenNthCalledWith(2, pageViewTelemetry2);
  });
});
