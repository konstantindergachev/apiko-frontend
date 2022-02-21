import Link from 'next/link';
import Image from 'next/image';
import logo from '@/images/logo.svg';
import { menu } from './config';

import styles from './styles.module.css';

export const Header: React.FC = (): JSX.Element => {
  return (
    <header className={styles.header}>
      <Link href="/">
        <a>
          <Image src={logo} alt="app logo" width={102} height={41.88} />
        </a>
      </Link>

      <nav>
        {menu.map((item) =>
          item.component ? (
            <Link key={item.name} href={item.path}>
              <a>
                <Image src={item.img} alt={item.name} width={18} height={18} />
              </a>
            </Link>
          ) : (
            <Link key={item.name} href={item.path}>
              <a>{item.name}</a>
            </Link>
          )
        )}
      </nav>
    </header>
  );
};
