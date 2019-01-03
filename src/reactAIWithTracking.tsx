import { IMetricTelemetry } from "@microsoft/applicationinsights-web";
import * as React from "react";
import IdleTimer from "react-idle-timer";
import ReactAI from "./ReactAI";

export function reactAIWithTracking<P>(Component: React.ComponentType<P>): React.ComponentClass<P> {  
  class ReactAIWrappedComponent extends React.Component<P> {
    private idleTimer?: IdleTimer;
    private wrappedElement: Node | undefined;
    private componentName = Component.displayName || Component.prototype.constructor.name;
    private engagementTimeSeconds: number = 0;

    constructor(props: P) {
      super(props);
    }

    public componentWillUnmount() {
      if (!this.idleTimer) {
        throw new Error("reactAIWithTracking:unMount: IdleTimer isn't initialized.");
      }

      const metricData: IMetricTelemetry = {
        average: this.engagementTimeSeconds,
        name: "React Component Engaged Time (seconds)",
        sampleCount: 1
      };

      const additionalProperties: { [key: string]: any } = { "Component Name": this.componentName };

      if (!ReactAI.RootInstance) {
        throw new Error("reactAIWithTracking:unMount: ReactAI isn't initialized yet.");
      }

      if (ReactAI.IsDebugMode) {
        console.log("reactAIWithTracking:unMount: tracking engagement time metric: ", metricData, additionalProperties);
      }

      ReactAI.RootInstance.trackMetric(metricData, additionalProperties);
    }

    public render() {
      return (
        <div ref={c => (this.wrappedElement = c as Node)}>
          <IdleTimer
            ref={(ref: IdleTimer) => {
              this.idleTimer = ref;
            }}
            element={this.wrappedElement}
            onActive={this.onActive}
            onIdle={this.onIdle}
            onAction={this.onAction}
            timeout={1000 * 60 * 15}
          />
          <Component {...this.props}  />
        </div>
      );
    }

    private onAction = (e: Event) => {
      this.engagementTimeSeconds = this.idleTimer ? this.idleTimer.getElapsedTime() / 1000 : 0;
      if (ReactAI.IsDebugMode) {
        console.log("reactAIWithTracking:onAction: user is interacting with component.", "Time to idle: ", this.idleTimer ? this.idleTimer.getRemainingTime() : undefined);
      }
    };

    private onActive = (e: Event) => {
      this.engagementTimeSeconds = this.idleTimer ? this.idleTimer.getElapsedTime() / 1000 : 0;
      if (ReactAI.IsDebugMode) {
        console.log("reactAIWithTracking:onActive: user is interacting with component.", "Time to idle: ", this.idleTimer ? this.idleTimer.getRemainingTime() : undefined);        
      }
    };

    private onIdle = (e: Event) => {
      if (ReactAI.IsDebugMode) {
        console.log("reactAIWithTracking:onIdle: user is idle on component.", "Last active time: ", this.idleTimer ? this.idleTimer.getLastActiveTime() : undefined);
      }
    };
  }

  return ReactAIWrappedComponent;
}

export default reactAIWithTracking;
