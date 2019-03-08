// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ApplicationInsights, IMetricTelemetry } from "@microsoft/applicationinsights-web";
import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import { ReactAI, withAITracking } from "../src";
import { TestComponent } from "./TestComponent";

const IKEY: string = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx";
Enzyme.configure({ adapter: new Adapter.default() });

let trackMetricSpy: jest.SpyInstance;
let reactAI: ReactAI;
let appInsights: ApplicationInsights;

describe("withAITracking(TestComponent)", () => {
  const TestComponentWithTracking = withAITracking(TestComponent);
  const trackedTestComponentWrapper = () => Enzyme.shallow(<TestComponentWithTracking />);

  beforeEach(() => {
    reactAI = new ReactAI();
    appInsights = new ApplicationInsights({
      config: {
        extensionConfig: {
          [ReactAI.extensionId]: { debug: false }
        },
        extensions: [reactAI],
        instrumentationKey: IKEY
      }
    });
    appInsights.loadAppInsights();
    trackMetricSpy = jest.spyOn(ReactAI.appInsights, "trackMetric");
  });

  it("should wrap <TestComponent />", () => {
    const component = trackedTestComponentWrapper();
    expect(component.find(TestComponent).length).toBe(1);
  });

  it("shouldn't call trackMetric if there's no user interaction", () => {
    const component = trackedTestComponentWrapper();
    component.unmount();
    expect(trackMetricSpy).toHaveBeenCalledTimes(0);
  });

  it("should call trackMetric if there is user interaction", () => {
    const component = trackedTestComponentWrapper();
    component.simulate("keydown");
    component.unmount();

    expect(trackMetricSpy).toHaveBeenCalledTimes(1);
    const metricTelemetry: IMetricTelemetry = {
      average: expect.any(Number),
      name: "React Component Engaged Time (seconds)",
      sampleCount: 1
    };
    expect(trackMetricSpy).toHaveBeenCalledWith(metricTelemetry, { "Component Name": "TestComponent" });
  });

  it("should use the passed component name in trackMetric", () => {
    const TestComponentWithTrackingCustomName = withAITracking(TestComponent, "MyCustomName");
    const component = Enzyme.shallow(<TestComponentWithTrackingCustomName />);
    component.simulate("mousemove");
    component.unmount();

    expect(trackMetricSpy).toHaveBeenCalledTimes(1);
    const metricTelemetry: IMetricTelemetry = {
      average: expect.any(Number),
      name: "React Component Engaged Time (seconds)",
      sampleCount: 1
    };
    expect(trackMetricSpy).toHaveBeenCalledWith(metricTelemetry, { "Component Name": "MyCustomName" });
  });
});
