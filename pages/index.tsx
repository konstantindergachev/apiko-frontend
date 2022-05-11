import React, { useEffect, useState } from 'react';
import type { NextPage, GetServerSideProps } from 'next';
import { Products } from '@/components/products';
import { BaseLayout } from '@/layout/base-layout';
import { ILoadMoreSettings, IProduct, IProducts } from '@/interfaces/products';
import AppHead from '@/layout/head';
import { Panel } from '@/components/panel';
import { Error } from '@/components/shared/error';
import { Button } from '@/components/button';

const Home: NextPage<IProducts> = ({ products }): JSX.Element => {
  const [searchField, setSearchField] = useState<string>('');
  const [requestError, setRequestError] = useState<string>('');

  const [loadMoreSettings, setLoadMoreSettings] = useState<ILoadMoreSettings>({
    offset: 0,
    limit: 6,
    sortBy: 'latest',
  });
  const [loadMoreProducts, setLoadMoreProducts] = useState<IProduct[]>(products);

  useEffect(() => {
    if (loadMoreSettings.limit > loadMoreProducts.length) {
      (async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/api/products/loadMore?offset=${loadMoreSettings.offset}&limit=${loadMoreSettings.limit}&sortBy=${loadMoreSettings.sortBy}`
          );
          const data = await response.json();
          if (data?.message) {
            setRequestError(data.message);
            return;
          }
          setLoadMoreProducts(data.products);
          setRequestError('');
        } catch (error: any) {
          setRequestError(error.message);
        }
      })();
    }
  }, [loadMoreSettings]);

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
    return loadMoreProducts.filter((product) => {
      return product.title.toLowerCase().includes(searchField);
    });
  };

  const chooseProductsByCategory = async (
    ev: React.FormEvent<HTMLSelectElement>
  ): Promise<void> => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/categories/category?categoryId=${ev.currentTarget.value}`
      );
      const data = await response.json();

      if (data?.message) {
        setRequestError(data.message);
        return;
      }
      setSearchField('');
      setLoadMoreProducts(data.products);
      setRequestError('');
    } catch (error: any) {
      setRequestError(error.message);
    }
  };

  const sort = async (ev: React.FormEvent<HTMLSelectElement>): Promise<void> => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/products/sort?sortBy=${ev.currentTarget.value}`
      );
      const data = await response.json();

      if (data?.message) {
        setRequestError(data.message);
        return;
      }
      setSearchField('');
      setLoadMoreProducts(data.products);
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
        <Button
          classNames="loadBtn"
          label="Load more..."
          onClick={loadMore(loadMoreSettings.limit)}
        />
      </BaseLayout>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (): Promise<{
  props: IProducts;
}> => {
  const baseProductLimit = 6;
  const response = await fetch(
    `${process.env.API_URL}/products?offset=0&limit=${baseProductLimit}&sortBy=latest`
  );
  const products = await response.json();
  return {
    props: { products },
  };
};
