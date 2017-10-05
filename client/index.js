import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import * as Bundles from './routes/Bundles';
import routes from './routes/routes';

const webpackChunks = window.__WEBPACK_CHUNKS__ || [];

const renderApp = async () => {
  await Promise.all(webpackChunks.map((chunk) => Bundles[chunk].loadComponent()));
  ReactDOM.render(<BrowserRouter>{renderRoutes(routes)}</BrowserRouter>, document.getElementById('root'));
};

renderApp();
