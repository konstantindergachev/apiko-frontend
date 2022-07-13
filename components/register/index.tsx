import { IAccount, IInput } from '@/interfaces/forms';
import React, { Fragment, useState } from 'react';
import { Input } from '@/components/shared/input';
import { Error } from '@/components/shared/error';
import { Button } from '@/components/shared/button';
import { registerSchema } from './validate';

import { inputs } from './config';
import styles from './styles.module.css';

export const Register: React.FC<IAccount> = ({ handleAccount }): JSX.Element => {
  const [user, setUser] = useState<IInput>({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    password_confirm: '',
  });
  const [requestError, setRequestError] = useState<string>('');
  const [inputError, setInputError] = useState<IInput>({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    password_confirm: '',
  });

  const validate = (field: string) => async () => {
    try {
      await registerSchema.validateAt(field, user);
      setInputError((old) => ({ ...old, [field]: '' }));
    } catch (error: any) {
      setInputError((old) => ({ ...old, [field]: error.message }));
    }
  };

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
    setUser((oldState) => ({ ...oldState, [ev.target.name]: ev.target.value }));
  };

  const handleSubmit = async (ev: React.SyntheticEvent): Promise<void> => {
    ev.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PROXI_URL}/user/register`, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.message) {
        setRequestError(data.message);
      }
    } catch (error: any) {
      setRequestError(error.message);
    }
  };

  return (
    <>
      <div className={styles.content}>
        {requestError && <Error message={requestError} />}
        <h3>register</h3>
        <form onSubmit={handleSubmit}>
          {inputs.map((input) => {
            return (
              <Fragment key={input.id}>
                {inputError[input.name] && <Error message={inputError[input.name]} />}
                <Input
                  type={input.type}
                  id={input.id}
                  name={input.name}
                  placeholder={input.placeholder}
                  value={user[input.name]}
                  onChange={handleChange}
                  onBlur={validate}
                  onKeyPress={validate}
                />
              </Fragment>
            );
          })}
          <Button type="submit" classNames={styles.registerBtn} label={'Register'} />
        </form>
      </div>
      <p className={styles.toggler}>
        I already have an account,{' '}
        <Button
          type="button"
          classNames={styles.toggleBtn}
          onClick={handleAccount(true)}
          label={'Log in'}
        />
      </p>
    </>
  );
};
