"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var applicationinsights_web_1 = require("@microsoft/applicationinsights-web");
var ReactAI = /** @class */ (function () {
    function ReactAI() {
        if (ReactAI.instance) {
            throw new Error('ReactAI: use ReactAI.Instance() instead.');
        }
        ReactAI.instance = this;
    }
    ReactAI.initialize = function (settings) {
        this.debug = settings.debug;
        if (!this.ai) {
            this.ai = new applicationinsights_web_1.ApplicationInsights({ config: { instrumentationKey: settings.instrumentationKey }, queue: [] });
            this.ai.loadAppInsights();
            if (this.debug) {
                console.log('ReactAI: Application Insights initialized with:', settings);
            }
        }
        this.setContext(settings.initialContext || {}, true);
        this.ai.addTelemetryInitializer(this.customDimensionsInitializer());
        if (settings.history) {
            this.addHistoryListener(settings.history);
        }
    };
    Object.defineProperty(ReactAI, "Instance", {
        get: function () {
            return this.instance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReactAI, "RootInstance", {
        get: function () {
            return this.ai;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReactAI, "Context", {
        get: function () {
            return this.contextProps || {};
        },
        enumerable: true,
        configurable: true
    });
    ReactAI.setContext = function (properties, clearPrevious) {
        if (clearPrevious === void 0) { clearPrevious = false; }
        if (clearPrevious) {
            this.contextProps = {};
            if (this.debug) {
                console.log('Context reset.');
            }
        }
        properties = properties || {};
        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                this.contextProps[key] = properties[key];
            }
        }
        if (this.debug) {
            console.log('Context set to:', this.contextProps);
        }
    };
    ReactAI.customDimensionsInitializer = function () {
        var _this = this;
        return function (envelope) {
            envelope.data = envelope.data || {};
            var props = _this.Context;
            for (var key in props) {
                if (props.hasOwnProperty(key)) {
                    envelope.data[key] = props[key];
                }
            }
        };
    };
    ReactAI.addHistoryListener = function (history) {
        var _this = this;
        history.listen(function (location, action) {
            _this.ai.trackPageView({});
            if (_this.debug) {
                console.log('ReactAI: Recording page view', location, action);
            }
        });
    };
    ReactAI.instance = new ReactAI();
    ReactAI.contextProps = {};
    return ReactAI;
}());
exports.default = ReactAI;
