import React from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Header from './components/Header/Header';

const App = ({ routes, initialData }) => (
  <div className="App">
    <Header />
    <Switch>
      {routes.map((route, index) => (
        <Route
          key={route.path}
          path={route.path}
          exact={route.exact}
          render={props =>
            React.createElement(route.component, {
              ...props,
              initialData: initialData[index] || null,
            })}
        />
      ))}
    </Switch>
  </div>
);

App.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  initialData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default App;
