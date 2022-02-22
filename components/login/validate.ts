import { string, object } from 'yup';
import { MESSAGES, CHARCOUNT } from './constants';

const trimString = string().trim();
export const loginSchema = object().shape({
  email: trimString.email(MESSAGES.EMAIL_IS_VALID).required(MESSAGES.EMAIL_REQUIRED),
  password: trimString
    .min(CHARCOUNT.PASSWORD_MIN, MESSAGES.PASSWORD_MIN)
    .max(CHARCOUNT.PASSWORD_MAX, MESSAGES.PASSWORD_MAX)
    .required(),
});
