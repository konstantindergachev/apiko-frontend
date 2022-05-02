import type { NextPage, GetServerSideProps } from 'next';
import { Products } from '@/components/products';
import { BaseLayout } from '@/layout/base-layout';
import { IProducts } from '@/interfaces/products';
import AppHead from '@/layout/head';
import { Panel } from '@/components/panel';

const Home: NextPage<IProducts> = ({ products }): JSX.Element => {
  return (
    <>
      <AppHead title="Home" />
      <BaseLayout>
        <main>
          <Panel />
          <Products products={products} />
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
