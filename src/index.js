import React from 'react';
import {AppInsights} from "applicationinsights-js"

class ReactAI extends React.Component {
    
    initialize (options) {
        AppInsights.downloadAndSetup(options);
        AppInsights.trackPageView();
    }
    
    trackPageChange(){
        appInsights.trackPageView(null, null, {'Full Page Url': window.location.pathname});
    }
}
export default ReactAI;