import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { selectUsername } from 'store';
import { parse } from 'cookie';
import { takeFirstChar } from 'utils';
import { BaseLayout } from '@/layout/base-layout';
import { Error } from '@/components/shared/error';
import { TabHeader } from '@/components/shared/tab-header';
import { TabContent } from '@/components/shared/tab-content';
import { Success } from '@/components/shared/success';
import { IInfoFields } from '@/interfaces/forms';
import { IFavorite, IFavorites } from '@/interfaces/favorites';
import { IOrder } from '@/interfaces/orders';

import AppHead from '@/layout/head';

import * as http from '../../utils/fetch';
import styles from './styles.module.css';

interface IProps {
  userInfo: IInfoFields;
  favorites: IFavorite[];
  orders: IOrder[];
  tabIdx: number;
}

const Account: NextPage<IProps> = ({ userInfo, favorites, orders, tabIdx = 2 }): JSX.Element => {
  const router = useRouter();
  const { id: userId, ...account } = useRecoilValue(selectUsername);
  const [tabIndex, setTabIndex] = useState<number>(Number(router.query?.tabIdx) || tabIdx);

  const [requestError, setRequestError] = useState<string>('');
  const [requestSuccess, setRequestSuccess] = useState<string>('');

  const handleTabs = (tabIndex: number) => (): void => {
    setTabIndex(tabIndex);
    setRequestSuccess('');
    setRequestError('');
    router.push(`account?tabIdx=${tabIndex}`);
  };

  return (
    <>
      <AppHead title="Account" />
      <BaseLayout>
        <main>
          <section className={styles.account}>
            <div className={styles.top}>
              <div>{takeFirstChar(account.fullname)}</div>
              <p>{account.fullname}</p>
            </div>
            <div className={styles.middle}>
              {requestError && <Error message={requestError} />}
              {requestSuccess && <Success message={requestSuccess} />}
              <TabHeader tabIndex={tabIndex} handleTabs={handleTabs} />
              <TabContent
                userInfo={userInfo}
                orders={orders}
                favorites={favorites}
                tabIndex={tabIndex}
                setRequestError={setRequestError}
                setRequestSuccess={setRequestSuccess}
              />
            </div>
          </section>
        </main>
      </BaseLayout>
    </>
  );
};

export default Account;

export const getServerSideProps: GetServerSideProps = async ({
  req,
}): Promise<{
  redirect?: {
    permanent: boolean;
    destination: string;
  };
  props: { userInfo?: IInfoFields; favorites?: IFavorites; orders?: IOrder[] };
}> => {
  let cookie;
  let token;
  if (req.headers.cookie) {
    cookie = parse(req.headers.cookie);
    token = cookie.token;
  }
  const baseProductLimit = 6;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const accountPromise = http.get<IInfoFields>(`${process.env.API_URL}/account`, { headers });
  const favoritesPromise = http.get<IFavorites>(
    `${process.env.API_URL}/favorite/favorites?offset=0&limit=${baseProductLimit}&sortBy=latest`,
    { headers }
  );
  const ordersPromise = http.get<IOrder[]>(`${process.env.API_URL}/orders`, { headers });
  const [userInfo, favorites, orders] = await Promise.all([
    accountPromise,
    favoritesPromise,
    ordersPromise,
  ]);

  if (Object.keys(userInfo).length === 2) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
      props: {},
    };
  }
  return {
    props: { userInfo, favorites, orders },
  };
};
