import Image from 'next/image';
import { IProducts } from '@/interfaces/products';
import { Card } from '@/components/shared/card';
import { LikeButton } from '@/components/like';

import styles from './styles.module.css';

export const Products: React.FC<IProducts> = ({ products }): JSX.Element => {
  return (
    <section className={styles.products}>
      {products.map((product) => {
        return (
          <Card key={product.id}>
            {product.picture && (
              <Image src={product.picture} alt={product.title} width={200} height={200} />
            )}
            <div className={styles.content}>
              <p>{product.title}</p>
              <h3>$ {product.price}</h3>
            </div>
            <LikeButton />
          </Card>
        );
      })}
    </section>
  );
};
