import React, { useState } from 'react';

interface IForm {
  handleAccount: (isAccount: boolean) => () => void; //MouseEventHandler<HTNLButtonElement>
}

export const Login: React.FC<IForm> = ({ handleAccount }): JSX.Element => {
  const [user, setUser] = useState({ email: '', password: '' });
  const [requestError, setRequestError] = useState<string>('');

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
    setUser((oldState) => ({ ...oldState, [ev.target.name]: ev.target.value }));
  };

  const handleSubmit = async (ev: React.SyntheticEvent): Promise<void> => {
    ev.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.error) {
        setRequestError(data.error);
      }
    } catch (error) {
      setRequestError(error);
    }
  };

  return (
    <>
      {requestError && <p style={{ color: 'red' }}>{requestError}</p>}
      <h3>login</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
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
