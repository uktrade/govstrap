const path = require('path');
const projectDir = path.resolve(__dirname, '../');

module.exports = {
  output: `${projectDir}/public`,
  outputLib: `${projectDir}/dist`,
  outputStyles: `${projectDir}/public/stylesheets`,
  outputJS: `${projectDir}/public/javascripts`,
  sourceStyles: `${projectDir}/sass`,
  sourceJS: `${projectDir}/javascripts`,
  testJS: `${projectDir}/test`,
  webpackConfig: `${projectDir}/webpack.config.js`,
  node_modules: `${projectDir}/node_modules`
};
