'use strict';

const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'react-appinsights.bundle.js'
      },
    module: {
        rules: [
          {
            test: /.js$/,
            loader: 'babel-loader'
          }
        ]
    },
    resolve: {
      alias: {
        'applicationinsights-js': path.resolve(process.cwd(), './node_modules/applicationinsights-js/bundle/ai.module.js'),
      }
    }
};