import { BaseLayout } from '@/layout/base-layout';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { selectUsername } from 'store';
import { takeFirstChar } from 'utils';

import styles from './styles.module.css';

const Account: React.FC = (): JSX.Element => {
  const { id, ...account } = useRecoilValue(selectUsername);
  const [tabIndex, setTabIndex] = useState<number>(0);

  const handleTabs = (tabIndex: number) => (): void => {
    setTabIndex(tabIndex);
  };

  return (
    <BaseLayout>
      <main>
        <section className={styles.account}>
          <div className={styles.top}>
            <div>{takeFirstChar(account.fullname)}</div>
            <p>{account.fullname}</p>
          </div>
          <div className={styles.middle}>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${tabIndex === 1 && styles.active}`}
                onClick={handleTabs(1)}
              >
                edit account
              </button>
              <button
                className={`${styles.tab} ${tabIndex === 2 && styles.active}`}
                onClick={handleTabs(2)}
              >
                order history
              </button>
              <button
                className={`${styles.tab} ${tabIndex === 3 && styles.active}`}
                onClick={handleTabs(3)}
              >
                favourites
              </button>
            </div>
            <div className={styles.tabContent}>
              {tabIndex === 1 ? (
                <h4>Account</h4>
              ) : tabIndex === 2 ? (
                <h4>Order</h4>
              ) : tabIndex === 3 ? (
                <h4>Favorites</h4>
              ) : null}
            </div>
          </div>
        </section>
      </main>
    </BaseLayout>
  );
};

export default Account;
