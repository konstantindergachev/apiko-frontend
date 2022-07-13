import React, { useEffect, useState } from 'react';
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
import { baseUsername, selectUsername, selectBasket } from 'store';
import { IMenu } from '@/interfaces/menu';
import { takeFirstChar, takeFirstWord } from 'utils';

import logo from '@/images/logo.svg';
import arrow from '@/images/down_arrow.svg';
import { menu } from './config';
import styles from './styles.module.css';
import { useRouter } from 'next/router';

export const Header: React.FC = (): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAccount, setIsAccount] = useState<boolean>(false);
  const [isDropdown, setIsDropdown] = useState<boolean>(false);
  const [productCount, setProductCount] = useState<number>(0);
  const [error, setError] = useState<string>('');

  const { id, ...account } = useRecoilValue(selectUsername);
  const setUsername = useSetRecoilState(baseUsername);
  const basketProducts = useRecoilValue(selectBasket);
  const router = useRouter();

  useEffect(() => {
    const count = basketProducts.reduce((acc, cur) => acc + cur.quantity, 0);
    setProductCount(count);
  }, [basketProducts]);

  const getMenuIcon = (route: IMenu): JSX.Element => {
    if (route.name === 'Basket') {
      return (
        <Link key={route.name} href={route.path}>
          <a>
            <Image src={route.img} alt={route.name} width={18} height={18} />
            {account.fullname && productCount > 0 && (
              <span className={styles.count}>{productCount}</span>
            )}
          </a>
        </Link>
      );
    }
    return (
      <Link key={route.name} href={route.path}>
        <a>
          <Image src={route.img} alt={route.name} width={18} height={18} />
        </a>
      </Link>
    );
  };

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
      router.push('/');
      await fetch(`${process.env.NEXT_PUBLIC_PROXI_URL}/user/logout`);
      setUsername(() => ({ id: 0, fullname: '', email: '' }));
      setIsModalOpen(false);
    } catch (error: any) {
      setError(error.message);
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
          .filter((route) => (route['guard'] ? route.guard(!!account.fullname) : route))
          .map((route) =>
            route.component ? (
              getMenuIcon(route)
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
            <p>Welcome, {takeFirstWord(account.fullname)}!</p>
            <div>{takeFirstChar(account.fullname)}</div>
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
            {Object.values(account).map((val) => {
              return <DropdownItem key={val}>{val}</DropdownItem>;
            })}
            <hr />
            <DropdownItem>
              <Link
                href={{
                  pathname: '/account',
                  query: { tabIdx: 1 },
                }}
              >
                <a>settings</a>
              </Link>
            </DropdownItem>
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
