import { BaseLayout } from '@/layout/base-layout';
import { GetServerSideProps, NextPage } from 'next';
import { IOneProduct } from '@/interfaces/products';
import { Card } from '@/components/shared/card';
import { Button } from '@/components/shared/button';
import Image from 'next/image';
import { useSetRecoilState } from 'recoil';

import styles from './styles.module.css';
import { useEffect, useState } from 'react';
import { numberFormat } from 'utils';
import { productsCount } from 'store';

const Product: NextPage<IOneProduct> = ({ product }): JSX.Element => {
  const [count, setCount] = useState<number>(1);
  const oneProductPrice = numberFormat(+product.price);
  const [total, setTotal] = useState<number>(0);

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

  const addToCart = (): void => {
    setProductsCount(() => ({ count }));
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
