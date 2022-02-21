import { Footer } from '@/layout/footer';
import { Header } from '@/layout/header';

export const BaseLayout: React.FC = ({ children }): JSX.Element => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};
