import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/images/logo.svg';
import { menu } from './config';

import styles from './styles.module.css';
import Modal from '@/components/shared/modal';

export const Header: React.FC = (): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAccount, setIsAccount] = useState<boolean>(false);

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
        {menu.map((item) =>
          item.component ? (
            <Link key={item.name} href={item.path}>
              <a>
                <Image src={item.img} alt={item.name} width={18} height={18} />
              </a>
            </Link>
          ) : (
            <button type="button" key={item.name} onClick={handleModalOpen(item.name)}>
              {item.name}
            </button>
          )
        )}
        <Modal isOpen={isModalOpen} onClose={handleModalOpen()}>
          {isAccount ? (
            <>
              <h3>login</h3>
              <form>
                <input type="text" placeholder="Email" />
                <input type="text" placeholder="Password" />
                <button type="submit">log in</button>
              </form>
              <p>
                I already have no account,{' '}
                <button type="button" onClick={handleAccount(false)}>
                  register now
                </button>
              </p>
            </>
          ) : (
            <>
              <h3>register</h3>
              <form>
                <input type="text" placeholder="Full name" />
                <input type="text" placeholder="Email" />
                <input type="text" placeholder="Phone number" />
                <input type="text" placeholder="Password" />
                <button type="submit">register</button>
              </form>
              <p>
                I already have an account,{' '}
                <button type="button" onClick={handleAccount(true)}>
                  log in
                </button>
              </p>
            </>
          )}
        </Modal>
      </nav>
    </header>
  );
};
