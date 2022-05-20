import { useState } from 'react';
import Image from 'next/image';
import { BaseLayout } from '@/layout/base-layout';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { selectBasket } from 'store';
import { Card } from '@/components/shared/card';
import { Button } from '@/components/shared/button';
import { baseBasket } from 'store';
import { IProduct } from '@/interfaces/products';
import Link from 'next/link';
import { Input } from '@/components/shared/input';
import { Error } from '@/components/shared/error';

import { numberFormat } from 'utils';
import trash from '@/images/trash.svg';
import { orderSchema } from './validate';
import styles from './styles.module.css';
import { Select } from '@/components/shared/select';

const Basket: React.FC = (): JSX.Element => {
  const basketProducts = useRecoilValue(selectBasket);
  const setBasketProducts = useSetRecoilState(baseBasket);
  const [user, setUser] = useState({
    fullname: '',
    phone: '',
    country: '',
    city: '',
    address: '',
  });
  const [inputError, setInputError] = useState({
    fullname: '',
    phone: '',
    country: '',
    city: '',
    address: '',
  });
  const [requestError, setRequestError] = useState<string>('');

  const increment = (id: number) => (): void => {
    const products = basketProducts.map((prod: IProduct) => {
      const _prod = { ...prod };
      if (_prod.id === id) {
        _prod.quantity = prod.quantity + 1;
        return _prod;
      }
      return _prod;
    });
    setBasketProducts(() => [...products]);
  };
  const decrement = (id: number) => (): void => {
    const products = basketProducts.map((prod) => {
      if (prod.quantity === 1) {
        return prod;
      }

      const _prod = { ...prod };
      if (_prod.id === id) {
        _prod.quantity = prod.quantity - 1;
        return _prod;
      }
      return _prod;
    });
    setBasketProducts(() => [...products]);
  };

  const remove = (): void => {
    console.log('product removed'); //TODO:Remove the console.log
  };

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    setUser((oldState) => ({ ...oldState, [ev.target.name]: ev.target.value }));
  };

  const validate = (field: string) => async () => {
    try {
      await orderSchema.validateAt(field, user);
      setInputError((old) => ({ ...old, [field]: '' }));
    } catch (error: any) {
      setInputError((old) => ({ ...old, [field]: error.message }));
    }
  };

  const handleSubmit = async (ev: React.SyntheticEvent): Promise<void> => {
    ev.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/user/order', {
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
    <BaseLayout>
      <main>
        <section className={styles.section}>
          <h1>My cart</h1>
          <div className={styles.left}>
            {basketProducts.map((prod) => (
              <Card key={prod.id} classNames={styles.card}>
                <div className={styles.basketLeft}>
                  <Image src={prod.picture} width={140} height={140} />
                </div>
                <div className={styles.basketMiddle}>
                  <h2>{prod.title}</h2>
                  <div className={styles.btns}>
                    <Button type="button" classNames={styles.removeBtn} onClick={remove}>
                      <Image src={trash} alt={'trash can'} width={20} height={20} />
                    </Button>
                    <Button
                      type="button"
                      classNames={styles.countBtns}
                      label={'-'}
                      onClick={decrement(prod.id)}
                    />
                    <span>{prod.quantity}</span>
                    <Button
                      type="button"
                      classNames={styles.countBtns}
                      label={'+'}
                      onClick={increment(prod.id)}
                    />
                  </div>
                </div>
                <div className={styles.basketRight}>
                  <h4>Price:</h4>
                  <span>{numberFormat(+prod.price)}</span>
                </div>
              </Card>
            ))}
          </div>

          <div className={styles.right}>
            <form onSubmit={handleSubmit}>
              {requestError && <Error message={requestError} />}
              <Input
                type="text"
                id="fullname"
                name="fullname"
                placeholder="Full name"
                value={user.fullname}
                onChange={handleChange}
                onBlur={validate}
                onKeyPress={validate}
              />
              {inputError.fullname && <Error message={inputError.fullname} />}
              <Input
                type="text"
                id="phone"
                name="phone"
                placeholder="Phone number"
                value={user.phone}
                onChange={handleChange}
                onBlur={validate}
                onKeyPress={validate}
              />
              {inputError.phone && <Error message={inputError.phone} />}
              <Select
                name="country"
                id="country"
                placeholder="Country"
                value={user.country}
                onChange={handleChange}
                onBlur={validate}
                onKeyPress={validate}
              />
              {inputError.country && <Error message={inputError.country} />}
              <Input
                type="text"
                id="city"
                name="city"
                placeholder="City"
                value={user.city}
                onChange={handleChange}
                onBlur={validate}
                onKeyPress={validate}
              />
              {inputError.city && <Error message={inputError.city} />}
              <Input
                type="text"
                id="address"
                name="address"
                placeholder="Address"
                value={user.address}
                onChange={handleChange}
                onBlur={validate}
                onKeyPress={validate}
              />
              {inputError.address && <Error message={inputError.address} />}
              <div className={styles.summary}>
                <p>
                  Items: <span>{3}</span>
                </p>
                <p>
                  Total: <span>{numberFormat(3)}</span>
                </p>
              </div>
              <Button
                type="button"
                classNames={styles.confirmBtn}
                label={'Confirms the purchase'}
              />
              <Link href="/">
                <a className={styles.confirmBtn}>Continue shopping</a>
              </Link>
            </form>
          </div>
        </section>
      </main>
    </BaseLayout>
  );
};

export default Basket;
