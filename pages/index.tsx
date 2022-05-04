import React, { useEffect, useState } from 'react';
import type { NextPage, GetServerSideProps } from 'next';
import { Products } from '@/components/products';
import { BaseLayout } from '@/layout/base-layout';
import { IProduct, IProducts } from '@/interfaces/products';
import AppHead from '@/layout/head';
import { Panel } from '@/components/panel';
import { Error } from '@/components/shared/error';

const Home: NextPage<IProducts> = ({ products }): JSX.Element => {
  const [searchField, setSearchField] = useState<string>('');
  const [requestError, setRequestError] = useState<string>('');
  const [productsByCategory, setProductsByCategory] = useState<IProduct[]>([]);

  useEffect(() => {
    if (productsByCategory.length !== 0) {
      setProductsByCategory([]);
    }
  }, [searchField]);

  const handleSearch = (ev: React.ChangeEvent<HTMLInputElement>): void => {
    if (requestError) {
      setRequestError('');
    }
    setSearchField(ev.target.value);
  };

  const filterProducts = (searchField: string) => {
    return products.filter((product) => {
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
      setProductsByCategory(data.products);
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
          />
          {productsByCategory?.length ? (
            <Products products={productsByCategory} />
          ) : (
            <Products products={filterProducts(searchField)} />
          )}
        </main>
      </BaseLayout>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (): Promise<{
  props: IProducts;
}> => {
  const response = await fetch(`${process.env.API_URL}/products?offset=0&limit=20&sortBy=latest`);
  const products = await response.json();
  return {
    props: { products },
  };
};
