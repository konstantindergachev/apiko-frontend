export const CHARCOUNT = {
  FULLNAME_MIN: 6,
  FULLNAME_MAX: 30,
  CITY_MIN: 6,
  CITY_MAX: 30,
  ADDRESS_MIN: 6,
  ADDRESS_MAX: 30,
};

export const MESSAGES = {
  FULLNAME_MIN: `fullname must be at least ${CHARCOUNT.FULLNAME_MIN} symbols`,
  FULLNAME_MAX: `fullname must be not greater than ${CHARCOUNT.FULLNAME_MAX} symbols`,
  PHONE_NUMBER_IS_REQUIRED: 'phone number is a required field',
  PHONE_NUMBER_IS_NOT_VALID: 'phone number is not valid',
  CITY_MIN: `city name must be at least ${CHARCOUNT.CITY_MIN} symbols`,
  CITY_MAX: `city name must be not greater than ${CHARCOUNT.CITY_MAX} symbols`,
  ADDRESS_MIN: `address must be at least ${CHARCOUNT.ADDRESS_MIN} symbols`,
  ADDRESS_MAX: `address must be not greater than ${CHARCOUNT.ADDRESS_MAX} symbols`,
};
