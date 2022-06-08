import { useEffect, useState } from 'react';
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
import Modal from '@/components/shared/modal';

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
  const [productCount, setProductCount] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const count = basketProducts.reduce((acc, cur) => acc + cur.quantity, 0);
    const total = basketProducts.reduce((acc, cur) => acc + Number(cur.price) * cur.quantity, 0);
    setProductCount(count);
    setTotalCost(total);
  }, [basketProducts]);

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

  const remove = (id: number) => (): void => {
    setBasketProducts((prev) => {
      return prev.filter((prod) => prod.id !== id);
    });
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

  const getOrder = async (ev: React.SyntheticEvent): Promise<void> => {
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

  const confirm = () => {
    setIsModalOpen(!isModalOpen);
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
                    <Button type="button" classNames={styles.removeBtn} onClick={remove(prod.id)}>
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
            <form onSubmit={getOrder}>
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
                  Items: <span>{productCount}</span>
                </p>
                <p>
                  Total: <span>{numberFormat(totalCost)}</span>
                </p>
              </div>
              <Button
                type="button"
                classNames={styles.confirmBtn}
                label={'Confirms the purchase'}
                onClick={confirm}
              />
              <Link href="/">
                <a className={styles.confirmBtn}>Continue shopping</a>
              </Link>
            </form>
          </div>
        </section>
        <Modal isOpen={isModalOpen} onClose={confirm}>
          <div className={styles.modalContent}>
            <h3>Thank you for your purchase</h3>
            <p>We will send you a notification when your order arrives to you</p>
            <Link href="/">
              <a className={styles.confirmBtn}>Continue shopping</a>
            </Link>
            <Link href="/account">
              <a className={styles.confirmBtn}>View order history</a>
            </Link>
          </div>
        </Modal>
      </main>
    </BaseLayout>
  );
};

export default Basket;