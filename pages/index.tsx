import React, { useState } from 'react';
import type { NextPage, GetServerSideProps } from 'next';
import { Products } from '@/components/products';
import { BaseLayout } from '@/layout/base-layout';
import { IProducts } from '@/interfaces/products';
import AppHead from '@/layout/head';
import { Panel } from '@/components/panel';

const Home: NextPage<IProducts> = ({ products }): JSX.Element => {
  const [searchField, setSearchField] = useState<string>('');

  const handleSearch = (ev: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchField(ev.target.value);
  };

  const filterProducts = (searchField: string) => {
    return products.filter((product) => {
      return product.title.toLowerCase().includes(searchField);
    });
  };

  return (
    <>
      <AppHead title="Home" />
      <BaseLayout>
        <main>
          <Panel onSearch={handleSearch} searchField={searchField} />
          <Products products={filterProducts(searchField)} />
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
