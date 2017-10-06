import { Wrapper, LandingPage, PlayPage } from './AsyncBundles';

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
        path: '/play/',
        exact: true,
      },
    ],
  },
];
