import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { renderRoutes } from 'react-router-config';
import { performanceMark } from '../../services/utils';
import bg from './bg.jpg';
import './wrapper.css';

class Wrapper extends Component {
  componentDidMount() {
    performanceMark('firstInteraction');
  }

  render() {
    const { route } = this.props;

    return (
      <div className="wrapper">
        <Helmet title="PWA" />
        <div className="wrapper-bg" style={{ backgroundImage: `url(${bg})` }} />
        {renderRoutes(route.routes)}
      </div>
    );
  }
}

Wrapper.propTypes = {
  route: PropTypes.object,
};

export default Wrapper;
