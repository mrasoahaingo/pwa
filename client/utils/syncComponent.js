import React from 'react';
import PropTypes from 'prop-types';

function syncComponent(chunkName, mod) {
  const Component = mod.default ? mod.default : mod; // es6 module compat

  function SyncComponent(props) {
    if (props.staticContext.splitPoints) {
      props.staticContext.splitPoints.push(chunkName);
    }

    return (<Component {...props} />);
  }

  SyncComponent.propTypes = {
    staticContext: PropTypes.object,
  };

  return SyncComponent;
}

export default syncComponent;
