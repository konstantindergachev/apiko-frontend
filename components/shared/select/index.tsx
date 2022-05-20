import React from 'react';
import { options } from './config';

import styles from './styles.module.css';

interface IProps {
  name: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (ev: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: (name: string) => () => void;
  onKeyPress: (name: string) => () => void;
}

interface IOption {
  key: string;
  value: string;
}

export const Select: React.FC<IProps> = ({
  name,
  id,
  placeholder,
  value,
  onChange,
  onBlur,
  onKeyPress,
}): JSX.Element => {
  return (
    <div className={styles.block}>
      <select
        id={id}
        name={name}
        defaultValue={value}
        onChange={onChange}
        onBlur={onBlur(name)}
        onKeyPress={onKeyPress(name)}
      >
        {options.map((option: IOption) => (
          <option key={option.key} value={option.key}>
            {option.value}
          </option>
        ))}
      </select>
      <label htmlFor={id}>{placeholder}</label>
    </div>
  );
};
