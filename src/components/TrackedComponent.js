'use strict';

import React from 'react';

export const TrackedComponent = React.createClass({
  displayName: "TrackedComponent",
  render: function render() {
    return false;
  },
  componentWillMount:function (){
    console.log('componentWillMount', Date.now())

  },
  componentWillUnmount: function(){
    console.log('componentWillUnmount', Date.now());

  }
});