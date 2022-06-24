import type { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { baseFavorites, selectOrder, selectUsername } from 'store';
import { parse } from 'cookie';
import { dateFormat, numberFormat, takeFirstChar } from 'utils';
import { Button } from '@/components/shared/button';
import { Input } from '@/components/shared/input';
import { Select } from '@/components/shared/select';
import { BaseLayout } from '@/layout/base-layout';
import { Error } from '@/components/shared/error';
import { Card } from '@/components/shared/card';
import { LikeButton } from '@/components/like';
import { Success } from '@/components/shared/success';
import { IChangePasswordFields, IInfoFields } from '@/interfaces/forms';
import { IFavorite, IFavorites } from '@/interfaces/favorites';
import { IOrder } from '@/interfaces/orders';
import { IResponse, IResponseError } from '@/interfaces/responses';
import { orderSchema } from 'pages/basket/validate';
import { passwordSchema } from './validate';

import styles from './styles.module.css';

interface IProps {
  userInfo: IInfoFields;
  favorites: IFavorite[];
}

const Account: NextPage<IProps> = ({ userInfo, favorites }): JSX.Element => {
  const { id: userId, ...account } = useRecoilValue(selectUsername);
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

  const [loadFavorites, setLoadFavorites] = useState<IFavorite[]>(favorites);
  const setFavorite = useSetRecoilState(baseFavorites);
  const [ids, setIds] = useState<number[]>([]);
  const [requestSuccess, setRequestSuccess] = useState<string>('');
  const order = useRecoilValue(selectOrder);
  const [orders] = useState<IOrder[]>([order]);

  useEffect(() => {
    setFavorite(() => [...favorites]);
  }, [favorites]);

  useEffect(() => {
    const favoritesId: number[] = [];
    favorites.forEach((favorite: IFavorite) => {
      if (favorite.product.id) {
        favoritesId.push(favorite.product.id);
      }
    });
    setIds([...favoritesId]);
  }, [favorites]);

  useEffect(() => {
    setUser((old) => ({ ...old, ...userInfo }));
  }, []);

  const handleTabs = (tabIndex: number) => (): void => {
    setTabIndex(tabIndex);
  };

  const handleChangeInfo = (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    setUser((old) => ({ ...old, [ev.target.name]: ev.target.value }));
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
      const response = await fetch('http://localhost:3000/api/user/account', {
        method: 'PUT',
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

  const handleChangePassword = (ev: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword((old) => ({ ...old, [ev.target.name]: ev.target.value }));
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
      const response = await fetch('http://localhost:3000/api/user/password', {
        method: 'PUT',
        body: JSON.stringify(password),
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

  const handleProductLike = (productId: number) => (): void => {
    if (ids.includes(productId)) {
      removeLike(productId, userId);
      const filteredIds = ids.filter((id) => id !== productId);
      setIds([...filteredIds]);
      setLoadFavorites((oldFavorites) =>
        oldFavorites.filter((oldFavorite) => oldFavorite.product.id !== productId)
      );
    }
  };

  const removeLike = async (productId: number, userId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/favorites/remove?productId=${productId}&userId=${userId}`
      );
      const data: IResponse & IResponseError = await response.json();

      if (data.message) {
        setRequestSuccess(data.message);
      }
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
            {requestSuccess && <Success message={requestSuccess} />}
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
                        value={user.country || ''}
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
                        value={user.city || ''}
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
                        value={user.address || ''}
                        onChange={handleChangeInfo}
                        onBlur={validateInfo}
                        onKeyPress={validateInfo}
                      />
                      {inputInfoError.address && <Error message={inputInfoError.address} />}
                      <Button type="submit" classNames={styles.saveBtn} label={'Save'} />
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
                      <Button type="submit" classNames={styles.saveBtn} label={'Change password'} />
                    </form>
                  </div>
                </>
              ) : tabIndex === 2 ? (
                orders.map((order: IOrder) => {
                  return (
                    <div key={order.id} className={styles.cardWrap}>
                      <Card classNames={styles.card}>
                        <div>
                          <p>
                            Order ID: <span>{order.id}</span>
                          </p>
                          <p>
                            Price: <span>{numberFormat(order.total)}</span>
                          </p>
                        </div>
                        <div>
                          <p>
                            Customer ID: <span>{order.user.id}</span>
                          </p>
                          <p>
                            Date: <span>{dateFormat(order.created_at)}</span>
                          </p>
                        </div>
                      </Card>
                    </div>
                  );
                })
              ) : tabIndex === 3 ? (
                <>
                  <div className={styles.favoritesWrap}>
                    {loadFavorites.length &&
                      loadFavorites.map((favorite) => {
                        return (
                          <Card key={favorite.id} classNames={styles.favoriteCard}>
                            {favorite.product.picture && (
                              <Link href={`/product/${favorite.product.id}`}>
                                <a>
                                  <Image
                                    src={favorite.product.picture}
                                    alt={favorite.product.title}
                                    width={400}
                                    height={250}
                                  />
                                </a>
                              </Link>
                            )}
                            <div className={styles.content}>
                              <p>{favorite.product.title}</p>
                              <h4>
                                {new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: 'USD',
                                }).format(+favorite.product.price)}
                              </h4>
                              <LikeButton
                                onClick={handleProductLike}
                                productId={favorite.product.id}
                                isLiked={ids.includes(favorite.product.id)}
                              />
                            </div>
                          </Card>
                        );
                      })}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </section>
      </main>
    </BaseLayout>
  );
};

export default Account;

export const getServerSideProps: GetServerSideProps = async ({
  req,
}): Promise<{
  props: { userInfo: IInfoFields; favorites: IFavorites };
}> => {
  let cookie;
  let token;
  if (req.headers.cookie) {
    cookie = parse(req.headers.cookie);
    token = cookie.token;
  }
  const baseProductLimit = 6;
  const favoritesPromise = fetch(
    `${process.env.API_URL}/favorite/favorites?offset=0&limit=${baseProductLimit}&sortBy=latest`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const accountPromise = fetch(`${process.env.API_URL}/account`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const [accountResponse, favoritesResponse] = await Promise.all([
    accountPromise,
    favoritesPromise,
  ]);
  const userInfo = await accountResponse.json();
  const favorites = await favoritesResponse.json();

  return {
    props: { userInfo, favorites },
  };
};
