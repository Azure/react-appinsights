import {AppInsights} from "applicationinsights-js"


export const ReactAI = {
    init: function(appInsightsOptions, history){
        AppInsights.downloadAndSetup(appInsightsOptions);
        
        history.listen(location => {
            AppInsights.trackPageView();
        });

        this.setAppContext({urlReferrer:document.referrer});
    },

    ai(){
        return AppInsights
    },

    setAppContext: function(properties){
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
    }
   
}

;