import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { IProduct, IProducts } from '@/interfaces/products';
import { Card } from '@/components/shared/card';
import { LikeButton } from '@/components/like';
import Modal from '@/components/shared/modal';
import { Login } from '@/components/login';
import { Register } from '@/components/register';
import { Error } from '@/components/shared/error';
import { Success } from '@/components/shared/success';
import { IResponse, IResponseError } from '@/interfaces/responses';
import { selectUsername } from '../../store';

import styles from './styles.module.css';
export const Products: React.FC<IProducts> = ({ products }): JSX.Element => {
  const storedFullname = useRecoilValue(selectUsername);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [ids, setIds] = useState<number[]>([]);
  const [preAccount, setPreAccount] = useState<boolean>(true);
  const [isAccount, setIsAccount] = useState<boolean>(false);
  const [requestError, setRequestError] = useState<string>('');
  const [requestSuccess, setRequestSuccess] = useState<string>('');

  useEffect(() => {
    const productsId: number[] = [];
    products.forEach((product: IProduct) => {
      if (product.favorite) {
        productsId.push(product.id);
      }
    });
    setIds([...productsId]);
  }, [products]);

  const handleAccount = (isAccount: boolean) => (): void => {
    setPreAccount(false);
    setIsAccount(isAccount);
  };

  const handleModalOpen = () => (): void => {
    setIsModalOpen(!isModalOpen);
  };

  const handleProductLike = (productId: number) => (): void => {
    if (!storedFullname.fullname) {
      setIsModalOpen(true);
    } else if (ids.includes(productId)) {
      removeLike(productId, storedFullname.id);
      const filteredIds = ids.filter((id) => id !== productId);
      setIds([...filteredIds]);
    } else {
      addLike(productId, storedFullname.id);
      setIds([...ids, productId]);
    }
  };

  const removeLike = async (productId: number, userId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/favorites/remove?productId=${productId}&userId=${userId}`
      );
      const data: IResponse & IResponseError = await response.json();

      if (data.message) {
        setRequestSuccess(data.message);
      }
    } catch (error: any) {
      setRequestError(error.message);
    }
  };

  const addLike = async (productId: number, userId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/favorites/add?productId=${productId}&userId=${userId}`
      );
      const data: IResponse & IResponseError = await response.json();

      if (data.message) {
        setRequestSuccess(data.message);
      }
    } catch (error: any) {
      setRequestError(error.message);
    }
  };

  return (
    <>
      {requestError && <Error message={requestError} />}
      {requestSuccess && <Success message={requestSuccess} />}
      <section className={styles.products}>
        {products.map((product: IProduct) => {
          return (
            <Link key={product.id} href={`/product/${product.id}`}>
              <a>
                <Card>
                  {product.picture && (
                    <Image src={product.picture} alt={product.title} width={200} height={200} />
                  )}
                  <div className={styles.content}>
                    <p>{product.title}</p>
                    <h3>$ {product.price}</h3>
                  </div>
                  <LikeButton
                    onClick={handleProductLike}
                    productId={product.id}
                    isLiked={ids.includes(product.id)}
                  />
                </Card>
              </a>
            </Link>
          );
        })}
        <Modal isOpen={!storedFullname.fullname && isModalOpen} onClose={handleModalOpen()}>
          {preAccount ? (
            <div className={styles.like}>
              <h3>To continue please register or log in</h3>
              <button onClick={handleAccount(true)}>Continue to sign in</button>
              <button onClick={handleAccount(false)}>Continue to register</button>
              <button onClick={handleModalOpen()}>Continue as guest</button>
            </div>
          ) : isAccount ? (
            <Login handleAccount={handleAccount} />
          ) : (
            <Register handleAccount={handleAccount} />
          )}
        </Modal>
      </section>
    </>
  );
};
