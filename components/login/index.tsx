import { IAccount, IInput } from '@/interfaces/forms';
import { IResponse, IResponseError } from '@/interfaces/responses';
import React, { Fragment, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { Input } from '@/components/shared/input';
import { Error } from '@/components/shared/error';
import { Button } from '@/components/shared/button';
import { loginSchema } from './validate';
import { baseUsername } from '../../store';

import { inputs } from './config';
import styles from './styles.module.css';

export const Login: React.FC<IAccount> = ({ handleAccount }): JSX.Element => {
  const [user, setUser] = useState<IInput>({ email: '', password: '' });
  const [requestError, setRequestError] = useState<string>('');
  const [inputError, setInputError] = useState<IInput>({ email: '', password: '' });

  const setUsername = useSetRecoilState(baseUsername);

  const validate = (field: string) => async () => {
    try {
      await loginSchema.validateAt(field, user);
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_PROXI_URL}/user/login`, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data: IResponse & IResponseError = await response.json();
      if (data.message) {
        return setRequestError(data.message);
      }
      setUsername(() => ({
        id: data.account.id,
        fullname: data.account.fullname,
        email: data.account.email,
      }));
    } catch (error: any) {
      setRequestError(error.message);
    }
  };

  return (
    <>
      <div className={styles.content}>
        {requestError && <Error message={requestError} />}
        <h3>login</h3>
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

          <Button type="submit" classNames={styles.loginBtn} label={'log in'} />
        </form>
      </div>
      <p className={styles.toggler}>
        I already have no account,{' '}
        <Button
          type="button"
          classNames={styles.toggleBtn}
          onClick={handleAccount(false)}
          label={'Register now'}
        />
      </p>
    </>
  );
};
