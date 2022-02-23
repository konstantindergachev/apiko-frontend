import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import Link from 'next/link';
import Image from 'next/image';
import Modal from '@/components/shared/modal';
import { Login } from '@/components/login';

import logo from '@/images/logo.svg';
import { menu } from './config';
import styles from './styles.module.css';
import { Register } from '@/components/register';
import { selectUsername } from '../../store';

export const Header: React.FC = (): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAccount, setIsAccount] = useState<boolean>(false);

  const storedFullname = useRecoilValue(selectUsername);

  const handleAccount = (isAccount: boolean) => (): void => {
    setIsAccount(isAccount);
  };

  const handleModalOpen = (menuName?: string) => (): void => {
    setIsModalOpen(!isModalOpen);
    if (menuName === 'Register') {
      handleAccount(false)();
    } else {
      handleAccount(true)();
    }
  };

  return (
    <header className={styles.header}>
      <Link href="/">
        <a>
          <Image src={logo} alt="app logo" width={102} height={41.88} />
        </a>
      </Link>

      <nav>
        {menu
          .filter((route) => (route['guard'] ? route.guard(!!storedFullname) : route))
          .map((route) =>
            route.component ? (
              <Link key={route.name} href={route.path}>
                <a>
                  <Image src={route.img} alt={route.name} width={18} height={18} />
                </a>
              </Link>
            ) : (
              <>
                <button type="button" key={route.name} onClick={handleModalOpen(route.name)}>
                  {route.name}
                </button>
              </>
            )
          )}
        {storedFullname && <p>Welcome, {storedFullname}!</p>}
        <Modal isOpen={!storedFullname && isModalOpen} onClose={handleModalOpen()}>
          {isAccount ? (
            <Login handleAccount={handleAccount} />
          ) : (
            <Register handleAccount={handleAccount} />
          )}
        </Modal>
      </nav>
    </header>
  );
};
