import 'babel-polyfill';
import 'isomorphic-fetch';
import express from 'express';
import helmet from 'helmet';
import csp from 'express-csp-header';
import compression from 'compression';
import morgan from 'morgan';
import slashes from 'connect-slashes';
import renderMiddleware from './middlewares/renderMiddleware';
import { getFormattedBlocs, getFormattedArticle } from '../client/utils/formatData';

const app = express();

const webpack = require('webpack');
const webpackConfig = require('../webpack.client.js');
const webpackAssets = require('express-webpack-assets');
const webpackDevMid = require('webpack-dev-middleware');
const webpackHotMid = require('webpack-hot-middleware');

if (process.env.PWA_ENV === 'local') {
  const compiler = webpack(webpackConfig); // config is required above
  app.use(
    webpackDevMid(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath, // "/static/"
    }),
  );
  app.use(webpackHotMid(compiler));
}

app.use(
  webpackAssets('./build/client/assetsManifest.json', {
    devMode: process.env.PWA_ENV === 'local',
  }),
);
app.set('trust proxy', true);
app.use(helmet({ dnsPrefetchControl: false }));
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
app.use(csp({
  policies: {
    'default-src': [csp.SELF],
    'child-src': [csp.SELF],
    'connect-src': [csp.SELF, 'api.fidji.lefigaro.fr'],
    'script-src': [csp.SELF, csp.INLINE, csp.EVAL, 'blob:'],
    'style-src': [csp.SELF, csp.INLINE, 'fonts.googleapis.com'],
    'font-src': [csp.SELF, csp.INLINE, 'fonts.googleapis.com', 'fonts.gstatic.com'],
    'img-src': [csp.SELF, 'data:', 'raw.githubusercontent.com'],
    'block-all-mixed-content': true,
  },
}));
app.use(compression());
app.use(morgan(__LOCAL__ ? 'dev' : 'combined'));
app.use('/api/page', async (req, res) => {
  console.log('--------------', req.headers.referer);
  const { pageId } = req.query;
  const data = await fetch(`https://api.fidji.lefigaro.fr/export/page/?euid=${pageId}&source=lefigaro.fr&type_ranking%5B0%5D=News&oneprofile=1`);
  const result = await data.json();
  res.json({ blocs: getFormattedBlocs(result) });
});
app.use('/api/article', async (req, res) => {
  const { articleId } = req.query;
  const data = await fetch(`https://api.fidji.lefigaro.fr/export/articles/?source=lefigaro.fr&euid=${articleId}&limit=1&full=1&oneprofile=1&mediaref=1`);
  const result = await data.json();
  res.json(getFormattedArticle(result));
});
app.use('/api/comments', async (req, res) => {
  const { articleId } = req.query;
  const data = await fetch(`http://plus.lefigaro.fr/fpservice/commentaires/sdv/${articleId}/json?page=0&parents_limit=20`);
  const result = await data.json();
  res.json(result);
});
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
