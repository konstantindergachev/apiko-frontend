import { useState } from 'react';
import Image from 'next/image';
import { BaseLayout } from '@/layout/base-layout';
import { useRecoilValue } from 'recoil';
import { selectBasket } from 'store';
import { Card } from '@/components/shared/card';
import { Button } from '@/components/shared/button';

import { numberFormat } from 'utils';
import trash from '@/images/trash.svg';
import styles from './styles.module.css';

const Basket: React.FC = (): JSX.Element => {
  const basketProducts = useRecoilValue(selectBasket);
  const [count, setCount] = useState<number>(1);

  const increment = (): void => {
    setCount(count + 1);
  };
  const decrement = (): void => {
    if (count === 1) {
      return;
    }
    setCount(count - 1);
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
            <Card classNames={styles.card}>
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
