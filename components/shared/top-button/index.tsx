import Link from 'next/link';

import styles from './styles.module.css';

interface IProps {
  pathname: string;
}

export const TopButton: React.FC<IProps> = ({ pathname }): JSX.Element => {
  return (
    <div className={styles.topButton}>
      <Link href={pathname}>&#11014;</Link>
    </div>
  );
};
