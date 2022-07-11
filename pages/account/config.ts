import { Input } from '@/components/shared/input';
import { Select } from '@/components/shared/select';

export const inputs = [
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
