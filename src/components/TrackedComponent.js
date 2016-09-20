'use strict';

import React from 'react';
import {AppInsights} from "applicationinsights-js"
var away = require('away');

export const TrackedComponent = React.createClass({
  displayName: "TrackedComponent",
  render: function render() {
    return false;
  },

  componentWillMount:function (){
    this.componentWillMountTime = Date.now();
    this.idleTimeInMs = 0;
  },

  componentDidMount:function (){
    if(this.componentWillMountTime){
      AppInsights.trackMetric(
        "React Component load time", 
        Date.now() - this.componentWillMountTime,
        1,
        null,
        null,
        {Component:this.constructor.displayName});
    }

    var timer = away(20000);
    var self=this;
    timer.on('idle', function() {
        self.startIdleTimer = Date.now();
    });
    timer.on('active', function() {
        self.idleTimeInMs = self.idleTimeInMs+(Date.now()-self.startIdleTimer);
    });


  },

  componentWillUnmount: function(){
     if(this.componentWillMountTime){
        AppInsights.trackMetric(
          "React Component life duration", 
          Date.now() - this.componentWillMountTime - this.idleTimeInMs,
          1,
          null,
          null,
          {Component:this.constructor.displayName});
     }
  }
});