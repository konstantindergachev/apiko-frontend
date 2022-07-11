import type { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { baseFavorites, selectUsername } from 'store';
import { parse } from 'cookie';
import { dateFormat, numberFormat, takeFirstChar } from 'utils';
import { Button } from '@/components/shared/button';
import { Input } from '@/components/shared/input';
import { BaseLayout } from '@/layout/base-layout';
import { Error } from '@/components/shared/error';
import { Card } from '@/components/shared/card';
import { LikeButton } from '@/components/like';
import { Success } from '@/components/shared/success';
import { IInfoFields, IInput } from '@/interfaces/forms';
import { IFavorite, IFavorites } from '@/interfaces/favorites';
import { IOrder } from '@/interfaces/orders';
import { IResponse, IResponseError } from '@/interfaces/responses';
import { orderSchema } from 'pages/basket/validate';
import { passwordSchema } from './validate';

import { infoInputs, passwordInputs } from './config';
import styles from './styles.module.css';

interface IProps {
  userInfo: IInfoFields;
  favorites: IFavorite[];
  orders: IOrder[];
  tabIdx: number;
}

const Account: NextPage<IProps> = ({ userInfo, favorites, orders, tabIdx = 2 }): JSX.Element => {
  const router = useRouter();
  const { id: userId, ...account } = useRecoilValue(selectUsername);
  const [tabIndex, setTabIndex] = useState<number>(Number(router.query?.tabIdx) || tabIdx);
  const [user, setUser] = useState<IInput>({
    fullname: '',
    phone: '',
    country: '',
    city: '',
    address: '',
  });
  const [inputInfoError, setInputInfoError] = useState<IInput>({
    fullname: '',
    phone: '',
    country: '',
    city: '',
    address: '',
  });
  const [requestError, setRequestError] = useState<string>('');
  const [password, setPassword] = useState<IInput>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [inputPasswordError, setInputPasswordError] = useState<IInput>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loadFavorites, setLoadFavorites] = useState<IFavorite[]>(favorites);
  const setFavorite = useSetRecoilState(baseFavorites);
  const [ids, setIds] = useState<number[]>([]);
  const [requestSuccess, setRequestSuccess] = useState<string>('');
  const [loadOrders] = useState<IOrder[]>([...orders]);

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
    router.push(`account?tabIdx=${tabIndex}`);
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
                      {infoInputs.map((input) => {
                        return (
                          <Fragment key={input.id}>
                            {inputInfoError[input.name] && (
                              <Error message={inputInfoError[input.name]} />
                            )}
                            <Input
                              type={input.type}
                              id={input.id}
                              name={input.name}
                              placeholder={input.placeholder}
                              value={user[input.name]}
                              onChange={handleChangeInfo}
                              onBlur={validateInfo}
                              onKeyPress={validateInfo}
                            />
                          </Fragment>
                        );
                      })}
                      <Button type="submit" classNames={styles.saveBtn} label={'Save'} />
                    </form>
                  </div>
                  <div>
                    <h3>Change password</h3>
                    <form onSubmit={changePassword}>
                      {passwordInputs.map((input) => {
                        return (
                          <Fragment key={input.id}>
                            {inputPasswordError[input.name] && (
                              <Error message={inputPasswordError[input.name]} />
                            )}
                            <Input
                              type={input.type}
                              id={input.id}
                              name={input.name}
                              placeholder={input.placeholder}
                              value={user[input.name]}
                              onChange={handleChangePassword}
                              onBlur={validatePassword}
                              onKeyPress={validatePassword}
                            />
                          </Fragment>
                        );
                      })}
                      <Button type="submit" classNames={styles.saveBtn} label={'Change password'} />
                    </form>
                  </div>
                </>
              ) : tabIndex === 2 ? (
                loadOrders.map((order: IOrder) => {
                  return (
                    <div key={order.id} className={styles.cardWrap}>
                      <Card classNames={styles.card}>
                        <Link href={`/order/${order.id}`}>
                          <a>
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
                          </a>
                        </Link>
                      </Card>
                    </div>
                  );
                })
              ) : tabIndex === 3 ? (
                <>
                  <div className={styles.favoritesWrap}>
                    {loadFavorites.length ? (
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
                      })
                    ) : (
                      <Error message={"You don't have any favorites"} />
                    )}
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
  props: { userInfo: IInfoFields; favorites: IFavorites; orders: IOrder[] };
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
  const ordersPromise = fetch(`${process.env.API_URL}/orders`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const [accountResponse, favoritesResponse, ordersResponse] = await Promise.all([
    accountPromise,
    favoritesPromise,
    ordersPromise,
  ]);
  const userInfo = await accountResponse.json();
  const favorites = await favoritesResponse.json();
  const orders = await ordersResponse.json();

  return {
    props: { userInfo, favorites, orders },
  };
};
