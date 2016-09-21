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
    this.componentWillMountTime = Date.now();
    var timer = (0, _away2.default)(30000);
    var self = this;
    timer.on('idle', function () {
      console.log('idle');
      self.startIdleTimer = Date.now();
    });
    timer.on('active', function () {
      console.log('active');
      self.idleTimeInMs = self.idleTimeInMs ? self.idleTimeInMs : 0 + (Date.now() - self.startIdleTimer);
    });
  },

  componentDidMount: function componentDidMount() {
    if (this.componentWillMountTime) {
      _applicationinsightsJs.AppInsights.trackMetric("React Component load time", Date.now() - this.componentWillMountTime, 1, null, null, { 'Component Name': this.constructor.displayName });
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    if (this.componentWillMountTime) {
      _applicationinsightsJs.AppInsights.trackMetric("React Component Engaged Time", Date.now() - this.componentWillMountTime - (this.idleTimeInMs ? this.idleTimeInMs : 0), 1, null, null, { 'Component Name': this.constructor.displayName });
    }
  }
});