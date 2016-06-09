const path = require('path');
const projectDir = path.resolve(__dirname, '../');

module.exports = {
  output: `${projectDir}/build`,
  outputStyles: `${projectDir}/build/stylesheets`,
  outputJS: `${projectDir}/build/javascripts`,
  sourceStyles: `${projectDir}/gallery/stylesheets`,
  sassLib: `${projectDir}/stylesheets`,
  sourceJS: `${projectDir}/gallery/javascripts`,
  libJS: `${projectDir}/javascripts`,
  webpackConfig: `${projectDir}/webpack.config.js`,
  node_modules: `${projectDir}/node_modules`
};
