import styles from './styles.module.css';

export const Card: React.FC = ({ children }): JSX.Element => {
  return <article className={styles.card}>{children}</article>;
};
