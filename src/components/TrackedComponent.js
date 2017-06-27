'use strict';

import React, {Component} from 'react';
import {AppInsights} from "applicationinsights-js"
import away from 'away';

export class TrackedComponent extends Component {
  constructor() {
    super();
    this.displayName = "TrackedComponent";
  }

  render() {
    return false;
  }

  componentWillMount(){
    this.componentWillMountTimestamp = Date.now();
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
     if(!this.componentWillMountTimestamp){
       throw "ComponentWillMountTimestamp was not initialized. Check if super.componentWillMount() was called"
     }
     AppInsights.trackMetric(
        "React Component Engaged Time (seconds)", 
        (Date.now() - this.componentWillMountTimestamp - (this.idleTimeInMs?this.idleTimeInMs:0))/1000,
        1,
        null,
        null,
        {'Component Name' : this.constructor.displayName});
     
  }
}