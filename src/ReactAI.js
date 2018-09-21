import React from 'react';
import {AppInsights} from "applicationinsights-js"
import AppInsightsUsage from "appinsights-usage"
import away from 'away';


export const ReactAI = {
    init(appInsightsOptions, history){
        AppInsights.downloadAndSetup(appInsightsOptions);
        AppInsightsUsage.init(appInsightsOptions);
        
        if(history){
            history.listen(location => {
                AppInsights.trackPageView();
            });
        }

        this.setAppContext({urlReferrer:document.referrer});
    },

    ai(){
        return AppInsights;
    },

    setAppContext(properties){
        appInsights.queue.push(function () {
            appInsights.context.addTelemetryInitializer(function (envelope) {
                var telemetryItem = envelope.data.baseData;

                // To set custom properties:
                telemetryItem.properties = telemetryItem.properties || {};
                for (var key in properties) {
                    telemetryItem.properties[key] = properties[key];
                }
                
            })
        });
    },

    withTracking(WrappedComponent, componentName) {
        // Note: This check can be better if Lodash is added as a dependency.
        if(componentName === undefined || componentName === null || typeof componentName !== 'string'){
            componentName = WrappedComponent.prototype.constructor.name;
        }

        return class extends React.Component {
            componentDidMount(){
                this.componentDidMountTimestamp = Date.now();
                this.idleTimeInMs = 0;
                var timer = away(30000);
                var self=this;
                timer.on('idle', function() {
                    self.startIdleTimer = Date.now();
                });
                timer.on('active', function() {
                    self.idleTimeInMs += Date.now()-self.startIdleTimer;
                });
            }
            componentWillUnmount(){
                if(!this.componentDidMountTimestamp){
                    throw "ComponentDidMountTimestamp was not initialized.";
                }
                AppInsights.trackMetric(
                    "React Component Engaged Time (seconds)",
                    (Date.now() - this.componentDidMountTimestamp - (this.idleTimeInMs ? this.idleTimeInMs : 0)) / 1000,
                    1,
                    null,
                    null, {
                        'Component Name': componentName
                    });
            }
            render() {
                return <WrappedComponent {...this.props} />;
            }
        };
    }
}