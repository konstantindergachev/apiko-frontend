import styles from './footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>Copyright &copy; {new Date().getFullYear()}. Privacy Policy.</p>
    </footer>
  );
};
