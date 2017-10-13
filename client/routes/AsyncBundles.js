import asyncComponent from '../utils/asyncComponent';
import importCss from '../utils/importCss';

export const ArticlePage = asyncComponent('ArticlePage', () => Promise.all([
  import('../views/ArticlePage/ArticlePage' /* webpackChunkName: 'ArticlePage' */),
  importCss('ArticlePage'),
])); // eslint-disable-line
export const SearchPage = asyncComponent('SearchPage', () => Promise.all([
  import('../views/SearchPage/SearchPage' /* webpackChunkName: 'SearchPage' */),
  importCss('SearchPage'),
])); // eslint-disable-line
export const HomePage = asyncComponent('HomePage', () => Promise.all([
  import('../views/HomePage/HomePage' /* webpackChunkName: 'HomePage' */),
  importCss('HomePage'),
])); // eslint-disable-line
