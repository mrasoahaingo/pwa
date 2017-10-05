import asyncComponent from '../utils/asyncComponent';

export const Wrapper = asyncComponent('Wrapper', () => import('../views/Wrapper/Wrapper' /* webpackChunkName: 'Wrapper' */)); // eslint-disable-line
export const LandingPage = asyncComponent('LandingPage', () => import('../views/LandingPage/LandingPage' /* webpackChunkName: 'LandingPage' */)); // eslint-disable-line
export const PlayPage = asyncComponent('PlayPage', () => import('../views/PlayPage/PlayPage' /* webpackChunkName: 'PlayPage' */)); // eslint-disable-line
