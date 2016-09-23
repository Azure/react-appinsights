"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ReactAI = undefined;

var _applicationinsightsJs = require("applicationinsights-js");

var _appinsightsUsage = require("appinsights-usage");

var _appinsightsUsage2 = _interopRequireDefault(_appinsightsUsage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    }

};