import styles from './styles.module.css';

export const Dropdown: React.FC = ({ children }): JSX.Element => {
  return <ul className={styles.dropdown}>{children}</ul>;
};
