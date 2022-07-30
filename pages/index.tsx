import React, { useEffect, useState } from 'react';
import type { NextPage, GetServerSideProps } from 'next';
import { useRecoilValue } from 'recoil';
import { selectFavorites } from 'store';
import { addFavoritesToAll, cacheProducts } from '@/utils/index';
import { Products } from '@/components/products';
import { BaseLayout } from '@/layout/base-layout';
import { ILoadMoreSettings, IProduct, IProducts } from '@/interfaces/products';
import AppHead from '@/layout/head';
import { Panel } from '@/components/panel';
import { Error } from '@/components/shared/error';
import { Button } from '@/components/shared/button';
import { PRODUCT_LIMIT } from '@/components/products/constants';

import * as http from '@/utils/fetch';
import styles from './styles.module.css';

const Home: NextPage<IProducts> = ({ products }): JSX.Element => {
  const [searchField, setSearchField] = useState<string>('');
  const [requestError, setRequestError] = useState<string>('');
  const favorites = useRecoilValue(selectFavorites);

  const [loadMoreSettings, setLoadMoreSettings] = useState<ILoadMoreSettings>({
    offset: 0,
    limit: PRODUCT_LIMIT,
    sortBy: 'latest',
  });
  const [loadMoreProducts, setLoadMoreProducts] = useState<IProduct[]>([]);
  const { NEXT_PUBLIC_PROXI_URL } = process.env;

  useEffect(() => {
    const localStorageProducts = cacheProducts.get('products');
    const { limit, offset, sortBy } = loadMoreSettings;
    if (limit > localStorageProducts.length) {
      (async () => {
        try {
          const data = await http.get<IProducts>(
            `${NEXT_PUBLIC_PROXI_URL}/products/loadMore?offset=${offset}&limit=${limit}&sortBy=${sortBy}`
          );
          if (data.message) {
            return setRequestError(data.message);
          }
          setLoadMoreProducts(addFavoritesToAll(data.products, favorites));
          cacheProducts.set('products', data.products);
          setRequestError('');
        } catch (error: any) {
          setRequestError(error.message);
        }
      })();
    }
  }, [loadMoreSettings.limit]);

  useEffect(() => {
    const localStorageProducts = cacheProducts.get('products');
    if (localStorageProducts.length > 0) {
      setLoadMoreSettings((old) => ({
        ...old,
        limit: localStorageProducts.length,
      }));
      return setLoadMoreProducts(addFavoritesToAll(localStorageProducts, favorites));
    }
    setLoadMoreProducts(addFavoritesToAll(products, favorites));
  }, [favorites]);

  const loadMore = (num: number) => (): void => {
    setLoadMoreSettings((old) => ({
      ...old,
      limit: old.limit + num,
    }));
  };

  const handleSearch = (ev: React.ChangeEvent<HTMLInputElement>): void => {
    if (requestError) {
      setRequestError('');
    }
    setSearchField(ev.target.value);
  };

  const filterProducts = (searchField: string) => {
    const findProducts = loadMoreProducts.filter((product: IProduct) => {
      return product.title.toLowerCase().includes(searchField);
    });
    cacheProducts.set('products', findProducts);
    return findProducts;
  };

  const chooseProductsByCategory = async (
    ev: React.FormEvent<HTMLSelectElement>
  ): Promise<void> => {
    try {
      const data = await http.get<IProducts>(
        `${NEXT_PUBLIC_PROXI_URL}/categories/category?categoryId=${ev.currentTarget.value}`
      );

      if (data?.message) {
        return setRequestError(data.message);
      }
      setSearchField('');
      setLoadMoreProducts(data.products);
      cacheProducts.set('products', data.products);
      setRequestError('');
    } catch (error: any) {
      setRequestError(error.message);
    }
  };

  const sort = async (ev: React.FormEvent<HTMLSelectElement>): Promise<void> => {
    try {
      let sortBy = ev.currentTarget.value;
      const data = await http.get<IProducts>(
        `${NEXT_PUBLIC_PROXI_URL}/products/sort?sortBy=${sortBy}`
      );

      if (data?.message) {
        return setRequestError(data.message);
      }
      setSearchField('');
      setLoadMoreProducts(data.products);
      setLoadMoreSettings((old) => ({
        ...old,
        limit: data.products.length + 1,
        sortBy,
      }));
      cacheProducts.set('products', data.products);
      setRequestError('');
    } catch (error: any) {
      setRequestError(error.message);
    }
  };

  return (
    <>
      <AppHead title="Home" />
      <BaseLayout>
        <main>
          {requestError && <Error message={requestError} />}
          <Panel
            onSearch={handleSearch}
            searchField={searchField}
            chooseProductsByCategory={chooseProductsByCategory}
            chooseProductsBySort={sort}
          />
          {searchField ? (
            <Products products={filterProducts(searchField)} />
          ) : (
            <Products products={loadMoreProducts} />
          )}
        </main>
        {requestError && <Error message={requestError} />}
        {loadMoreProducts.length >= loadMoreSettings.limit && (
          <Button
            type="button"
            classNames={styles.btn}
            label="Load more..."
            onClick={loadMore(PRODUCT_LIMIT)}
          />
        )}
      </BaseLayout>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (): Promise<{
  props: IProducts;
}> => {
  const { API_URL } = process.env;
  const baseProductLimit = PRODUCT_LIMIT;
  const products = await http.get<IProduct[]>(
    `${API_URL}/products?offset=0&limit=${baseProductLimit}&sortBy=latest`
  );
  return {
    props: { products },
  };
};
