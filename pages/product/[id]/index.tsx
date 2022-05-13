import { BaseLayout } from '@/layout/base-layout';
import { GetServerSideProps, NextPage } from 'next';
import { IOneProduct } from '@/interfaces/products';
import { Card } from '@/components/shared/card';
import { Button } from '@/components/shared/button';
import Image from 'next/image';

import styles from './styles.module.css';

const Product: NextPage<IOneProduct> = ({ product }): JSX.Element => {
  return (
    <BaseLayout>
      <main>
        <section className={styles.product}>
          <Card>
            <Image src={product.picture} alt={product.title} width={200} height={200} />
          </Card>
          <div className={styles.contentRight}>
            <h1>{product.title}</h1>
            <p>{product.description}</p>
            <p>
              price <span>{product.price}</span>
            </p>
            <div className={styles.buttons}>
              <Button type="button" classNames={styles.countBtns} label={'-'} />
              <span>{1}</span>
              <Button type="button" classNames={styles.countBtns} label={'+'} />
            </div>
            <p>
              Items: <span>{1}</span>
            </p>
            <p>
              Total: <span>{product.price}</span>
            </p>
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
