import React from 'react';
import loadScript from 'simple-load-script';
import c from 'classnames';
import { Redirect } from 'react-router';
import skullImage from './skull.png';
import spriteImage from './sprite.png';
import './playPage.css';

const videoDimensions = (video) => {
  // Ratio of the video's intrisic dimensions
  const videoRatio = video.videoWidth / video.videoHeight;
  // The width and height of the video element
  let width = video.offsetWidth;
  let height = video.offsetHeight;
  // The ratio of the element's width to its height
  const elementRatio = width / height;
  if (elementRatio > videoRatio) {
    // If the video element is short and wide
    width = height * videoRatio;
  } else {
    // It must be tall and thin, or exactly equal to the original ratio
    height = width / videoRatio;
  }
  return {
    width,
    height,
  };
};

const START_RECORDING = 'start recording';
const COMPLETE_RECORDING = 'complete recording';
const START_GENERATING = 'start generating gif';
const COMPLETE_GENERATING = 'complete generating gif';

class PlayPage extends React.Component {
  state = {
    width: 100,
    height: 100,
    countDown: 0,
    gifProgress: 0,
    gifSrc: null,
    status: null,
  };

  componentWillMount() {
    if (typeof window !== 'undefined') {
      this.setState(() => ({
        width: Math.min(window.innerWidth, 414),
        height: Math.min(window.innerWidth, 736),
      }));
    }
  }

  async componentDidMount() {
    if (this.video && typeof navigator !== 'undefined') {
      const constraints = {
        audio: false,
        video: true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.stream = stream;
      this.video.srcObject = stream;
      this.video.onloadedmetadata = () => {
        if (typeof window !== 'undefined') {
          const size = videoDimensions(this.video);
          this.setState(() => size);
        }
        this.initTracker();
        this.video.play();
      };
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
    let ticks = 10000 / interval;
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
      quality: 20,
      workerScript: gifWorkerFile,
      width,
      height,
    });

    this.setState(() => ({
      status: START_RECORDING,
    }));

    const drawLoop = () => {
      ticks -= 1;
      frame = (frame + 1) % 10;
      
      this.setState(() => ({
        countDown: ticks / 10,
      }));

      if (ticks <= 0) {
        clearInterval(timer);
        this.setState(() => ({
          status: COMPLETE_RECORDING,
        }));
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
        this.setState(() => ({
          status: START_GENERATING,
        }));
      });
      this.gif.on('progress', p => {
        this.setState(() => ({
          gifProgress: Math.round(p * 100),
        }));
      });
      this.gif.on('finished', blob => {
        this.generateFile(blob);
        this.setState(() => ({
          status: COMPLETE_GENERATING,
        }));
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
    const { gifSrc, width, height, countDown, status, gifProgress } = this.state;
    const cameraClassName = c('camera', {
      'camera--start-recording': status === START_RECORDING,
      'camera--complete-recording': status === COMPLETE_RECORDING,
      'camera--start-generating': status === START_GENERATING,
      'camera--complete-generating': status === COMPLETE_GENERATING,
    });
    return (
      <div className="play-page">
        <div className={cameraClassName}>
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
        </div>
        <div className="camera__buttons">
          <a onClick={this.startRecording} className="button camera__button">
            {status === START_RECORDING ? countDown : 'commencer'}
          </a>
          <a onClick={this.generateGif} className="button camera__button">
            {status === START_GENERATING ? gifProgress : 'enregistrer'}
          </a>
        </div>
        {gifSrc && <Redirect to={{ pathname: '/share/', state: { gifSrc } }} />}
      </div>
    );
  }
}

export default PlayPage;
