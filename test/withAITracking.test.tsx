// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ApplicationInsights, IMetricTelemetry } from "@microsoft/applicationinsights-web";
import * as Enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import { ReactAI, ReactAIContainer, withAITracking } from "../src";
import { TestComponent } from "./TestComponent";

const IKEY: string = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx";
Enzyme.configure({ adapter: new Adapter.default() });

describe("ReactAIContainer setup scenarios", () => {
  it("should throw an error when ReactAI is not set up as an extension of AppInsights", () => {
    expect(() => {
      let reactAI: ReactAI = new ReactAI();
      let appInsights = new ApplicationInsights({
        config: {
          instrumentationKey: IKEY,
        }
      });
      appInsights.loadAppInsights();

      ReactAIContainer.defaultReactAIContainer = new ReactAIContainer(appInsights, reactAI);
    }).toThrowError("Input ReactAI extension is not one of extensions in appInsights instance");
  });

  it("should throw an error when ReactAI is not initialized", () => {
    expect(() => {
      let reactAI!: ReactAI;
      let appInsights = new ApplicationInsights({
        config: {
          instrumentationKey: IKEY,
        }
      });
      appInsights.loadAppInsights();

      ReactAIContainer.defaultReactAIContainer = new ReactAIContainer(appInsights, reactAI);
    }).toThrowError("Invalid input for ReactAI");
  });

  it("should throw an error when AppInsights is not initialized", () => {
    expect(() => {
      let reactAI: ReactAI = new ReactAI();
      let appInsights!: ApplicationInsights;

      ReactAIContainer.defaultReactAIContainer = new ReactAIContainer(appInsights, reactAI);
    }).toThrowError("Invalid input for application insights");
  });
});

describe("withAITracking(TestComponent)", () => {
  let reactAI = new ReactAI();
  let appInsights = new ApplicationInsights({
    config: {
      instrumentationKey: IKEY,
      extensions: [reactAI],
      extensionConfig: {
        [ReactAI.extensionId]: { debug: false }
      }
    }
  });
  appInsights.loadAppInsights();
  ReactAIContainer.defaultReactAIContainer = new ReactAIContainer(appInsights, reactAI);

  const TestComponentWithTracking = withAITracking(TestComponent);
  const trackedTestComponentWrapper = () => Enzyme.shallow(<TestComponentWithTracking />);

  it("should wrap <TestComponent />", () => {
    const component = trackedTestComponentWrapper();
    expect(component.find(TestComponent).length).toBe(1);
  });

  describe("When ReactAI is initialized", () => {
    let trackMetricSpy: jest.SpyInstance;;

    beforeEach(() => {
      trackMetricSpy = jest.spyOn(appInsights, "trackMetric");
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
  });
});
