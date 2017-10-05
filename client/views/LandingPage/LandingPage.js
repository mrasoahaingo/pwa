/* global */

import React from 'react';
import { Link } from 'react-router-dom';
import './landingPage.css';

const LandingPage = () => (
  <div className="landing-page">
    <Link to="/play">play</Link>
  </div>
);

LandingPage.propTypes = {};

export default LandingPage;
