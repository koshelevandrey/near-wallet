import { lazy } from 'react';

const SignIn = lazy(() => import('../../components/homePage'));
const ChooseMethod = lazy(() => import('../../components/chooseMethod'));

const routes = [
  {
    component: SignIn,
    path: '/sign-in',
  },
  {
    component: ChooseMethod,
    path: '/choose-method',
  },
];

export default routes;