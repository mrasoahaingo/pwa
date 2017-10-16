import {
  ArticlePage,
  SearchPage,
  HomePage,
} from './Bundles';

export default [
  {
    component: ArticlePage,
    path: '/article/:remoteId',
    exact: true,
    strict: true,
  },
  {
    component: SearchPage,
    path: '/search/:term',
    exact: true,
    strict: true,
  },
  {
    component: HomePage,
    path: '/:name',
    exact: true,
    strict: true,
  },
  {
    component: HomePage,
    path: '/',
    exact: true,
    strict: true,
  },
];
