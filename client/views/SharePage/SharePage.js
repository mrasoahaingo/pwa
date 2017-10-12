import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect } from 'react-router';
import './sharePage.css';

const SharePage = ({ location }) => (
  <div className="share-page">
    {location.state && location.state.gifSrc ? (
      <img src={location.state.gifSrc} alt="share" style={{ width: '100%' }} />
    ) : (
      <Redirect to="/play/" />
    )}
  </div>
);

SharePage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default withRouter(SharePage);
