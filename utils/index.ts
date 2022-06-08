export const numberFormat = (numb: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numb);
};

export const takeFirstWord = (str: string): string => {
  return str.split(' ')[0];
};

export const takeFirstChar = (str: string): string => {
  return str
    .split(' ')
    .map((word) => word.charAt(0))
    .join('');
};
