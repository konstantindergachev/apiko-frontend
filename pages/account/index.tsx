import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { selectUsername } from 'store';
import { takeFirstChar } from 'utils';
import { Button } from '@/components/shared/button';
import { Input } from '@/components/shared/input';
import { Select } from '@/components/shared/select';
import { BaseLayout } from '@/layout/base-layout';
import { Error } from '@/components/shared/error';
import { orderSchema } from 'pages/basket/validate';
import { passwordSchema } from './validate';

import styles from './styles.module.css';
import { IChangePasswordFields, IInfoFields } from '@/interfaces/forms';

const Account: React.FC = (): JSX.Element => {
  const { id, ...account } = useRecoilValue(selectUsername);
  const [tabIndex, setTabIndex] = useState<number>(2);
  const [user, setUser] = useState<IInfoFields>({
    fullname: '',
    phone: '',
    country: '',
    city: '',
    address: '',
  });
  const [inputInfoError, setInputInfoError] = useState({
    fullname: '',
    phone: '',
    country: '',
    city: '',
    address: '',
  });
  const [requestError, setRequestError] = useState<string>('');
  const [password, setPassword] = useState<IChangePasswordFields>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [inputPasswordError, setInputPasswordError] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleTabs = (tabIndex: number) => (): void => {
    setTabIndex(tabIndex);
  };

  const handleChangeInfo = (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    setUser((oldState) => ({ ...oldState, [ev.target.name]: ev.target.value }));
  };

  const validateInfo = (field: string) => async () => {
    try {
      await orderSchema.validateAt(field, user);
      setInputInfoError((old) => ({ ...old, [field]: '' }));
    } catch (error: any) {
      setInputInfoError((old) => ({ ...old, [field]: error.message }));
    }
  };

  const saveInfo = async (ev: React.SyntheticEvent): Promise<void> => {
    ev.preventDefault();
    try {
      console.log('ev', ev); //FIXME: Remove this line
    } catch (error: any) {
      setRequestError(error.message);
    }
  };

  const handleChangePassword = (ev: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword((oldState) => ({ ...oldState, [ev.target.name]: ev.target.value }));
  };

  const validatePassword = (field: string) => async () => {
    try {
      await passwordSchema.validateAt(field, password);
      setInputPasswordError((old) => ({ ...old, [field]: '' }));
    } catch (error: any) {
      setInputPasswordError((old) => ({ ...old, [field]: error.message }));
    }
  };

  const changePassword = async (ev: React.SyntheticEvent): Promise<void> => {
    ev.preventDefault();
    try {
      console.log('ev', ev); //FIXME: Remove this line
    } catch (error: any) {
      setRequestError(error.message);
    }
  };

  return (
    <BaseLayout>
      <main>
        <section className={styles.account}>
          <div className={styles.top}>
            <div>{takeFirstChar(account.fullname)}</div>
            <p>{account.fullname}</p>
          </div>
          <div className={styles.middle}>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${tabIndex === 1 && styles.active}`}
                onClick={handleTabs(1)}
              >
                edit account
              </button>
              <button
                className={`${styles.tab} ${tabIndex === 2 && styles.active}`}
                onClick={handleTabs(2)}
              >
                order history
              </button>
              <button
                className={`${styles.tab} ${tabIndex === 3 && styles.active}`}
                onClick={handleTabs(3)}
              >
                favourites
              </button>
            </div>
            <div className={styles.tabContent}>
              {tabIndex === 1 ? (
                <>
                  <div>
                    <h3>My information</h3>
                    <form onSubmit={saveInfo}>
                      {requestError && <Error message={requestError} />}
                      <Input
                        type="text"
                        id="fullname"
                        name="fullname"
                        placeholder="Full name"
                        value={user.fullname}
                        onChange={handleChangeInfo}
                        onBlur={validateInfo}
                        onKeyPress={validateInfo}
                      />
                      {inputInfoError.fullname && <Error message={inputInfoError.fullname} />}
                      <Input
                        type="text"
                        id="phone"
                        name="phone"
                        placeholder="Phone number"
                        value={user.phone}
                        onChange={handleChangeInfo}
                        onBlur={validateInfo}
                        onKeyPress={validateInfo}
                      />
                      {inputInfoError.phone && <Error message={inputInfoError.phone} />}
                      <Select
                        name="country"
                        id="country"
                        placeholder="Country"
                        value={user.country}
                        onChange={handleChangeInfo}
                        onBlur={validateInfo}
                        onKeyPress={validateInfo}
                      />
                      {inputInfoError.country && <Error message={inputInfoError.country} />}
                      <Input
                        type="text"
                        id="city"
                        name="city"
                        placeholder="City"
                        value={user.city}
                        onChange={handleChangeInfo}
                        onBlur={validateInfo}
                        onKeyPress={validateInfo}
                      />
                      {inputInfoError.city && <Error message={inputInfoError.city} />}
                      <Input
                        type="text"
                        id="address"
                        name="address"
                        placeholder="Address"
                        value={user.address}
                        onChange={handleChangeInfo}
                        onBlur={validateInfo}
                        onKeyPress={validateInfo}
                      />
                      {inputInfoError.address && <Error message={inputInfoError.address} />}
                      <Button
                        type="button"
                        classNames={styles.saveBtn}
                        label={'Save'}
                        onClick={confirm}
                      />
                    </form>
                  </div>
                  <div>
                    <h3>Change password</h3>
                    <form onSubmit={changePassword}>
                      <Input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        placeholder="Current password"
                        value={password.currentPassword}
                        onChange={handleChangePassword}
                        onBlur={validatePassword}
                        onKeyPress={validatePassword}
                      />
                      {inputPasswordError.currentPassword && (
                        <Error message={inputPasswordError.currentPassword} />
                      )}
                      <Input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        placeholder="New password"
                        value={password.newPassword}
                        onChange={handleChangePassword}
                        onBlur={validatePassword}
                        onKeyPress={validatePassword}
                      />
                      {inputPasswordError.newPassword && (
                        <Error message={inputPasswordError.newPassword} />
                      )}
                      <Input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={password.confirmPassword}
                        onChange={handleChangePassword}
                        onBlur={validatePassword}
                        onKeyPress={validatePassword}
                      />
                      {inputPasswordError.confirmPassword && (
                        <Error message={inputPasswordError.confirmPassword} />
                      )}
                      <Button
                        type="button"
                        classNames={styles.saveBtn}
                        label={'Change password'}
                        onClick={confirm}
                      />
                    </form>
                  </div>
                </>
              ) : tabIndex === 2 ? (
                <h4>Order</h4>
              ) : tabIndex === 3 ? (
                <h4>Favorites</h4>
              ) : null}
            </div>
          </div>
        </section>
      </main>
    </BaseLayout>
  );
};

export default Account;
