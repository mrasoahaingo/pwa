import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import routes from './routes/routes';
import App from './App';

const renderApp = () => {
  ReactDOM.render(
    <BrowserRouter>
      <App routes={routes} initialData={window.__INITIAL_STATE__ || []} />
    </BrowserRouter>,
    document.getElementById('root'),
  );
};

renderApp();
