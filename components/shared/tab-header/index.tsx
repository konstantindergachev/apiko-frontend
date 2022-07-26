import { MouseEventHandler } from 'react';

import { tabs } from './config';
import styles from './styles.module.css';

type Props = {
  tabIndex: number;
  handleTabs: (tabIndex: number) => MouseEventHandler<HTMLButtonElement>;
};

export const TabHeader: React.FC<Props> = ({ tabIndex, handleTabs }): JSX.Element => (
  <div className={styles.tabs}>
    {tabs.map((tab) => {
      return (
        <button
          key={tab.id}
          className={`${styles.tab} ${tab.id === tabIndex && styles.active}`}
          onClick={handleTabs(tab.id)}
        >
          {tab.text}
        </button>
      );
    })}
  </div>
);
