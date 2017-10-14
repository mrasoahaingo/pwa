/* eslint-disable max-len, import/no-unresolved */
import fs from 'fs';

export const styles = (assetsData) => Object.keys(assetsData)
  .reduce((obj, entry) => ({
    ...obj,
    [entry]: {
      ...assetsData[entry],
      styles: assetsData[entry].css
        ? fs.readFileSync(`build/client/css/${assetsData[entry].css.split('/').pop()}`, 'utf8')
        : undefined,
    },
  }), {});

export const scripts = {
  serviceWorker: `
    if('serviceWorker' in window.navigator) {
      window.addEventListener('load', function() {
        window.navigator.serviceWorker.register("/serviceWorker.js").then(function(registration) {
          console.log("ServiceWorker registration successful with scope: ", registration.scope);
        }).catch(function(error) {
          console.error("ServiceWorker registration failed: ", error);
        });
      });
    }
  `,
};
