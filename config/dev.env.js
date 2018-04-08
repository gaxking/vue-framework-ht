'use strict'
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

var HT_ENV = '"' + process.env.HT_ENV + '"';

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  HT_ENV: HT_ENV
});
