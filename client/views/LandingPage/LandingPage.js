/* global */

import React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.png';
import './landingPage.css';

const LandingPage = () => (
  <div className="landing-page">
    <img src={logo} alt="" className="landing-page__logo" />
    <Link to="/play/" className="button landing-page__play">
      Participer
    </Link>
  </div>
);

LandingPage.propTypes = {};

export default LandingPage;
