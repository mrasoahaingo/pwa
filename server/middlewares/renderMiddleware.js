import React from 'react';
import jsonfile from 'jsonfile';
import Helmet from 'react-helmet';
import { renderToString } from 'react-dom/server';
import StaticRouter from 'react-router-dom/StaticRouter';
import { matchPath } from 'react-router';
import routes from '../../client/routes/routes';
import App from '../../client/App';
import html from '../render/html';

const PWA_SSR = process.env.PWA_SSR === 'true';
let assetsData = false;
const readAssets = () => new Promise(resolve => {
  if (assetsData) {
    resolve(assetsData);
  } else {
    jsonfile.readFile('./build/client/assetsManifest.json', (err, obj) => {
      resolve(obj);
    });
  }
});

export default async (req, res) => {
  const matches = routes.map((route) => {
    const match = matchPath(req.url, route.path, route);
    // We then look for static getInitialData function on each top level component
    if (match) {
      const obj = {
        route,
        match,
        promise: route.component.getInitialData
          ? route.component.getInitialData({ match, req, res })
          : Promise.resolve(null),
      };
      return obj;
    }
    return null;
  });

  if (matches.length === 0) {
    res.status(404).send('Not Found');
  }

  // Now we pull out all the promises we found into an array.
  const promises = matches.map(match => (match ? match.promise : null));

    // We block rendering until all promises have resolved
  const initialState = await Promise.all(promises);

  assetsData = await readAssets();
  const context = {
    splitPoints: [],
  };
  const { webpack_asset } = res.locals;
  const app = PWA_SSR
    ? renderToString(
        <StaticRouter location={req.url} context={context}>
          <App routes={routes} initialData={initialState} />
        </StaticRouter>,
      )
    : '';
  res.set('Content-Type', 'text/html');
  const earlyChunk = html.earlyChunk(context, { getAsset: webpack_asset });
  res.write(earlyChunk);
  res.flush();
  const lateChunk = html.lateChunk(app, Helmet.renderStatic(), initialState, context, {
    getAsset: webpack_asset,
    assetsData,
  });
  res.end(lateChunk);
};
