// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import ReactAI from "../src/ReactAI";

describe("ReactAI ->", () => {
  test("Initializes correctly", () => {
    ReactAI.initialize({ instrumentationKey: "my-i-key" });
    expect(ReactAI.RootInstance).not.toBe(undefined);
    expect(ReactAI.RootInstance.config.instrumentationKey).toBe("my-i-key");
  });

  test("Sets debug mode as expected", () => {
    ReactAI.initialize({ instrumentationKey: "my-i-key", debug: true });
    expect(ReactAI.IsDebugMode).toBe(true);
  });

  test("Sets context correctly", () => {
    ReactAI.initialize({ instrumentationKey: "my-i-key" });
    ReactAI.setContext({ prop1: "value1", prop2: "value2" });
    expect(ReactAI.Context.prop1).toBe("value1");
    expect(ReactAI.Context.prop2).toBe("value2");
  });

  test("Resets context correctly", () => {
    ReactAI.initialize({ instrumentationKey: "my-i-key" });
    ReactAI.setContext({ prop3: "value3" }, true);
    expect(ReactAI.Context.prop3).toBe("value3");
    expect(ReactAI.Context.prop1).toBe(undefined);
  });

  test("Resets context on initialization", () => {
    ReactAI.initialize({ instrumentationKey: "my-i-key", initialContext: { prop1: "value1" } });
    expect(ReactAI.Context.prop1).toBe("value1");
    expect(ReactAI.Context.prop2).toBe(undefined);
    expect(ReactAI.Context.prop3).toBe(undefined);
  });
});
