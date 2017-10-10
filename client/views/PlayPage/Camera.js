import React from 'react';
import loadScript from 'simple-load-script';
import skullImage from './skull.png';
import spriteImage from './sprite.png';

class Camera extends React.Component {
  state = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    ticks: 0,
    gifSrc: null,
  };

  componentWillMount() {
    this.setState(() => ({
      width: Math.min(window.innerWidth, 414),
      height: Math.min(window.innerWidth, 736),
    }));
  }

  async componentDidMount() {
    const { width, height } = this.state;
    if (this.video && typeof navigator !== 'undefined' && typeof navigator.mediaDevices !== 'undefined') {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width,
          height,
        },
      });
      this.stream = stream;
      this.video.srcObject = stream;
      this.initTracker();
    }
  }

  video = null;
  canvas = null;
  gif = null;
  tracker = null;
  stream = null;

  initTracker = async () => {
    const trackerFile = await import('file-loader!../../../libs/clmtrackr.js' /* webpackChunkName: 'clmtrackr' */); //eslint-disable-line
    await loadScript(trackerFile);
    this.tracker = new clm.tracker(); // eslint-disable-line
    this.tracker.init();
    this.tracker.start(this.video);
  };

  startRecording = async () => {
    const { width, height } = this.state;
    const canvas = this.canvas;
    const context = canvas.getContext('2d');
    const interval = 100;
    let frame = 0;
    let ticks = 35000 / interval;
    let lastFrameTime = Date.now();
    let timer = null;

    const GIF = await import('gif.js.optimized' /* webpackChunkName: 'gifjs' */);
    const gifWorkerFile = await import('file-loader!../../../libs/gif.worker.js' /* webpackChunkName: 'gifworker' */); //eslint-disable-line

    const skull = new Image(200, 200);
    skull.src = skullImage;
    skull.crossOrigin = 'anonymous';

    const sprite = new Image(480, 384);
    sprite.src = spriteImage;
    sprite.crossOrigin = 'anonymous';

    this.gif = new GIF({
      workers: 16,
      quality: 12,
      workerScript: gifWorkerFile,
      width,
      height,
    });

    const drawLoop = () => {
      ticks -= 1;
      frame = (frame + 1) % 10;
      
      this.setState(() => ({
        ticks,
      }));

      if (ticks <= 0) {
        clearInterval(timer);
        return;
      }

      const positions = this.tracker.getCurrentPosition();
      const leftEye = positions[27];
      const rightEye = positions[32];
      context.clearRect(0, 0, width, height);
      if (leftEye && rightEye) {
        const x = rightEye[0] - leftEye[0];
        const y = rightEye[1] - leftEye[1];
        // const angle = Math.atan(y / x);
        const distance = Math.sqrt(x * x + y * y);
        const ratio = distance / 60; // 80 = eyes skull distance
        const sized = 200 * ratio;
        const offsetX = distance / 2;
        const offsetY = 10 * ratio;
        const X = offsetX + leftEye[0] - sized / 2;
        const Y = offsetY + leftEye[1] - sized / 2;
        // const originX = X + sized / 2;
        // const originY = Y + sized / 2;
        context.drawImage(this.video, 0, 0, width, height);
        // start
        // context.save();
        // context.translate(-originX, -originY);
        // context.rotate(angle);
        // context.translate(originX, originY);
        context.drawImage(skull, X, Y, sized, sized);
        context.drawImage(sprite, frame * 100, 0, 100, 100, 0, 0, 100, 100);
        // end
        // context.restore();
      }

      const now = Date.now();

      this.gif.addFrame(context, {
        copy: true,
        delay: now - lastFrameTime,
      });
      lastFrameTime = now;
    };

    timer = setInterval(drawLoop, interval);
  };

  generateGif = () => {
    if (!this.gif.running) {
      this.gif.on('start', () => {
        console.log('starting...');
      });
      this.gif.on('progress', p => {
        console.log('progress', Math.round(p * 100));
      });
      this.gif.on('finished', blob => {
        console.log('finished');
        this.generateFile(blob);
      });

      this.gif.render();
    }
  };

  generateFile = blob => {
    const reader = new window.FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      this.setState(() => ({
        gifSrc: reader.result,
      }));
    };
  };

  render() {
    const { gifSrc, width, height, ticks } = this.state;
    return (
      <div className="camera">
        <video
          ref={el => {
            this.video = el;
          }}
          className="camera__media"
          height={height}
          width={width}
          preload
          autoPlay
          playsInline
          loop
          muted
        >
          <track kind="captions" src="" />
          <track kind="description" src="" />
        </video>
        <canvas
          ref={el => {
            this.canvas = el;
          }}
          className="camera__preview"
          height={height}
          width={width}
        />
        <div className="camera__buttons">
          <a onClick={this.startRecording} className="camera__button">{ticks}</a>
          <a onClick={this.generateGif} className="camera__button">generate gif</a>
        </div>
        {gifSrc && <img key="gif" src={gifSrc} alt="gif" />}
      </div>
    );
  }
}

export default Camera;
