// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import ReactAI from "../src/ReactAI";

describe("ReactAI", () => {
  it("initializes correctly", () => {
    ReactAI.initialize({ instrumentationKey: "my-i-key" });
    expect(ReactAI.rootInstance).not.toBe(undefined);
    expect(ReactAI.rootInstance.config.instrumentationKey).toBe("my-i-key");
  });

  it("sets debug mode as expected", () => {
    ReactAI.initialize({ instrumentationKey: "my-i-key", debug: true });
    expect(ReactAI.isDebugMode).toBe(true);
  });

  it("sets context correctly", () => {
    ReactAI.initialize({ instrumentationKey: "my-i-key" });
    ReactAI.setContext({ prop1: "value1", prop2: "value2" });
    expect(ReactAI.context.prop1).toBe("value1");
    expect(ReactAI.context.prop2).toBe("value2");
  });

  it("resets context correctly", () => {
    ReactAI.initialize({ instrumentationKey: "my-i-key" });
    ReactAI.setContext({ prop3: "value3" }, true);
    expect(ReactAI.context.prop3).toBe("value3");
    expect(ReactAI.context.prop1).toBe(undefined);
  });

  it("resets context on initialization", () => {
    ReactAI.initialize({ instrumentationKey: "my-i-key", initialContext: { prop1: "value1" } });
    expect(ReactAI.context.prop1).toBe("value1");
    expect(ReactAI.context.prop2).toBe(undefined);
    expect(ReactAI.context.prop3).toBe(undefined);
  });
});
