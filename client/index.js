import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import configureStore from './services/store/configureStore';
import routes from './routes';

const store = configureStore(window.__INITIAL_STATE__);

ReactDOM.render(
  <Provider store={store} key="provider">
    <Router
      routes={routes}
      history={browserHistory}
      onUpdate={() => window.scrollTo(0, 0)}
    />
  </Provider>,
  document.getElementById('root'),
);
