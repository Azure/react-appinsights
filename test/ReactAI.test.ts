// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.


describe("ReactAI", () => {

  beforeEach(() => {
    jest.resetModules();
  });

  it("fails initialization without instrumentation key", () => {
    const ReactAI = require('../src/ReactAI').default;
    expect(() => ReactAI.initialize({ instrumentationKey: "" })).toThrow();
    expect(() => ReactAI.initialize({})).toThrow();
  });

  it("initializes correctly", () => {
    const ReactAI = require('../src/ReactAI').default;
    ReactAI.initialize({ instrumentationKey: "my-i-key" });
    expect(ReactAI.rootInstance).not.toBe(undefined);
    expect(ReactAI.rootInstance.config.instrumentationKey).toBe("my-i-key");
  });

  it("sets debug mode as expected", () => {
    const ReactAI = require('../src/ReactAI').default;
    ReactAI.initialize({ instrumentationKey: "my-i-key", debug: true });
    expect(ReactAI.isDebugMode).toBe(true);
  });

  it("sets context correctly", () => {
    const ReactAI = require('../src/ReactAI').default;
    ReactAI.initialize({ instrumentationKey: "my-i-key" });
    ReactAI.setContext({ prop1: "value1", prop2: "value2" });
    expect(ReactAI.context.prop1).toBe("value1");
    expect(ReactAI.context.prop2).toBe("value2");
  });

  it("resets context correctly", () => {
    const ReactAI = require('../src/ReactAI').default;
    ReactAI.initialize({ instrumentationKey: "my-i-key" });
    ReactAI.setContext({ prop3: "value3" }, true);
    expect(ReactAI.context.prop3).toBe("value3");
    expect(ReactAI.context.prop1).toBe(undefined);
  });

  it("resets context on initialization", () => {
    const ReactAI = require('../src/ReactAI').default;
    ReactAI.initialize({ instrumentationKey: "my-i-key", initialContext: { prop1: "value1" } });
    expect(ReactAI.context.prop1).toBe("value1");
    expect(ReactAI.context.prop2).toBe(undefined);
    expect(ReactAI.context.prop3).toBe(undefined);
  });
});
