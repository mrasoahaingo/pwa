import asyncComponent from '../utils/asyncComponent';
import importCss from '../utils/importCss';

export const Wrapper = asyncComponent('Wrapper', () => Promise.all([
  import('../views/Wrapper/Wrapper' /* webpackChunkName: 'Wrapper' */),
  importCss('Wrapper'),
])); // eslint-disable-line
export const LandingPage = asyncComponent('LandingPage', () => Promise.all([
  import('../views/LandingPage/LandingPage' /* webpackChunkName: 'LandingPage' */),
  importCss('LandingPage'),
])); // eslint-disable-line
export const PlayPage = asyncComponent('PlayPage', () => Promise.all([
  import('../views/PlayPage/PlayPage' /* webpackChunkName: 'PlayPage' */),
  importCss('PlayPage'),
])); // eslint-disable-line
