import { Wrapper, LandingPage, PlayPage, SharePage } from './Bundles';

/*
import Wrapper from '../views/Wrapper/Wrapper';
import LandingPage from '../views/LandingPage/LandingPage';
import PlayPage from '../views/PlayPage/PlayPage';
*/

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
      {
        component: SharePage,
        path: '/share/',
        exact: true,
      },
    ],
  },
];
