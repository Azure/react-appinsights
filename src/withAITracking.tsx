// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { IMetricTelemetry } from "@microsoft/applicationinsights-web";
import * as React from "react";
import { reactAI } from "./ReactAI";

/**
 * Higher-order component function to hook Application Insights tracking 
 * in a React component's lifecycle.
 * 
 * @param Component the component to be instrumented with Application Insights tracking
 * @param componentName (optional) component name
 */
export default function withAITracking<P>(Component: React.ComponentType<P>, componentName?: string): React.ComponentClass<P> {

  if (componentName === undefined || componentName === null || typeof componentName !== 'string') {
    componentName = Component.prototype.constructor.name;
  }

  return class extends React.Component<P> {
    private mountTimestamp: number = 0;
    private firstActiveTimestamp: number = 0;
    private idleStartTimestamp: number = 0;
    private lastActiveTimestamp: number = 0;
    private totalIdleTime: number = 0;
    private idleCount: number = 0;
    private idleTimeout: number = 5000;
    private intervalId?: NodeJS.Timeout;

    public componentDidMount() {
      this.mountTimestamp = Date.now();
      this.firstActiveTimestamp = 0;
      this.totalIdleTime = 0;
      this.lastActiveTimestamp = 0;
      this.idleStartTimestamp = 0;
      this.idleCount = 0;

      this.intervalId = setInterval(() => {
        if (this.lastActiveTimestamp > 0 && this.idleStartTimestamp === 0 && Date.now() - this.lastActiveTimestamp >= this.idleTimeout) {
          this.idleStartTimestamp = Date.now();
          this.idleCount++;
          this.debugLog("componentDidMount", "Starting idle time.");
        }
      }, 100);
    }

    public componentWillUnmount() {
      if (this.mountTimestamp === 0) {
        throw new Error("withAITracking:componentWillUnmount: mountTimestamp isn't initialized.");
      }

      if (!reactAI.appInsights) {
        throw new Error("withAITracking:componentWillUnmount: ReactAI isn't initialized.");
      }

      if (this.intervalId) {
        clearInterval(this.intervalId);
      }

      if (this.firstActiveTimestamp === 0) {
        this.debugLog("componentWillUnmount", "Nothing to track.");
        return;
      }

      const engagementTime = this.getEngagementTimeSeconds();
      const metricData: IMetricTelemetry = {
        average: engagementTime,
        name: "React Component Engaged Time (seconds)",
        sampleCount: 1
      };

      const additionalProperties: { [key: string]: any } = { "Component Name": componentName };
      this.debugLog(
        "componentWillUnmount",
        `Tracking ${engagementTime} seconds of engagement time for ${componentName}.`
      );
      reactAI.appInsights.trackMetric(metricData, additionalProperties);
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

    private trackActivity = (e: React.SyntheticEvent): void => {
      if (this.firstActiveTimestamp === 0) {
        this.firstActiveTimestamp = Date.now();
        this.lastActiveTimestamp = this.firstActiveTimestamp;
      } else {
        this.lastActiveTimestamp = Date.now();
      }

      if (this.idleStartTimestamp > 0) {
        const lastIdleTime = this.lastActiveTimestamp - this.idleStartTimestamp;
        this.totalIdleTime += lastIdleTime;
        this.debugLog("trackActivity", `Idle to active added ${lastIdleTime / 1000} seconds of idle time.`);
        this.idleStartTimestamp = 0;
      }
    }

    private debugLog(from: string, message: string): void {
      if (reactAI.isDebugMode) {
        console.log(`withAITracking:${componentName}:${from}: ${message}`, {
          engagementTime: this.getEngagementTimeSeconds(),
          firstActiveTime: this.firstActiveTimestamp,
          idleStartTime: this.idleStartTimestamp,
          idleTimeMs: this.totalIdleTime,
          lastActiveTime: this.lastActiveTimestamp,
          mountTimestamp: this.mountTimestamp
        });
      }
    }

    private getEngagementTimeSeconds(): number {
      return (Date.now() - this.firstActiveTimestamp - this.totalIdleTime - this.idleCount * this.idleTimeout) / 1000;
    }
  }
}
