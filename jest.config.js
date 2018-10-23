'use strict';

const webpackConfig = require('./webpack.config');

module.exports = {
    moduleNameMapper: webpackConfig.resolve.alias,
    transformIgnorePatterns: [
        "<rootDir>/node_modules/(?!(applicationinsights-js)/)"
      ],
    setupTestFrameworkScriptFile:  "<rootDir>/test/setupTests.js"
};