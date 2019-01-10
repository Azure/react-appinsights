// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { IMetricTelemetry } from "@microsoft/applicationinsights-web";
import * as React from "react";
import { ReactAI } from ".";

export default function withAITracking<P>(Component: React.ComponentType<P>): React.ComponentClass<P> {

  return class extends React.Component<P> {
    private componentName: string = Component.prototype.constructor.name;
    private mountTimestamp: number = 0;
    private firstActiveTime: number = 0;
    private idleStartTime: number = 0;
    private lastActiveTime: number = 0;
    private idleTimeMs: number = 0;
    private idleCount: number = 0;
    private timeoutMs: number = 5000;
    private intervalId?: NodeJS.Timeout;

    public componentDidMount() {
      this.mountTimestamp = Date.now();
      this.firstActiveTime = 0;
      this.idleTimeMs = 0;
      this.lastActiveTime = 0;
      this.idleStartTime = 0;
      this.idleCount = 0;

      this.intervalId = setInterval(() => {
        if (this.lastActiveTime > 0 && this.idleStartTime === 0 && Date.now() - this.lastActiveTime >= this.timeoutMs) {
          this.idleStartTime = Date.now();
          this.idleCount++;
          this.logIfEnabled("componentDidMount", "Starting idle time.");
        }
      }, 100);
    }

    public componentWillUnmount() {
      if (this.mountTimestamp === 0) {
        throw new Error("withAITracking:componentWillUnmount: mountTimestamp isn't initialized.");
      }

      if (!ReactAI.rootInstance) {
        throw new Error("withAITracking:componentWillUnmount: ReactAI isn't initialized yet.");
      }

      if (this.intervalId) {
        clearInterval(this.intervalId);
      }

      if (this.firstActiveTime === 0) {
        this.logIfEnabled("componentWillUnmount", "Nothing to track.");
        return;
      }

      const engagementTime = this.getEngagementTimeSeconds();
      const metricData: IMetricTelemetry = {
        average: engagementTime,
        name: "React Component Engaged Time (seconds)",
        sampleCount: 1
      };

      const additionalProperties: { [key: string]: any } = { "Component Name": this.componentName };
      this.logIfEnabled(
        "componentWillUnmount",
        `Tracking ${engagementTime} seconds of engagement time for ${this.componentName}.`
      );
      ReactAI.rootInstance.trackMetric(metricData, additionalProperties);
    }

    public render() {
      return (
        <div
          onKeyDown={this.trackActivity}
          onMouseMove={this.trackActivity}
          onScroll={this.trackActivity}
          onMouseDown={this.trackActivity}
          onTouchStart={this.trackActivity}
          onTouchMove={this.trackActivity}
        >
          <Component {...this.props} />
        </div>
      );
    }

    private trackActivity = (e: React.SyntheticEvent) => {
      if (this.firstActiveTime === 0) {
        this.firstActiveTime = Date.now();
      }
      this.lastActiveTime = Date.now();
      if (this.idleStartTime > 0) {
        const lastIdleTimeMs = Date.now() - this.idleStartTime;
        this.idleTimeMs += lastIdleTimeMs;
        this.logIfEnabled("trackActivity", `Idle to active added ${lastIdleTimeMs / 1000} seconds of idle time.`);
        this.idleStartTime = 0;
      }
    };

    private logIfEnabled = (from: string, message: string) => {
      if (ReactAI.isDebugMode) {
        console.log(`withAITracking:${this.componentName}:${from}: ${message}`, {
          engagementTime: this.getEngagementTimeSeconds(),
          firstActiveTime: this.firstActiveTime,
          idleStartTime: this.idleStartTime,
          idleTimeMs: this.idleTimeMs,
          lastActiveTime: this.lastActiveTime,
          mountTimestamp: this.mountTimestamp
        });
      }
    };

    private getEngagementTimeSeconds = () => {
      return (Date.now() - this.firstActiveTime - this.idleTimeMs - this.idleCount * this.timeoutMs) / 1000;
    };
  }
}
