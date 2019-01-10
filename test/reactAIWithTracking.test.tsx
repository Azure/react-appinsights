import { IMetricTelemetry } from "@microsoft/applicationinsights-web";
import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import { ReactAI } from "../src";
import reactAIWithTracking from "../src/reactAIWithTracking";
import { TestComponent } from "./TestComponent";

Enzyme.configure({ adapter: new Adapter.default() });

describe("<TestComponentWithTracking /> i.e. reactAiWithTracking(TestComponent)", () => {
  const TestComponentWithTracking = reactAIWithTracking(TestComponent);
  const trackedTestComponentWrapper = () => Enzyme.shallow(<TestComponentWithTracking />);

  it("Should wrap <TestComponent />", () => {
    const component = trackedTestComponentWrapper();
    expect(component.find(TestComponent).length).toBe(1);
  });

  describe("When ReactAI is not initialized", () => {
    it("should throw error when unmounting", () => {
      expect(() => {
        const component = trackedTestComponentWrapper();
        component.unmount();
      }).toThrowError(/ReactAI isn't initialized yet/);
    });
  });

  describe("When ReactAI is initialized", () => {
    beforeEach(() => {
      ReactAI.initialize({ instrumentationKey: "my-i-key", debug: false });
    });

    describe("When component is unmounted", () => {
      it("shouldn't call trackMetric if no user interaction", () => {
        const trackMetricSpy = jest.spyOn(ReactAI.RootInstance, "trackMetric");
        const component = trackedTestComponentWrapper();
        component.unmount();
        expect(trackMetricSpy).toHaveBeenCalledTimes(0);
      });

      it("should call trackMetric if there is user interaction", () => {
        const trackMetricSpy = jest.spyOn(ReactAI.RootInstance, "trackMetric");
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
  });
});
