import {AppInsights} from "applicationinsights-js"


var ReactAI = {
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
    }
   
}

module.exports = ReactAI;