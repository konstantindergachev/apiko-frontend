import { IAccount, ILoginFields } from '@/interfaces/forms';
import React, { useState } from 'react';
import { Input } from '@/components/shared/input';
import { Error } from '@/components/shared/error';
import { loginSchema } from './validate';

export const Login: React.FC<IAccount> = ({ handleAccount }): JSX.Element => {
  const [user, setUser] = useState<ILoginFields>({ email: '', password: '' });
  const [requestError, setRequestError] = useState<string>('');
  const [inputError, setInputError] = useState<ILoginFields>({ email: '', password: '' });

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
      const response = await fetch('http://localhost:3000/api/user/login', {
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
      {requestError && <Error message={requestError} />}
      <h3>login</h3>
      <form onSubmit={handleSubmit}>
        {inputError.email && <Error message={inputError.email} />}
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
          onBlur={validate}
          onKeyPress={validate}
        />
        {inputError.password && <Error message={inputError.password} />}
        <Input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
          onBlur={validate}
          onKeyPress={validate}
        />
        <button type="submit">log in</button>
      </form>
      <p>
        I already have no account,{' '}
        <button type="button" onClick={handleAccount(false)}>
          register now
        </button>
      </p>
    </>
  );
};
