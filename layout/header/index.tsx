import React, { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Link from 'next/link';
import Image from 'next/image';
import Modal from '@/components/shared/modal';
import { Login } from '@/components/login';

import { menu } from './config';
import { Register } from '@/components/register';

import { Dropdown } from '@/components/shared/dropdown';
import { Error } from '@/components/shared/error';
import { baseUsername, selectUsername } from '../../store';

import logo from '@/images/logo.svg';
import arrow from '@/images/down_arrow.svg';
import styles from './styles.module.css';

export const Header: React.FC = (): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAccount, setIsAccount] = useState<boolean>(false);
  const [isDropdown, setIsDropdown] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

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

  const onExit = async () => {
    try {
      await fetch(`http://localhost:3000/api/user/logout`);
      setUsername(() => ({ fullname: '', email: '' }));
    } catch (error: any) {
      setError(error.message);
    }
  };

  const { fullname } = storedFullname;

  return (
    <header className={styles.header}>
      <Link href="/">
        <a>
          <Image src={logo} alt="app logo" width={102} height={41.88} />
        </a>
      </Link>

      <nav>
        {menu
          .filter((route) => (route['guard'] ? route.guard(!!fullname) : route))
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
        {fullname && (
          <>
            <p>Welcome, {fullname.split(' ')[0]}!</p>
            <button type="button" onClick={handleModalOpen('dropdown open')}>
              <Image src={arrow} alt={'drop down arrow'} width={10} height={10} />
            </button>
          </>
        )}
        {isDropdown && fullname && (
          <Dropdown>
            {Object.values(storedFullname).map((val) => (
              <li key={val}>{val}</li>
            ))}
            <hr />
            <li>
              <button onClick={onExit} className={styles.btn}>
                Log out
              </button>
            </li>
            {error && <Error message={error} />}
          </Dropdown>
        )}
        <Modal isOpen={!fullname && isModalOpen} onClose={handleModalOpen()}>
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
