import { Footer } from './footer';
import { Header } from './header';

import styles from './base-layout.module.css';

export const BaseLayout: React.FC = ({ children }) => {
  return (
    <section className={styles.section}>
      <Header />
      {children}
      <Footer />
    </section>
  );
};
