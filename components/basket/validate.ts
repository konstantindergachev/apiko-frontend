import { string, object } from 'yup';
import { MESSAGES, CHARCOUNT } from './constants';

const trimString = string().trim();
const phoneRegExp = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
export const orderSchema = object().shape({
  fullname: trimString
    .min(CHARCOUNT.FULLNAME_MIN, MESSAGES.FULLNAME_MIN)
    .max(CHARCOUNT.FULLNAME_MAX, MESSAGES.FULLNAME_MAX)
    .required(),
  phone: trimString
    .required(MESSAGES.PHONE_NUMBER_IS_REQUIRED)
    .matches(phoneRegExp, MESSAGES.PHONE_NUMBER_IS_NOT_VALID),
  country: trimString.required(),
  city: trimString
    .min(CHARCOUNT.CITY_MIN, MESSAGES.CITY_MIN)
    .max(CHARCOUNT.CITY_MAX, MESSAGES.CITY_MAX)
    .required(),
  address: trimString
    .min(CHARCOUNT.ADDRESS_MIN, MESSAGES.ADDRESS_MIN)
    .max(CHARCOUNT.ADDRESS_MAX, MESSAGES.ADDRESS_MAX)
    .required(),
});
