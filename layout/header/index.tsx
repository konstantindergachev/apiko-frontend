import React, { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Link from 'next/link';
import Image from 'next/image';
import Modal from '@/components/shared/modal';
import { Login } from '@/components/login';

import logo from '@/images/logo.svg';
import { menu } from './config';
import { Register } from '@/components/register';

import { Dropdown } from '@/components/shared/dropdown';
import { baseUsername, selectUsername } from '../../store';

import arrow from '@/images/down_arrow.svg';
import styles from './styles.module.css';

export const Header: React.FC = (): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAccount, setIsAccount] = useState<boolean>(false);
  const [isDropdown, setIsDropdown] = useState<boolean>(false);

  const storedFullname = useRecoilValue(selectUsername);
  const setUsername = useSetRecoilState(baseUsername);

  const handleAccount = (isAccount: boolean) => (): void => {
    setIsAccount(isAccount);
  };

  const handleModalOpen = (menuName?: string) => (): void => {
    setIsModalOpen(!isModalOpen);
    if (menuName === 'Register') {
      handleAccount(false)();
    } else if (menuName === 'Log out') {
      setIsDropdown(false);
    } else if (menuName === 'dropdown open') {
      setIsDropdown(!isDropdown);
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
          .filter((route) => (route['guard'] ? route.guard(!!storedFullname.fullname) : route))
          .map((route) =>
            route.component ? (
              <Link key={route.name} href={route.path}>
                <a>
                  <Image src={route.img} alt={route.name} width={18} height={18} />
                </a>
              </Link>
            ) : (
              <button type="button" key={route.name} onClick={handleModalOpen(route.name)}>
                {route.name}
              </button>
            )
          )}
        {storedFullname.fullname && (
          <>
            <p>Welcome, {storedFullname.fullname.split(' ')[0]}!</p>
            <button type="button" onClick={handleModalOpen('dropdown open')}>
              <Image src={arrow} alt={'drop down arrow'} width={10} height={10} />
            </button>
          </>
        )}
        {isDropdown && storedFullname.fullname && (
          <Dropdown user={storedFullname} setUsername={setUsername} />
        )}
        <Modal isOpen={!storedFullname.fullname && isModalOpen} onClose={handleModalOpen()}>
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
