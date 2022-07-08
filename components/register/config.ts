import { Input } from '../shared/input';

export const inputs = [
  {
    type: 'text',
    id: 'fullname',
    name: 'fullname',
    placeholder: 'John Doe',
    value: '',
    component: Input,
  },
  {
    type: 'email',
    id: 'email',
    name: 'email',
    placeholder: 'example@example.com',
    value: '',
    component: Input,
  },
  {
    type: 'text',
    id: 'phone',
    name: 'phone',
    placeholder: '111 222 3344',
    value: '',
    component: Input,
  },
  {
    type: 'password',
    id: 'password',
    name: 'password',
    placeholder: '********',
    value: '',
    component: Input,
  },
  {
    type: 'password',
    id: 'password_confirm',
    name: 'password_confirm',
    placeholder: '********',
    value: '',
    component: Input,
  },
];
