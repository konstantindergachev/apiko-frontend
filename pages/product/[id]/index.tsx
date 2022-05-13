import { BaseLayout } from '@/layout/base-layout';
import { GetServerSideProps, NextPage } from 'next';
import { IOneProduct } from '@/interfaces/products';
import { Card } from '@/components/shared/card';
import { Button } from '@/components/shared/button';
import Image from 'next/image';

import styles from './styles.module.css';

const Product: NextPage<IOneProduct> = ({ product }): JSX.Element => {
  const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    +product.price
  );
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
                price <span>{currency}</span>
              </p>
              <div className={styles.buttons}>
                <Button type="button" classNames={styles.countBtns} label={'-'} />
                <span>{1}</span>
                <Button type="button" classNames={styles.countBtns} label={'+'} />
              </div>
            </div>
            <div className={styles.bottom}>
              <p>
                Items:<span>{1}</span>
              </p>
              <p>
                Total: <span>{currency}</span>
              </p>
            </div>
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
