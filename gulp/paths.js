const path = require('path');
const projectDir = path.resolve(__dirname, '../');

module.exports = {
  output: `${projectDir}/build`,
  outputStyles: `${projectDir}/public/stylesheets`,
  outputJS: `${projectDir}/public/javascripts`,
  sourceStyles: `${projectDir}/gallery/stylesheets`,
  sassLib: `${projectDir}/sass`,
  sourceJS: `${projectDir}/gallery/javascripts`,
  libJS: `${projectDir}/javascripts`,
  webpackConfig: `${projectDir}/webpack.config.js`,
  node_modules: `${projectDir}/node_modules`
};
