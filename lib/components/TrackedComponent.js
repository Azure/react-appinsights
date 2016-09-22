'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TrackedComponent = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _applicationinsightsJs = require('applicationinsights-js');

var _away = require('away');

var _away2 = _interopRequireDefault(_away);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TrackedComponent = exports.TrackedComponent = _react2.default.createClass({
  displayName: "TrackedComponent",
  render: function render() {
    return false;
  },

  componentWillMount: function componentWillMount() {
    this.componentWillMountTimestamp = Date.now();
    this.idleTimeInMs = 0;
    var timer = (0, _away2.default)(30000);
    var self = this;
    timer.on('idle', function () {
      self.startIdleTimer = Date.now();
    });
    timer.on('active', function () {
      self.idleTimeInMs += Date.now() - self.startIdleTimer;
    });
  },

  componentWillUnmount: function componentWillUnmount() {
    if (!this.componentWillMountTimestamp) {
      throw "ComponentWillMountTimestamp was not initialized. Check if super.componentWillMount() was called";
    }
    _applicationinsightsJs.AppInsights.trackMetric("React Component Engaged Time (seconds)", (Date.now() - this.componentWillMountTimestamp - (this.idleTimeInMs ? this.idleTimeInMs : 0)) / 1000, 1, null, null, { 'Component Name': this.constructor.displayName });
  }
});