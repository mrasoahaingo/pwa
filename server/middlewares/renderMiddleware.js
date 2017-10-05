import React from 'react';
import Helmet from 'react-helmet';
import { renderToString } from 'react-dom/server';
import StaticRouter from 'react-router-dom/StaticRouter';
import { matchRoutes, renderRoutes } from 'react-router-config';
import routes from '../../client/routes';
import html from '../render/html';

// const PWA_SSR = process.env.PWA_SSR === 'true';

const serverRenderedChunks = async (req, res, renderProps) => {
  const route = renderProps.routes[renderProps.routes.length - 1];
  const { webpack_asset } = res.locals;

  res.set('Content-Type', 'text/html');

  const earlyChunk = html.earlyChunk(route, { getAsset: webpack_asset });
  res.write(earlyChunk);
  res.flush();

  const lateChunk = html.lateChunk(
    renderToString(
      <StaticRouter location={req.url} context={{}}>
        {renderRoutes(routes)}
      </StaticRouter>,
    ),
    Helmet.renderStatic(),
    {},
    route,
    { getAsset: webpack_asset },
  );

  res.end(lateChunk);
};

export default (req, res) => {
  const branch = matchRoutes(routes, req.originalUrl);
  const promises = branch.map(({ route }) => {
    const fetchData = route.component.fetchData;
    return fetchData instanceof Function ? fetchData() : Promise.resolve(null);
  });

  return Promise.all(promises).then(() => {
    console.log(branch);
    res.end();
  });
  /*
  , (error, redirectLocation, renderProps) => {
    if (error) {
      return res.status(500).send(error.message);
    } else if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      return serverRenderedChunks(req, res, renderProps);
    }
    return res.status(404).send('404: Not Found');
  }); */
};
