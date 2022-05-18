import Image from 'next/image';
import { BaseLayout } from '@/layout/base-layout';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { selectBasket } from 'store';
import { Card } from '@/components/shared/card';
import { Button } from '@/components/shared/button';
import { baseBasket } from 'store';
import { IProduct } from '@/interfaces/products';

import { numberFormat } from 'utils';
import trash from '@/images/trash.svg';
import styles from './styles.module.css';

const Basket: React.FC = (): JSX.Element => {
  const basketProducts = useRecoilValue(selectBasket);
  const setBasketProducts = useSetRecoilState(baseBasket);

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

  const remove = (): void => {
    console.log('product removed'); //TODO:Remove the console.log
  };

  return (
    <BaseLayout>
      <main>
        <section className={styles.section}>
          <h1>My cart</h1>
          {basketProducts.map((prod) => (
            <Card key={prod.id} classNames={styles.card}>
              <div className={styles.basketLeft}>
                <Image src={prod.picture} width={140} height={140} />
              </div>
              <div className={styles.basketMiddle}>
                <h2>{prod.title}</h2>
                <div className={styles.btns}>
                  <Button type="button" classNames={styles.removeBtn} onClick={remove}>
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
        </section>
      </main>
    </BaseLayout>
  );
};

export default Basket;
