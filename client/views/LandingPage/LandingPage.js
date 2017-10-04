/* global */

import React, { Component } from 'react';
import loadScript from 'simple-load-script';
import GIF from 'gif.js.optimized';
import './landingPage.css';
import skullImage from './skull.png';

const LandingPage = () => (
  <div className="landing-page">
    <Camera />
  </div>
);

const skull = new Image(178, 178);
skull.src = skullImage;
skull.crossOrigin = 'anonymous';

LandingPage.propTypes = {};

class Camera extends Component {

  state = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    gifSrc: null,
  };

  componentDidMount() {
    navigator.getUserMedia({
      video: true,
    }, (stream) => {
      this.video.src = (window.URL && window.URL.createObjectURL(stream));
      this.initTracker();
    }, () => {
      // no support
    });
  }

  video = null;
  canvas = null;
  gif = null;
  tracker = null;

  initTracker = async () => {
    const trackerFile = await import('file-loader!../../libs/clmtrackr.js' /* webpackChunkName: 'clmtrackr' */); //eslint-disable-line
    await loadScript(trackerFile);
    this.tracker = new clm.tracker(); // eslint-disable-line
    this.tracker.init();
    this.tracker.start(this.video);
  }

  startRecording = async () => {
    const canvas = this.canvas;
    const context = canvas.getContext('2d');
    const interval = 100;
    let ticks = 3500 / interval;
    let lastFrameTime = Date.now();
    let timer = null;

    const gifWorkerFile = await import('file-loader!../../libs/gif.worker.js' /* webpackChunkName: 'gifworker' */); //eslint-disable-line

    this.gif = new GIF({
      workerScript: gifWorkerFile,
      width: canvas.width,
      height: canvas.height,
    });

    const drawLoop = () => {
      ticks -= 1;

      if (ticks <= 0) {
        clearInterval(timer);
        console.log('recording finished');
        return;
      }

      console.log('ticks', ticks);

      const positions = this.tracker.getCurrentPosition();
      const leftEye = positions[27];
      const rightEye = positions[32];
      // const [ rightX, rightY ] = positions[32];
      if (leftEye) {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const angle = Math.atan((rightEye[1] - leftEye[1]) / (rightEye[0] - leftEye[0]));
        const distance = rightEye[0] - leftEye[0];
        const ratio = distance / 40;
        const [offsetX, offsetY] = [89 + (leftEye[0] / 2), 30 + (leftEye[1] / 2)];
        // player
        context.drawImage(this.video, 0, 0, canvas.width, canvas.height);
        // start
        context.save();
        context.translate(offsetX, offsetY);
        context.rotate(angle);
        context.scale(ratio, ratio);
        context.translate(-offsetX, -offsetY);
        // skull
        context.drawImage(skull, leftEye[0] - 69, leftEye[1] - 72);
        // end
        context.restore();
      }

      this.gif.addFrame(context, { copy: true, delay: (Date.now() - lastFrameTime) });
      lastFrameTime = Date.now();
    };

    timer = setInterval(drawLoop, interval);
  }

  generateGif = () => {
    if (!this.gif.running) {
      this.gif.on('start', () => {
        console.log('starting...');
      });
      this.gif.on('progress', (p) => {
        console.log('progress', (Math.round(p * 100)));
      });
      this.gif.on('finished', (blob) => {
        console.log('finished');
        this.generateFile(blob);
      });

      this.gif.render();
    }
  }

  generateFile = (blob) => {
    const reader = new window.FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      this.setState(() => ({
        gifSrc: reader.result,
      }));
    };
  }

  render() {
    const { gifSrc } = this.state;
    return (
      <div>
        <video ref={(el) => { this.video = el; }} width="320" height="240" preload autoPlay playsInline loop muted>
          <track kind="captions" src="" />
        </video>
        <canvas ref={(el) => { this.canvas = el; }} id="canvas" width="320" height="240" />
        <button onClick={this.startRecording}>start recording</button>
        <button onClick={this.generateGif}>generate gif</button>
        {gifSrc && <img src={gifSrc} alt="gif" />}
      </div>
    );
  }
}

export default LandingPage;
