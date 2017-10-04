import 'babel-polyfill';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import slashes from 'connect-slashes';
import renderMiddleware from './middlewares/renderMiddleware';

const app = express();

const webpack = require('webpack');
const webpackConfig = require('../webpack.client.js');
const webpackAssets = require('express-webpack-assets');
const webpackDevMid = require('webpack-dev-middleware');
const webpackHotMid = require('webpack-hot-middleware');

if (process.env.PWA_ENV === 'local') {
  const compiler = webpack(webpackConfig);   // config is required above
  app.use(webpackDevMid(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,    // "/static/"
  }));
  app.use(webpackHotMid(compiler));
}

app.use(webpackAssets('./build/client/assetsManifest.json', {
  devMode: process.env.PWA_ENV === 'local',
}));

app.set('trust proxy', true);
app.use(helmet({ dnsPrefetchControl: false }));
app.use(compression());
app.use(morgan(__LOCAL__ ? 'dev' : 'combined'));
app.use('/build/client', express.static('build/client'));
app.use('/serviceWorker.js', express.static('build/client/serviceWorker.js'));
app.use('/manifest.json', express.static('build/client/manifest.json'));
app.use(slashes(true));
app.use(renderMiddleware);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  // eslint-disable-next-line
  console.info(`pwa is running as ${__PWA_ENV__} on port ${PORT}`);
});
