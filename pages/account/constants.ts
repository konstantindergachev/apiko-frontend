export const CHARCOUNT = {
  PASSWORD_MIN: 6,
  PASSWORD_MAX: 100,
};

export const MESSAGES = {
  CURRENT_PASSWORD_MIN: `current password must be at least ${CHARCOUNT.PASSWORD_MIN} symbols`,
  CURRENT_PASSWORD_MAX: `current password must be not greater than ${CHARCOUNT.PASSWORD_MAX} symbols`,
  NEW_PASSWORD_MIN: `new password must be at least ${CHARCOUNT.PASSWORD_MIN} symbols`,
  NEW_PASSWORD_MAX: `new password must be not greater than ${CHARCOUNT.PASSWORD_MAX} symbols`,
};
