import { string, object, ref } from 'yup';
import { MESSAGES, CHARCOUNT } from './constants';

const trimString = string().trim();
export const passwordSchema = object().shape({
  currentPassword: trimString
    .min(CHARCOUNT.PASSWORD_MIN, MESSAGES.CURRENT_PASSWORD_MIN)
    .max(CHARCOUNT.PASSWORD_MAX, MESSAGES.CURRENT_PASSWORD_MAX)
    .required(),
  newPassword: trimString
    .min(CHARCOUNT.PASSWORD_MIN, MESSAGES.NEW_PASSWORD_MIN)
    .max(CHARCOUNT.PASSWORD_MAX, MESSAGES.NEW_PASSWORD_MAX)
    .required(),
  confirmPassword: trimString
    .min(CHARCOUNT.PASSWORD_MIN, MESSAGES.NEW_PASSWORD_MIN)
    .max(CHARCOUNT.PASSWORD_MAX, MESSAGES.NEW_PASSWORD_MAX)
    .oneOf([ref('newPassword'), null], 'Passwords must match')
    .required(),
});
