import {AppInsights} from "applicationinsights-js"


var ReactAI = {
    init: function(appInsightsOptions, history){
        AppInsights.downloadAndSetup(appInsightsOptions);
        
        var self = this;
        history.listen(location => {
            self.trackPageView();
        })

    },

    trackPageView(){
        AppInsights.trackPageView();
    },

    ai(){
        return AppInsights;
    }


}

module.exports = ReactAI;