import { Fragment } from 'react';
import Image from 'next/image';
import { Card } from '@/components/shared/card';
import { IItemOrder, IOrder, IProduct } from '@/interfaces/orders';
import { BaseLayout } from '@/layout/base-layout';
import { parse } from 'cookie';
import { GetServerSideProps } from 'next';
import AppHead from '@/layout/head';

import { dateFormat, numberFormat } from 'utils';
import * as http from '../../../utils/fetch';
import styles from './styles.module.css';

const Order: React.FC<{ order: IOrder }> = ({ order }): JSX.Element => {
  return (
    <>
      <AppHead title="Order" />
      <BaseLayout>
        <main>
          <section className={styles.order}>
            <h1>Order details ID:{order.order.id}</h1>
            {order.order.items.map((item: IItemOrder) => {
              return (
                <Fragment key={item.product.id}>
                  <Card classNames={styles.card}>
                    <Image
                      src={item.product.picture}
                      alt={item.product.title}
                      width={200}
                      height={200}
                    />
                    <div className={styles.middle}>
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
                </Fragment>
              );
            })}
            <div className={styles.summary}>
              <div>
                <p>
                  Date: <span>{dateFormat(order.order.created_at)}</span>
                </p>
                <p>
                  Address: <span>{order.order.shipment.address}</span>,{' '}
                  <span>{order.order.shipment.city}</span>,{' '}
                  <span>{order.order.shipment.country}</span>
                </p>
              </div>
              <div>
                <p>
                  Items: <span>{order.order.items.length}</span>
                </p>
                <p>
                  Total: <span>{numberFormat(order.order.total)}</span>
                </p>
              </div>
            </div>
          </section>
        </main>
      </BaseLayout>
    </>
  );
};

export default Order;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query: { id },
}): Promise<{
  redirect?: {
    permanent: boolean;
    destination: string;
  };
  props: { order?: IOrder };
}> => {
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

  if (Object.keys(order).length === 2) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
      props: {},
    };
  }

  const preResponseOrderItems = order.order.items.map((item: IItemOrder) => {
    order.order.products.forEach((product: IProduct) => {
      if (product.id === item.productId) {
        item.orderedPrice = item.quantity * product.price;
        item.product = product;
      }
    });
    delete item.productId;
    return item;
  });
  order.order.items = preResponseOrderItems;
  return {
    props: { order },
  };
};
