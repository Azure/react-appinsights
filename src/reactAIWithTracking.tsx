import { IMetricTelemetry } from "@microsoft/applicationinsights-web";
import * as React from "react";
import IdleTimer from "react-idle-timer";
import ReactAI from "./ReactAI";

export function reactAIWithTracking<P>(Component: React.ComponentType<P>): React.ComponentClass<P> {
  class ReactAIWrappedComponent extends React.Component<P> {
    private idleTimer: IdleTimer | null;

    constructor(props: P) {
      super(props);
      this.idleTimer = null;
    }

    public componentWillUnmount() {
      if (!this.idleTimer) {
        throw new Error("IdleTimer isn't initialized.");
      }

      const metricData: IMetricTelemetry = {
        average: this.idleTimer.getElapsedTime() / 1000,
        name: "React Component Engaged Time (seconds)",
        sampleCount: 1
      };

      const additionalProperties: { [key: string]: any } = { "Component Name": Component.constructor().name };

      if (!ReactAI.RootInstance) {
        throw new Error("ReactAI isn't initialized yet.");
      }

      if (ReactAI.IsDebugMode) {
        console.log("Tracking metric: ", metricData, additionalProperties);
      }

      ReactAI.RootInstance.trackMetric(metricData, additionalProperties);
    }

    public render() {
      return (
        <div>
          <IdleTimer
            ref={(ref: IdleTimer) => {
              this.idleTimer = ref;
            }}
            element={document}
            onActive={this.onActive}
            onIdle={this.onIdle}
            onAction={this.onAction}
            timeout={1000 * 60 * 15}
          />
          <Component {...this.props} />
        </div>
      );
    }

    private onAction = (e: Event) => {
      if (ReactAI.IsDebugMode) {
        console.log("ReactAIWithTracking:onAction: user is interacting with component.", "Time to idle: ", this.idleTimer ? this.idleTimer.getRemainingTime() : undefined);
      }
    };

    private onActive = (e: Event) => {
      if (ReactAI.IsDebugMode) {
        console.log("ReactAIWithTracking:onActive: user is interacting with component.", "Time to idle: ", this.idleTimer ? this.idleTimer.getRemainingTime() : undefined);        
      }
    };

    private onIdle = (e: Event) => {
      if (ReactAI.IsDebugMode) {
        console.log("ReactAIWithTracking:onIdle: user is idle on component.", "Last active time: ", this.idleTimer ? this.idleTimer.getLastActiveTime() : undefined);
      }
    };
  }

  return ReactAIWrappedComponent;
}

export default reactAIWithTracking;
