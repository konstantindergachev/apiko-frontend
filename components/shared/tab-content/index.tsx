import styles from './styles.module.css';

export const TabContent: React.FC = ({ children }): JSX.Element => (
  <div className={styles.tabContent}>{children}</div>
);
