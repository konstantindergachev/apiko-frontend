import { useState } from 'react';
import { IDropDown } from '@/interfaces/dropdown';
import { Error } from '@/components/shared/error';

import styles from './styles.module.css';

export const Dropdown: React.FC<IDropDown> = ({ user, setUsername }): JSX.Element => {
  const [error, setError] = useState<string>('');
  const onExit = async () => {
    try {
      await fetch(`http://localhost:3000/api/user/logout`);
      setUsername(() => ({ fullname: '', email: '' }));
    } catch (error: any) {
      setError(error.message);
    }
  };
  return (
    <ul className={styles.dropdown}>
      <li>{user.fullname}</li>
      <li>{user.email}</li>
      <hr />
      <li>
        <button type="button" onClick={onExit} className={styles.btn}>
          Log out
        </button>
        {error && <Error message={error} />}
      </li>
    </ul>
  );
};
