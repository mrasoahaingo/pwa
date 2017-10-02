/* global tracking */

import React, { Component } from 'react';
import './landingPage.css';

const LandingPage = () => (
  <div className="landing-page">
    <Camera />
  </div>
);

LandingPage.propTypes = {};

class Camera extends Component {

  state = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  componentDidMount() {
    const canvas = this.canvas;
    const context = canvas.getContext('2d');
    const tracker = new tracking.ObjectTracker(['face']);
    tracking.track(this.video, tracker, { camera: true });
    tracker.on('track', (event) => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      event.data.forEach((rect) => {
        context.strokeStyle = '#a64ceb';
        context.strokeRect(rect.x, rect.y, rect.width, rect.height);
      });
    });
  }

  video = null;
  canvas = null;

  render() {
    return (
      <div>
        <video ref={(el) => { this.video = el; }} width="320" height="240" preload autoPlay loop muted>
          <track kind="captions" src="" />
        </video>
        <canvas ref={(el) => { this.canvas = el; }} id="canvas" width="320" height="240" />
      </div>
    );
  }
}

export default LandingPage;
