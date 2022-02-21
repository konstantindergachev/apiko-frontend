import { Footer } from './footer';
import { Header } from './header';

export const BaseLayout: React.FC = ({ children }): JSX.Element => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};
