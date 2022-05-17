import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { BaseLayout } from '@/layout/base-layout';
import { GetServerSideProps, NextPage } from 'next';
import { IOneProduct } from '@/interfaces/products';
import { Card } from '@/components/shared/card';
import { Button } from '@/components/shared/button';
import Modal from '@/components/shared/modal';
import { Login } from '@/components/login';
import { Register } from '@/components/register';
import { productsCount, selectUsername } from 'store';

import { numberFormat } from 'utils';
import styles from './styles.module.css';

const Product: NextPage<IOneProduct> = ({ product }): JSX.Element => {
  const [count, setCount] = useState<number>(1);
  const oneProductPrice = numberFormat(+product.price);
  const [total, setTotal] = useState<number>(0);
  const storedFullname = useRecoilValue(selectUsername);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [preAccount, setPreAccount] = useState<boolean>(true);
  const [isAccount, setIsAccount] = useState<boolean>(false);

  const setProductsCount = useSetRecoilState(productsCount);

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

  const addToCart = (): void => {
    if (!storedFullname.fullname) {
      setIsModalOpen(true);
    } else {
      setProductsCount((prev) => ({ count: prev.count + count }));
    }
  };

  return (
    <BaseLayout>
      <main>
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
              onClick={addToCart}
            />
            <Button type="button" classNames={styles.addBtn} label={'Add to favorites'} />
            <Button type="button" classNames={styles.addBtn} label={'Buy now'} />
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
  const response = await fetch(`${process.env.API_URL}/products/${id}`);
  const product = await response.json();

  return {
    props: { product },
  };
};
