import React from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import Header from '../../components/Header/Header';
import './wrapper.css';

const Wrapper = ({ route }) => (
  <div className="wrapper">
    <Header />
    {renderRoutes(route.routes)}
  </div>
);

Wrapper.propTypes = {
  route: PropTypes.object,
};

export default Wrapper;
