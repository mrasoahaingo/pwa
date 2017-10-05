import { Wrapper, LandingPage, PlayPage } from './Bundles';

export default [
  {
    component: Wrapper,
    routes: [
      {
        component: LandingPage,
        path: '/',
        exact: true,
      },
      {
        component: PlayPage,
        path: '/play',
        exact: true,
      },
    ],
  },
];
