import Image from 'next/image';
import { Card } from '@/components/shared/card';
import { IItemOrder, IOrder, IProduct } from '@/interfaces/orders';
import { BaseLayout } from '@/layout/base-layout';
import { parse } from 'cookie';
import { GetServerSideProps } from 'next';

import { dateFormat, numberFormat } from 'utils';
import * as http from '../../../utils/fetch';
import styles from './styles.module.css';

const Order: React.FC<IOrder> = ({ id, total, created_at, items, shipment }): JSX.Element => {
  return (
    <BaseLayout>
      <main>
        <section className={styles.order}>
          <h1>Order details ID:{id}</h1>
          {items.map((item: IItemOrder) => {
            return (
              <div key={item.product.id}>
                <Card classNames={styles.card}>
                  <Image
                    src={item.product.picture}
                    alt={item.product.title}
                    width={200}
                    height={150}
                  />
                  <div>
                    <h3>{item.product.title}</h3>
                    <h4>
                      Items: <span>{item.quantity}</span>
                    </h4>
                  </div>
                  <div>
                    <h5>Price:</h5>
                    <p>{numberFormat(item.quantity * item.product.price)}</p>
                  </div>
                </Card>
              </div>
            );
          })}
          <div className={styles.summary}>
            <div>
              <p>
                Date: <span>{dateFormat(created_at)}</span>
              </p>
              <p>
                Address: <span>{shipment.address}</span>, <span>{shipment.city}</span>,{' '}
                <span>{shipment.country}</span>
              </p>
            </div>
            <div>
              <p>
                Items: <span>{items.length}</span>
              </p>
              <p>
                Total: <span>{numberFormat(total)}</span>
              </p>
            </div>
          </div>
        </section>
      </main>
    </BaseLayout>
  );
};

export default Order;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query: { id },
}): Promise<{ props: IOrder }> => {
  let cookie;
  let token;
  if (req.headers.cookie) {
    cookie = parse(req.headers.cookie);
    token = cookie.token;
  }
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const order = await http.get<IOrder>(`${process.env.API_URL}/orders/${id}`, { headers });
  const preResponseOrderItems = order.items.map((item: IItemOrder) => {
    order.products.forEach((product: IProduct) => {
      if (product.id === item.productId) {
        item.orderedPrice = item.quantity * product.price;
        item.product = product;
      }
    });
    delete item.productId;
    return item;
  });
  order.items = preResponseOrderItems;
  return {
    props: { ...order },
  };
};
