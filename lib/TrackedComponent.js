'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TrackedComponent = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TrackedComponent = exports.TrackedComponent = _react2.default.createClass({
  displayName: "TrackedComponent",
  render: function render() {
    return false;
  },
  componentWillMount: function componentWillMount() {
    console.log('componentWillMount', Date.now());
  },
  componentWillUnmount: function componentWillUnmount() {
    console.log('componentWillUnmount', Date.now());
  }
});