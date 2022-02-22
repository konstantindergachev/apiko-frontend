export const CHARCOUNT = {
  PASSWORD_MIN: 6,
  PASSWORD_MAX: 100,
};

export const MESSAGES = {
  EMAIL_REQUIRED: 'email is required field',
  EMAIL_IS_VALID: 'email is incorrect',
  PASSWORD_MIN: `password must be at least ${CHARCOUNT.PASSWORD_MIN} symbols`,
  PASSWORD_MAX: `password must be not greater than ${CHARCOUNT.PASSWORD_MAX} symbols`,
};
