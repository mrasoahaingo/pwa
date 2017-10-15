import React from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Header from './components/Header/Header';
import './app.css';

const App = ({ routes, initialData }) => (
  <div className="app">
    <div className="app__header">
      <Header />
    </div>
    <div className="app__wrapper">
      <Switch>
        {routes.map((route, index) => (
          <Route
            key={route.path}
            path={route.path}
            exact={route.exact}
            render={props => {
              const currentData = initialData[index];
              return React.createElement(route.component, {
                ...props,
                initialData: currentData || null,
              });
            }}
          />
        ))}
      </Switch>
    </div>
  </div>
);

App.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  initialData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default App;
