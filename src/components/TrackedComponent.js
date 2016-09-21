'use strict';

import React from 'react';
import {AppInsights} from "applicationinsights-js"
import away from 'away';

export const TrackedComponent = React.createClass({
  displayName: "TrackedComponent",
  render: function render() {
    return false;
  },

  componentWillMount:function (){
    this.componentWillMountTime = Date.now();
    var timer = away(30000);
    var self=this;
    timer.on('idle', function() {
        self.startIdleTimer = Date.now();
    });
    timer.on('active', function() {
        self.idleTimeInMs = self.idleTimeInMs?self.idleTimeInMs:0+(Date.now()-self.startIdleTimer);
    });
  },

  componentDidMount:function (){
    if(this.componentWillMountTime){
      AppInsights.trackMetric(
        "React Component load time", 
        Date.now() - this.componentWillMountTime,
        1,
        null,
        null,
        {'Component Name':this.constructor.displayName});
    }
  },

  componentWillUnmount: function(){
     if(this.componentWillMountTime){
        AppInsights.trackMetric(
          "React Component Engaged Time", 
          Date.now() - this.componentWillMountTime - (this.idleTimeInMs?this.idleTimeInMs:0),
          1,
          null,
          null,
          {'Component Name' : this.constructor.displayName});
     }
  }
});