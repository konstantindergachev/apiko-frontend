import React, { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Link from 'next/link';
import Image from 'next/image';
import Modal from '@/components/shared/modal';
import { Login } from '@/components/login';
import { Register } from '@/components/register';
import { Dropdown } from '@/components/shared/dropdown';
import { Error } from '@/components/shared/error';
import { DropdownItem } from '@/components/shared/dropdown-item';
import { Button } from '@/components/shared/button';
import { baseUsername, selectUsername } from '../../store';

import logo from '@/images/logo.svg';
import arrow from '@/images/down_arrow.svg';
import { menu } from './config';
import styles from './styles.module.css';

export const Header: React.FC = (): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAccount, setIsAccount] = useState<boolean>(false);
  const [isDropdown, setIsDropdown] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const account = useRecoilValue(selectUsername);
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
      setUsername(() => ({ id: 0, fullname: '', email: '' }));
      setIsModalOpen(false);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const user = { fullname: account.fullname, email: account.email };

  return (
    <header className={styles.header}>
      <Link href="/">
        <a>
          <Image src={logo} alt="app logo" width={102} height={41.88} />
        </a>
      </Link>

      <nav>
        {menu
          .filter((route) => (route['guard'] ? route.guard(!!account.fullname) : route))
          .map((route) =>
            route.component ? (
              <Link key={route.name} href={route.path}>
                <a>
                  <Image src={route.img} alt={route.name} width={18} height={18} />
                </a>
              </Link>
            ) : (
              <Button
                type="button"
                classNames={styles.navBtn}
                key={route.name}
                onClick={handleModalOpen(route.name)}
                label={route.name}
              />
            )
          )}
        {account.fullname && (
          <>
            <p>Welcome, {account.fullname.split(' ')[0]}!</p>
            <Button
              type="button"
              classNames={styles.arrowBtn}
              onClick={handleModalOpen('dropdown open')}
            >
              <Image src={arrow} alt={'drop down arrow'} width={10} height={10} />
            </Button>
          </>
        )}
        {isDropdown && account.fullname && (
          <Dropdown>
            {Object.values(user).map((val) => {
              return <DropdownItem key={val}>{val}</DropdownItem>;
            })}
            <hr />
            <DropdownItem>
              <Button type="button" onClick={onExit} classNames={styles.btn} label={'Log out'} />
            </DropdownItem>
            {error && <Error message={error} />}
          </Dropdown>
        )}
        <Modal isOpen={!account.fullname && isModalOpen} onClose={handleModalOpen()}>
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
