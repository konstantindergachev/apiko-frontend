import React from 'react';

interface IProps {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (name: string) => () => void;
  onKeyPress: (name: string) => () => void;
}

export const Input: React.FC<IProps> = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  onKeyPress,
}): JSX.Element => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur(name)}
      onKeyPress={onKeyPress(name)}
    />
  );
};
