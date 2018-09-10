"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ReactAI = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _applicationinsightsJs = require("applicationinsights-js");

var _appinsightsUsage = require("appinsights-usage");

var _appinsightsUsage2 = _interopRequireDefault(_appinsightsUsage);

var _away = require("away");

var _away2 = _interopRequireDefault(_away);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactAI = exports.ReactAI = {
    init: function init(appInsightsOptions, history) {
        _applicationinsightsJs.AppInsights.downloadAndSetup(appInsightsOptions);
        _appinsightsUsage2.default.init(appInsightsOptions);

        if (history) {
            history.listen(function (location) {
                _applicationinsightsJs.AppInsights.trackPageView();
            });
        }

        this.setAppContext({ urlReferrer: document.referrer });
    },

    ai: function ai() {
        return _applicationinsightsJs.AppInsights;
    },
    trackRouterChange: function trackRouterChange() {
        _applicationinsightsJs.AppInsights.trackPageView();
    },


    setAppContext: function setAppContext(properties) {
        appInsights.queue.push(function () {
            appInsights.context.addTelemetryInitializer(function (envelope) {
                var telemetryItem = envelope.data.baseData;

                // To set custom properties:
                telemetryItem.properties = telemetryItem.properties || {};
                for (var key in properties) {
                    telemetryItem.properties[key] = properties[key];
                }
            });
        });
    },

    withTracking: function withTracking(WrappedComponent, componentName) {
        // Note: This check can be better if Lodash is added as a dependency.
        if (componentName === undefined || componentName === null || typeof componentName !== 'string') {
            throw "Component name is not defined or is not a string";
        }

        return function (_React$Component) {
            _inherits(_class, _React$Component);

            function _class() {
                _classCallCheck(this, _class);

                return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
            }

            _createClass(_class, [{
                key: "componentWillMount",
                value: function componentWillMount() {
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
                }
            }, {
                key: "componentWillUnmount",
                value: function componentWillUnmount() {
                    if (!this.componentWillMountTimestamp) {
                        throw "ComponentWillMountTimestamp was not initialized. Check if super.componentWillMount() was called";
                    }
                    _applicationinsightsJs.AppInsights.trackMetric("React Component Engaged Time (seconds)", (Date.now() - this.componentWillMountTimestamp - (this.idleTimeInMs ? this.idleTimeInMs : 0)) / 1000, 1, null, null, {
                        'Component Name': componentName
                    });
                }
            }, {
                key: "render",
                value: function render() {
                    return _react2.default.createElement(WrappedComponent, this.props);
                }
            }]);

            return _class;
        }(_react2.default.Component);
    }
};