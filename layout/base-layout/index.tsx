import { Footer } from './footer';
import { Header } from './header';

export const BaseLayout: React.FC = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};
