import { string, object, ref } from 'yup';
import { MESSAGES, CHARCOUNT } from './constants';

const trimString = string().trim();
const phoneRegExp = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
export const registerSchema = object().shape({
  fullname: trimString
    .min(CHARCOUNT.FULLNAME_MIN, MESSAGES.FULLNAME_MIN)
    .max(CHARCOUNT.FULLNAME_MAX, MESSAGES.FULLNAME_MAX)
    .required(),
  email: trimString.email(MESSAGES.EMAIL_IS_VALID).required(MESSAGES.EMAIL_REQUIRED),
  phone: trimString
    .required(MESSAGES.PHONE_NUMBER_IS_REQUIRED)
    .matches(phoneRegExp, MESSAGES.PHONE_NUMBER_IS_NOT_VALID),
  password: trimString
    .min(CHARCOUNT.PASSWORD_MIN, MESSAGES.PASSWORD_MIN)
    .max(CHARCOUNT.PASSWORD_MAX, MESSAGES.PASSWORD_MAX)
    .required(),
  password_confirm: trimString
    .min(CHARCOUNT.PASSWORD_CONFIRM_MIN, MESSAGES.PASSWORD_CONFIRM_MIN)
    .max(CHARCOUNT.PASSWORD_CONFIRM_MAX, MESSAGES.PASSWORD_CONFIRM_MAX)
    .required(MESSAGES.PASSWORD_CONFIRM_IS_REQUIRED)
    .oneOf([ref('password'), null], MESSAGES.PASSWORD_CONFIRM_NOT_MATCH),
});
