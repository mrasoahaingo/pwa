/* eslint-disable max-len, import/no-unresolved */
import { scripts } from './fragments';
// import assetsManifest from '../../build/client/assetsManifest.json';

export default {
  earlyChunk(context, { getAsset }) {
    const preloadChunks = context.splitPoints.map(
      chunkName =>
        getAsset(chunkName)
          ? `<link rel="preload" as="script" href="${getAsset(chunkName).js}">`
          : '',
    );
    return `
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1">
          <link rel="preconnect" href="//cdnjs.cloudflare.com">
          <link rel="preload" as="script" href="${getAsset('webpackManifest').js}">
          <link rel="preload" as="script" href="${getAsset('vendor').js}">
          <link rel="preload" as="script" href="${getAsset('main').js}">
          ${preloadChunks.join('')}`;
  },

  lateChunk(app, head, initialState, context, { getAsset, assetsData }) {
    const cssChunks = context.splitPoints.map(
      chunkName =>
        getAsset(chunkName) && getAsset(chunkName).css
          ? `<link rel="stylesheet" type="text/css" href="${getAsset(chunkName).css}">`
          : '',
    );
    return `
          ${__LOCAL__ || !getAsset('vendor').css
            ? ''
            : `<link rel="stylesheet" type="text/css" href="${getAsset('vendor').css}">`}
          ${__LOCAL__ || !getAsset('main').css
            ? ''
            : `<link rel="stylesheet" type="text/css" href="${getAsset('main').css}">`}
          ${__LOCAL__ ? '' : cssChunks.join('')}
          ${__LOCAL__ ? '' : '<link rel="manifest" href="/manifest.json">'}
          <meta name="mobile-web-app-capable" content="yes">
          <meta name="apple-mobile-web-app-capable" content="yes">
          <meta name="application-name" content="PWA">
          <meta name="apple-mobile-web-app-title" content="PWA">
          <meta name="theme-color" content="#5500eb">
          <meta name="msapplication-navbutton-color" content="#5500eb">
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
          <meta name="msapplication-starturl" content="/">
          <link rel="icon" type="image/png" sizes="256x256" href="https://raw.githubusercontent.com/simonfl3tcher/react-progressive-web-app/master/public/assets/images/icons/icon-512x512.png">
          <link rel="apple-touch-icon" type="image/png" sizes="256x256" href="https://raw.githubusercontent.com/simonfl3tcher/react-progressive-web-app/master/public/assets/images/icons/icon-512x512.png">
          ${head.title.toString()}
          ${head.meta.toString()}
          ${head.link.toString()}
          ${head.script.toString()}
        </head>
        <body>
          <script>window.module = window.module || {}</script>
          <div id="root">${app}</div>
          <script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}</script>
          <script>window.__ASSETS_MANIFEST__ = ${JSON.stringify(assetsData)}</script>
          <script>window.__WEBPACK_CHUNKS__ =${JSON.stringify(context.splitPoints)};</script>
          <script src="${getAsset('webpackManifest').js}"></script>
          <script src="${getAsset('vendor').js}"></script>
          <script src="${getAsset('main').js}"></script>
          ${__LOCAL__ ? '' : `<script>${scripts.serviceWorker}</script>`}
          </body>
      </html>`;
  },
};
