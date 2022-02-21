import Image from 'next/image';
import { IProducts } from '@/interfaces/products';
import like from '@/images/like.svg';
import styles from './products.module.css';

export const Products: React.FC<IProducts> = ({ products }) => {
  return (
    <section className={styles.products}>
      {products.map((product) => {
        return (
          <article key={product.id} className={styles.product}>
            {product.picture && (
              <Image src={product.picture} alt={product.title} width={200} height={200} />
            )}
            <div>
              <p>{product.title}</p>
              <h3>$ {product.price}</h3>
            </div>
            <div className={styles.like}>
              <Image src={like} alt="like" width={18} height={18} />
            </div>
          </article>
        );
      })}
    </section>
  );
};
