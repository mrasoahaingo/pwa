import {
  Wrapper,
  ArticlePage,
  SearchPage,
  HomePage,
} from './Bundles';

export default [
  {
    component: Wrapper,
    routes: [
      {
        component: ArticlePage,
        path: '/article/:id',
        exact: true,
      },
      {
        component: SearchPage,
        path: '/search/:term',
        exact: true,
      },
      {
        component: HomePage,
        path: '/:name',
        exact: true,
      },
      {
        component: HomePage,
        path: '/',
        exact: true,
      },
    ],
  },
];
