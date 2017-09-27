import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Wrapper from './views/Wrapper/Wrapper';
import NotFound from './views/NotFound/NotFound';

export default (
  <Route path="/" component={Wrapper}>

    <IndexRoute
      name="landing"
      getComponent={async (_, cb) => {
        const module = await import('./views/LandingPage/LandingPage' /* webpackChunkName: 'landing' */);
        cb(null, module.default);
      }}
    />

    <Route path="*" component={NotFound} />

  </Route>
);
