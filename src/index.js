import {AppInsights} from "applicationinsights-js"


var ReactAI = {
    initialize: function(appInsightsOptions, history){
        AppInsights.downloadAndSetup(options);
        AppInsights.trackPageView();
        appInsights.trackPageView(null, null, {urlReferrer: document.referrer});


        history.listen(location => {
            console.log("listen: " + location.pathname)
        })

        history.listenBefore(location => {
            console.log("listenBefore: " + location.pathname);
            AppInsights.trackPageView();
        })
    },
}

module.exports = ReactAI;