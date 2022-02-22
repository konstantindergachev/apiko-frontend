import { IAccount, IRegistrationFields } from '@/interfaces/forms';
import React, { useState } from 'react';
import { Error } from '@/components/shared/error';
import { registerSchema } from './validate';

export const Register: React.FC<IAccount> = ({ handleAccount }): JSX.Element => {
  const [user, setUser] = useState<IRegistrationFields>({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    password_confirm: '',
  });
  const [requestError, setRequestError] = useState<string>('');
  const [inputError, setInputError] = useState<IRegistrationFields>({
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
      const response = await fetch('http://localhost:3000/api/user/register', {
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
      <h3>register</h3>
      <form onSubmit={handleSubmit}>
        {inputError.fullname && <Error message={inputError.fullname} />}
        <input
          type="text"
          name="fullname"
          placeholder="Full name"
          value={user.fullname}
          onChange={handleChange}
          onBlur={validate('fullname')}
          onKeyPress={validate('fullname')}
        />
        {inputError.email && <Error message={inputError.email} />}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
          onBlur={validate('email')}
          onKeyPress={validate('email')}
        />
        {inputError.phone && <Error message={inputError.phone} />}
        <input
          type="text"
          name="phone"
          placeholder="Phone number"
          value={user.phone}
          onChange={handleChange}
          onBlur={validate('phone')}
          onKeyPress={validate('phone')}
        />
        {inputError.password && <Error message={inputError.password} />}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
          onBlur={validate('password')}
          onKeyPress={validate('password')}
        />
        {inputError.password_confirm && <Error message={inputError.password_confirm} />}
        <input
          type="password"
          name="password_confirm"
          placeholder="Password confirm"
          value={user.password_confirm}
          onChange={handleChange}
          onBlur={validate('password_confirm')}
          onKeyPress={validate('password_confirm')}
        />
        <button type="submit">register</button>
      </form>
      <p>
        I already have an account,{' '}
        <button type="button" onClick={handleAccount(true)}>
          log in
        </button>
      </p>
    </>
  );
};
