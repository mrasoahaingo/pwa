import React from 'react';
import { Route } from 'react-router';
import Wrapper from './views/Wrapper/Wrapper';
import NotFound from './views/NotFound/NotFound';

export default (
  <Route path="/" component={Wrapper}>
    <Route
      name="landing"
      getComponent={async (_, cb) => {
        const module = await import('./views/LandingPage/LandingPage' /* webpackChunkName: 'landing' */);
        cb(null, module.default);
      }}
    />

    <Route
      name="play"
      getComponent={async (_, cb) => {
        const module = await import('./views/PlayPage/PlayPage' /* webpackChunkName: 'play' */);
        cb(null, module.default);
      }}
    />

    <Route path="*" component={NotFound} />
  </Route>
);
