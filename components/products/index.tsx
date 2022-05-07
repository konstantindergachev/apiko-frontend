import { useState } from 'react';
import Image from 'next/image';
import { useRecoilValue } from 'recoil';
import { IProducts } from '@/interfaces/products';
import { Card } from '@/components/shared/card';
import { LikeButton } from '@/components/like';
import Modal from '@/components/shared/modal';
import { Login } from '@/components/login';
import { Register } from '@/components/register';
import { IResponse, IResponseError } from '@/interfaces/responses';
import { selectUsername } from '../../store';

import styles from './styles.module.css';
import { Error } from '../shared/error';

export const Products: React.FC<IProducts> = ({ products }): JSX.Element => {
  const storedFullname = useRecoilValue(selectUsername);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [ids, setIds] = useState<number[]>([]);
  const [preAccount, setPreAccount] = useState<boolean>(true);
  const [isAccount, setIsAccount] = useState<boolean>(false);
  const [requestError, setRequestError] = useState<string>('');

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
        setRequestError(data.message);
      }
    } catch (error: any) {
      console.log('error: ', error.message); //FIXME:
    }
  };

  const addLike = async (productId: number, userId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/favorites/add?productId=${productId}&userId=${userId}`
      );
      const data: IResponse & IResponseError = await response.json();

      if (data.message) {
        setRequestError(data.message);
      }
    } catch (error: any) {
      console.log('error: ', error.message); //FIXME:
    }
  };

  return (
    <>
      {requestError && <Error message={requestError} />}
      <section className={styles.products}>
        {products.map((product) => {
          return (
            <Card key={product.id}>
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
          );
        })}
        <Modal isOpen={!storedFullname.fullname && isModalOpen} onClose={handleModalOpen()}>
          {preAccount ? (
            <div className={styles.like}>
              <h3>To continue please  register or log in</h3>
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
