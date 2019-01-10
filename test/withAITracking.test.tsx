// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { IMetricTelemetry } from "@microsoft/applicationinsights-web";
import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import { ReactAI, withAITracking } from "../src";
import { TestComponent } from "./TestComponent";

Enzyme.configure({ adapter: new Adapter.default() });

describe("<TestComponentWithTracking /> i.e. withAITracking(TestComponent)", () => {
  const TestComponentWithTracking = withAITracking(TestComponent);
  const trackedTestComponentWrapper = () => Enzyme.shallow(<TestComponentWithTracking />);

  it("should wrap <TestComponent />", () => {
    const component = trackedTestComponentWrapper();
    expect(component.find(TestComponent).length).toBe(1);
  });

  describe("When ReactAI is not initialized", () => {
    it("should throw error when unmounting", () => {
      expect(() => {
        const component = trackedTestComponentWrapper();
        component.unmount();
      }).toThrowError("ReactAI isn't initialized yet");
    });
  });

  describe("When ReactAI is initialized", () => {
    let trackMetricSpy: jest.SpyInstance;

    beforeEach(() => {
      ReactAI.initialize({ instrumentationKey: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx", debug: false });
      trackMetricSpy = jest.spyOn(ReactAI.rootInstance, "trackMetric");
      trackMetricSpy.mockReset();
    });

    describe("When component is unmounted", () => {
      it("shouldn't call trackMetric if no user interaction", () => {
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
    });

    describe("When a custom component name is passed", () => {
      it("should use the passed component name in trackMetric", () => {
        const TestComponentWithTracking = withAITracking(TestComponent, "MyCustomName");
        const component = Enzyme.shallow(<TestComponentWithTracking />);
        component.simulate("mousemove");
        component.unmount();

        expect(trackMetricSpy).toHaveBeenCalledTimes(1);

        const metricTelemetry: IMetricTelemetry = {
          average: expect.any(Number),
          name: "React Component Engaged Time (seconds)",
          sampleCount: 1
        };

        expect(trackMetricSpy).toHaveBeenCalledWith(metricTelemetry, { "Component Name": "MyCustomName" });
      })
    });
  });
});
