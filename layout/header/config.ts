import Image from 'next/image';
import heart from '../../images/heart.svg';
import basket from '../../images/basket.svg';

export const menu = [
  {
    path: '/heart',
    name: 'Heart',
    component: Image,
    img: heart,
  },
  {
    path: '/basket',
    name: 'Basket',
    component: Image,
    img: basket,
  },
  {
    path: '/register',
    name: 'Register',
    guard: (isAuth: boolean) => !isAuth,
  },
  {
    path: '/login',
    name: 'Log in',
    guard: (isAuth: boolean) => !isAuth,
  },
];
