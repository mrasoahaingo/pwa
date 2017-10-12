import React from 'react';
import jsonfile from 'jsonfile';
import Helmet from 'react-helmet';
import { renderToString } from 'react-dom/server';
import StaticRouter from 'react-router-dom/StaticRouter';
import { renderRoutes } from 'react-router-config';
import routes from '../../client/routes/routes';
import html from '../render/html';

const PWA_SSR = process.env.PWA_SSR === 'true';
let assetsData = false;
const readAssets = () => new Promise(resolve => {
  if (assetsData) {
    resolve(assetsData);
  } else {
    jsonfile.readFile('./build/client/assetsManifest.json', (err, obj) => {
      console.log('qsd', err, obj);
      resolve(obj);
    });
  }
});

export default async (req, res) => {
  assetsData = await readAssets();
  const context = {
    splitPoints: [],
  };
  const { webpack_asset } = res.locals;
  const app = PWA_SSR
    ? renderToString(
        <StaticRouter location={req.url} context={context}>
          {renderRoutes(routes)}
        </StaticRouter>,
      )
    : '';
  res.set('Content-Type', 'text/html');
  const earlyChunk = html.earlyChunk(context, { getAsset: webpack_asset });
  res.write(earlyChunk);
  res.flush();
  const lateChunk = html.lateChunk(app, Helmet.renderStatic(), {}, context, {
    getAsset: webpack_asset,
    assetsData,
  });
  res.end(lateChunk);
};
