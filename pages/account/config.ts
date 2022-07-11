import { Input } from '@/components/shared/input';
import { Select } from '@/components/shared/select';

export const infoInputs = [
  {
    type: 'text',
    id: 'fullname',
    name: 'fullname',
    placeholder: 'Fullname',
    value: '',
    component: Input,
  },
  {
    type: 'text',
    id: 'phone',
    name: 'phone',
    placeholder: 'Phone',
    value: '',
    component: Input,
  },
  {
    type: 'text',
    id: 'country',
    name: 'country',
    placeholder: 'Country',
    value: '',
    component: Select,
  },
  {
    type: 'text',
    id: 'city',
    name: 'city',
    placeholder: 'City',
    value: '',
    component: Input,
  },
  {
    type: 'text',
    id: 'address',
    name: 'address',
    placeholder: 'Address',
    value: '',
    component: Input,
  },
];

export const passwordInputs = [
  {
    type: 'password',
    id: 'currentPassword',
    name: 'currentPassword',
    placeholder: 'Current Password',
    value: '',
    component: Input,
  },
  {
    type: 'password',
    id: 'newPassword',
    name: 'newPassword',
    placeholder: 'New Password',
    value: '',
    component: Input,
  },
  {
    type: 'password',
    id: 'confirmPassword',
    name: 'confirmPassword',
    placeholder: 'Confirm Password',
    value: '',
    component: Input,
  },
];
