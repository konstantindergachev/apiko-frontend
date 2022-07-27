import Link from 'next/link';
import Image from 'next/image';
import { Fragment, useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Button } from '@/components/shared/button';
import { Error } from '@/components/shared/error';
import { Input } from '@/components/shared/input';
import { Card } from '@/components/shared/card';
import { LikeButton } from '@/components/like';
import { IInfoFields, IInput } from '@/interfaces/forms';
import { IOrder } from '@/interfaces/orders';
import { IFavorite } from '@/interfaces/favorites';
import { orderSchema } from 'pages/basket/validate';
import { passwordSchema } from './validate';

import { baseFavorites, selectUsername } from 'store';
import { dateFormat, numberFormat } from '@/utils/index';
import { infoInputs, passwordInputs } from './config';
import * as http from '@/utils/fetch';
import styles from './styles.module.css';

interface IProps {
  userInfo: IInfoFields;
  orders: IOrder[];
  favorites: IFavorite[];
  tabIndex: number;
  setRequestError: (message: string) => void;
  setRequestSuccess: (message: string) => void;
}

export const TabContent: React.FC<IProps> = ({
  userInfo,
  orders,
  favorites,
  tabIndex,
  setRequestError,
  setRequestSuccess,
}): JSX.Element => {
  const { id: userId } = useRecoilValue(selectUsername);
  const [loadOrders] = useState<IOrder[]>([...orders]);
  const [user, setUser] = useState<IInput>({
    fullname: '',
    phone: '',
    country: '',
    city: '',
    address: '',
  });
  useEffect(() => {
    setUser((old) => ({ ...old, ...userInfo }));
  }, []);
  useEffect(() => {
    const favoritesId: number[] = [];
    favorites.forEach((favorite: IFavorite) => {
      if (favorite.product.id) {
        favoritesId.push(favorite.product.id);
      }
    });
    setIds([...favoritesId]);
  }, [favorites]);

  const setFavorite = useSetRecoilState(baseFavorites);
  useEffect(() => {
    setFavorite(() => [...favorites]);
  }, [favorites]);

  const [inputInfoError, setInputInfoError] = useState<IInput>({
    fullname: '',
    phone: '',
    country: '',
    city: '',
    address: '',
  });

  const { NEXT_PUBLIC_PROXI_URL } = process.env;

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
      const headers = {
        'Content-Type': 'application/json',
      };
      const data = await http.post<IInput, { message: string }>(
        `${NEXT_PUBLIC_PROXI_URL}/user/account`,
        user,
        { headers }
      );
      if (data.message) {
        setRequestSuccess(data.message);
      }
    } catch (error: any) {
      setRequestError(error.message);
    }
  };

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
      const headers = {
        'Content-Type': 'application/json',
      };
      const data = await http.post<IInput, { message: string }>(
        `${NEXT_PUBLIC_PROXI_URL}/user/password`,
        password,
        { headers }
      );
      if (data.message) {
        setRequestSuccess(data.message);
      }
    } catch (error: any) {
      setRequestError(error.message);
    }
  };

  const [loadFavorites, setLoadFavorites] = useState<IFavorite[]>(favorites);
  const [ids, setIds] = useState<number[]>([]);

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
      const headers = {
        'Content-Type': 'application/json',
      };
      const data = await http.get<{ message: string }>(
        `${NEXT_PUBLIC_PROXI_URL}/favorites/remove?productId=${productId}&userId=${userId}`,
        { headers }
      );
      if (data.message) {
        setRequestSuccess(data.message);
      }
    } catch (error: any) {
      setRequestError(error.message);
    }
  };

  return (
    <div className={styles.tabContent}>
      {tabIndex === 1 ? (
        <>
          <div>
            <h3>My information</h3>
            <form onSubmit={saveInfo}>
              {infoInputs.map((input) => {
                return (
                  <Fragment key={input.id}>
                    {inputInfoError[input.name] && <Error message={inputInfoError[input.name]} />}
                    <Input
                      type={input.type}
                      id={input.id}
                      name={input.name}
                      placeholder={input.placeholder}
                      value={user[input.name] || ''}
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
                      value={password[input.name] || ''}
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
            <div key={order.order.id} className={styles.cardWrap}>
              <Card classNames={styles.card}>
                <Link href={`/order/${order.order.id}`}>
                  <a>
                    <div>
                      <p>
                        Order ID: <span>{order.order.id}</span>
                      </p>
                      <p>
                        Price: <span>{numberFormat(order.order.total)}</span>
                      </p>
                    </div>
                    <div>
                      <p>
                        Customer ID: <span>{order.order.user.id}</span>
                      </p>
                      <p>
                        Date: <span>{dateFormat(order.order.created_at)}</span>
                      </p>
                    </div>
                  </a>
                </Link>
              </Card>
            </div>
          );
        })
      ) : tabIndex === 3 ? (
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
      ) : null}
    </div>
  );
};
