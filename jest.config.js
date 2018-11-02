'use strict';

const path = require('path');

module.exports = {
    moduleNameMapper: {
        'applicationinsights-js': 
            path.resolve(process.cwd(), './node_modules/applicationinsights-js/bundle/ai.module.js'),
    },
    transformIgnorePatterns: [
        "<rootDir>/node_modules/(?!(applicationinsights-js)/)"
      ],
    setupTestFrameworkScriptFile:  "<rootDir>/test/setupTests.js",
};