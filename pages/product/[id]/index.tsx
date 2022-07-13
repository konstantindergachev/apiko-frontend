import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { BaseLayout } from '@/layout/base-layout';
import { GetServerSideProps, NextPage } from 'next';
import { IOneProduct, IProduct } from '@/interfaces/products';
import { IResponse, IResponseError } from '@/interfaces/responses';
import { Card } from '@/components/shared/card';
import { Button } from '@/components/shared/button';
import Modal from '@/components/shared/modal';
import { Login } from '@/components/login';
import { Register } from '@/components/register';
import { baseBasket, baseProduct, selectProduct, selectUsername } from 'store';
import { Error } from '@/components/shared/error';
import { Success } from '@/components/shared/success';

import { numberFormat } from 'utils';
import * as http from '../../../utils/fetch';
import styles from './styles.module.css';

const Product: NextPage<IProduct> = ({ ...product }): JSX.Element => {
  const [count, setCount] = useState<number>(1);
  const oneProductPrice = numberFormat(+product.price);
  const [total, setTotal] = useState<number>(0);
  const storedFullname = useRecoilValue(selectUsername);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [preAccount, setPreAccount] = useState<boolean>(true);
  const [isAccount, setIsAccount] = useState<boolean>(false);
  const [requestError, setRequestError] = useState<string>('');
  const [requestSuccess, setRequestSuccess] = useState<string>('');

  const setProductsCount = useSetRecoilState(baseProduct);
  const recoilProduct = useRecoilValue(selectProduct);
  const setProductsToBasket = useSetRecoilState(baseBasket);

  useEffect(() => {
    const toFixedPrice = (+product.price * count).toFixed(2);
    setTotal(+toFixedPrice);
  }, [total, count]);

  const increment = (): void => {
    setCount(count + 1);
  };
  const decrement = (): void => {
    if (count === 1) {
      return;
    }
    setCount(count - 1);
  };

  const handleModalOpen = () => (): void => {
    setIsModalOpen(!isModalOpen);
  };

  const handleAccount = (isAccount: boolean) => (): void => {
    setPreAccount(false);
    setIsAccount(isAccount);
  };

  const addToCart = (id: number) => (): void => {
    if (!storedFullname.fullname) {
      setIsModalOpen(true);
    }

    if (recoilProduct.id === id && recoilProduct.count > 0) {
      setProductsCount(() => ({ id, count }));
      return;
    }
    setProductsCount((prev) => ({ id, count: prev.count + count }));

    const productWithQuantity = { ...product, quantity: count };
    setProductsToBasket((prev) => {
      return [...prev, productWithQuantity];
    });
  };

  const addLike = (productId: number, userId: number) => async (): Promise<void> => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/favorites/add?productId=${productId}&userId=${userId}`
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
        {requestError && (
          <div className={styles.message}>
            <Error message={requestError} />
          </div>
        )}
        {requestSuccess && (
          <div className={styles.message}>
            <Success message={requestSuccess} />
          </div>
        )}
        <section className={styles.product}>
          <Card classNames={styles.card}>
            <Image src={product.picture} alt={product.title} width={420} height={320} />
          </Card>
          <div className={styles.contentRight}>
            <div className={styles.top}>
              <h1 className={styles.title}>{product.title}</h1>
              <p>{product.description}</p>
            </div>
            <div className={styles.middle}>
              <p className={styles.price}>
                price <span>{oneProductPrice}</span>
              </p>
              <div className={styles.buttons}>
                <Button
                  type="button"
                  classNames={styles.countBtns}
                  label={'-'}
                  onClick={decrement}
                />
                <span>{count}</span>
                <Button
                  type="button"
                  classNames={styles.countBtns}
                  label={'+'}
                  onClick={increment}
                />
              </div>
            </div>
            <div className={styles.bottom}>
              <p>
                Items:<span>{count}</span>
              </p>
              <p>
                Total: <span>{numberFormat(total)}</span>
              </p>
            </div>
          </div>
          <div className={styles.btns}>
            <Button
              type="button"
              classNames={styles.addBtn}
              label={'Add to cart'}
              onClick={addToCart(product.id)}
            />
            <Button
              type="button"
              classNames={styles.addBtn}
              label={'Add to favorites'}
              onClick={addLike(product.id, storedFullname.id)}
            />
            <Link href={'/basket'}>
              <a className={styles.addBtn}>Buy now</a>
            </Link>
          </div>
        </section>
        <Modal isOpen={!storedFullname.fullname && isModalOpen} onClose={handleModalOpen()}>
          {preAccount ? (
            <div className={styles.addModal}>
              <h3>To continue please register or log in</h3>
              <Button
                type="button"
                classNames={styles.addBtn}
                onClick={handleAccount(true)}
                label={'Continue to sign in'}
              />
              <Button
                type="button"
                classNames={styles.addBtn}
                onClick={handleAccount(false)}
                label={'Continue to register'}
              />
              <Button
                type="button"
                classNames={styles.addBtn}
                onClick={handleModalOpen()}
                label={'Continue as guest'}
              />
            </div>
          ) : isAccount ? (
            <Login handleAccount={handleAccount} />
          ) : (
            <Register handleAccount={handleAccount} />
          )}
        </Modal>
      </main>
    </BaseLayout>
  );
};

export default Product;

export const getServerSideProps: GetServerSideProps = async ({
  query: { id },
}): Promise<{ props: IOneProduct }> => {
  const product = await http.get<IOneProduct>(`${process.env.API_URL}/products/${id}`);
  return {
    props: { ...product },
  };
};
