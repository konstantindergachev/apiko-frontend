import { Fragment, useEffect, useState } from 'react';
import Image from 'next/image';
import { BaseLayout } from '@/layout/base-layout';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { baseOrder, selectBasket } from 'store';
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
import { Select } from '@/components/shared/select';
import Modal from '@/components/shared/modal';
import { IInput } from '@/interfaces/forms';
import { MESSAGES } from './constants';

import { inputs } from './config';
import styles from './styles.module.css';

const Basket: React.FC = (): JSX.Element => {
  const basketProducts = useRecoilValue(selectBasket);
  const setBasketProducts = useSetRecoilState(baseBasket);
  const setOrder = useSetRecoilState(baseOrder);
  const [user, setUser] = useState<IInput>({
    fullname: '',
    phone: '',
    country: '',
    city: '',
    address: '',
  });
  const [inputError, setInputError] = useState<IInput>({
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
    setRequestError('');
  };

  const validate = (field: string) => async () => {
    try {
      await orderSchema.validateAt(field, user);
      setInputError((old) => ({ ...old, [field]: '' }));
    } catch (error: any) {
      setInputError((old) => ({ ...old, [field]: error.message }));
    }
  };

  const getOrder = async (): Promise<void> => {
    const _basketProducts = basketProducts.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
    }));
    try {
      const response = await fetch('http://localhost:3000/api/user/order', {
        method: 'POST',
        body: JSON.stringify({ items: _basketProducts, shipment: user }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.message) {
        setRequestError(data.message);
        setOrder(data.order);
      }
    } catch (error: any) {
      setRequestError(error.message);
    }
  };

  const confirm = (ev: React.SyntheticEvent): void => {
    ev.preventDefault();
    const { fullname, phone, country, city, address } = user;
    if (!fullname || !phone || !country || !city || !address) {
      return setRequestError(MESSAGES.COMPLETE_FORM);
    }
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      getOrder();
    }
  };

  const close = (): void => {
    setIsModalOpen(false);
  };

  return (
    <BaseLayout>
      <main>
        <section className={styles.section}>
          <h1>My cart</h1>
          <div className={styles.left}>
            {basketProducts.length ? (
              basketProducts.map((prod) => (
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
              ))
            ) : (
              <Error message={'You do not have any products in the basket'} />
            )}
          </div>

          <div className={styles.right}>
            <form onSubmit={confirm}>
              {requestError && <Error message={requestError} />}
              {inputs.map((input) => {
                if (!input.type) {
                  return (
                    <Fragment key={input.id}>
                      {inputError[input.name] && <Error message={inputError[input.name]} />}
                      <Select
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
                }
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
              <div className={styles.summary}>
                <p>
                  Items: <span>{productCount}</span>
                </p>
                <p>
                  Total: <span>{numberFormat(totalCost)}</span>
                </p>
              </div>
              <Button
                type="submit"
                classNames={styles.confirmBtn}
                label={'Confirms the purchase'}
              />
              <Link href="/">
                <a className={styles.confirmBtn}>Continue shopping</a>
              </Link>
            </form>
          </div>
        </section>
        <Modal isOpen={isModalOpen} onClose={close}>
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
