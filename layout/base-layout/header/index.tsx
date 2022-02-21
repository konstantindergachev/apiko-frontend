import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../images/logo.svg';
import heart from '../../../images/heart.svg';
import basket from '../../../images/basket.svg';
import styles from './header.module.css';

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <Link href="/">
        <a>
          <Image src={logo} alt="app logo" width={102} height={41.88} />
        </a>
      </Link>
      <Link href="/">
        <a>
          <Image src={heart} alt="app logo" width={18} height={18} />
        </a>
      </Link>
      <Link href="/">
        <a>
          <Image src={basket} alt="app logo" width={18} height={18} />
        </a>
      </Link>
      <Link href="/register">
        <a>Register</a>
      </Link>
      <Link href="/login">
        <a>Log in</a>
      </Link>
    </header>
  );
};
