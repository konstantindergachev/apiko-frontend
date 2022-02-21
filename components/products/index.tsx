import { useState } from 'react';
import Image from 'next/image';
import { IProducts } from '@/interfaces/products';
import { Card } from '@/components/shared/card';
import { LikeButton } from '@/components/like';

import styles from './styles.module.css';

export const Products: React.FC<IProducts> = ({ products }): JSX.Element => {
  const [ids, setIds] = useState<number[]>([]);

  const handleProductLike = (productId: number) => (): void => {
    if (ids.includes(productId)) {
      const filteredIds = ids.filter((id) => id !== productId);
      setIds([...filteredIds]);
    } else {
      setIds([...ids, productId]);
    }
  };

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
            <LikeButton
              onClick={handleProductLike}
              productId={product.id}
              isLiked={ids.includes(product.id)}
            />
          </Card>
        );
      })}
    </section>
  );
};
