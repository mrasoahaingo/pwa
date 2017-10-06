import React from 'react';

function asyncComponent(chunkName, getComponent) {
  return class AsyncComponent extends React.Component {
    static Component = null;

    static loadComponent = getComponent;

    _loadComponent = async () => {
      const mod = await getComponent();
      this.setState({ Component: mod.default || mod });
    };

    mounted = false;

    state = {
      Component: AsyncComponent.Component,
    };

    componentWillMount() {
      if (this.state.Component === null) {
        this._loadComponent();
      }
    }

    componentDidMount() {
      this.mounted = true;
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    render() {
      const { Component } = this.state;

      if (Component !== null) {
        return <Component {...this.props} />;
      }
      return null; // or <div /> with a loading spinner, etc..
    }
  };
}

export default asyncComponent;
