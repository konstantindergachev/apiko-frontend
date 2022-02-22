export const CHARCOUNT = {
  FULLNAME_MIN: 6,
  FULLNAME_MAX: 30,
  PASSWORD_MIN: 6,
  PASSWORD_MAX: 100,
  PASSWORD_CONFIRM_MIN: 6,
  PASSWORD_CONFIRM_MAX: 100,
};

export const MESSAGES = {
  FULLNAME_MIN: `fullname must be at least ${CHARCOUNT.FULLNAME_MIN} symbols`,
  FULLNAME_MAX: `fullname must be not greater than ${CHARCOUNT.FULLNAME_MAX} symbols`,
  EMAIL_REQUIRED: 'email is required field',
  EMAIL_IS_VALID: 'email is incorrect',
  PHONE_NUMBER_IS_REQUIRED: 'phone number is a required field',
  PHONE_NUMBER_IS_NOT_VALID: 'phone number is not valid',
  PASSWORD_MIN: `password must be at least ${CHARCOUNT.PASSWORD_MIN} symbols`,
  PASSWORD_MAX: `password must be not greater than ${CHARCOUNT.PASSWORD_MAX} symbols`,
  PASSWORD_CONFIRM_IS_REQUIRED: 'password confirm is a required field',
  PASSWORD_CONFIRM_MIN: `password confirm must be at least ${CHARCOUNT.PASSWORD_CONFIRM_MIN} symbols`,
  PASSWORD_CONFIRM_MAX: `password confirm must be not greater than ${CHARCOUNT.PASSWORD_CONFIRM_MAX} symbols`,
  PASSWORD_CONFIRM_NOT_MATCH: 'passwords must match',
};
