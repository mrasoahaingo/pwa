import React from 'react';
import PropTypes from 'prop-types';

function syncComponent(chunkName, mod) {
  const Component = mod.default ? mod.default : mod; // es6 module compat

  class SyncComponent extends React.Component {
    static propTypes = {
      staticContext: PropTypes.object,
    };

    static getInitialData(ctx) {
      return Component.getInitialData
        ? Component.getInitialData(ctx)
        : Promise.resolve({});
    }

    constructor(props) {
      super(props);
      if (props.staticContext.splitPoints) {
        props.staticContext.splitPoints.push(chunkName);
      }
    }

    render() {
      return (<Component {...this.props} />);
    }
  }

  return SyncComponent;
}

export default syncComponent;
