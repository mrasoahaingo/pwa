import React from 'react';
import Helmet from 'react-helmet';
import { renderToString } from 'react-dom/server';
import StaticRouter from 'react-router-dom/StaticRouter';
import { renderRoutes } from 'react-router-config';
import routes from '../../client/routes/routes';
import html from '../render/html';

// const PWA_SSR = process.env.PWA_SSR === 'true';

const serverRenderedChunks = async (req, res) => {
  const route = 'landing';
  const context = {
    splitPoints: [],
  };
  const { webpack_asset } = res.locals;

  res.set('Content-Type', 'text/html');
  const app = renderToString(
    <StaticRouter location={req.url} context={context}>
      {renderRoutes(routes)}
    </StaticRouter>,
  );
  const earlyChunk = html.earlyChunk(context, { getAsset: webpack_asset });
  res.write(earlyChunk);
  res.flush();

  const lateChunk = html.lateChunk(
    app,
    Helmet.renderStatic(),
    {},
    context,
    { getAsset: webpack_asset },
  );

  console.log(context);

  res.end(lateChunk);
};

export default (req, res) => {
  const renderProps = {};
  return serverRenderedChunks(req, res, renderProps);
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
