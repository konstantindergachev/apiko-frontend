import React from 'react';

import styles from './styles.module.css';

interface IProps {
  type: string;
  id: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (name: string) => () => void;
  onKeyPress: (name: string) => () => void;
}

export const Input: React.FC<IProps> = ({
  type,
  id,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  onKeyPress,
}): JSX.Element => {
  return (
    <div className={styles.block}>
      <input
        type={type}
        id={id}
        name={name}
        placeholder=" "
        value={value}
        onChange={onChange}
        onBlur={onBlur(name)}
        onKeyPress={onKeyPress(name)}
      />
      <label htmlFor={id}>{placeholder}</label>
    </div>
  );
};
