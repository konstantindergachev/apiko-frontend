import { useState } from 'react';
import Image from 'next/image';
import like from '@/images/like.svg';

import styles from './styles.module.css';

export const LikeButton: React.FC = (): JSX.Element => {
  const [isLiked, setLiked] = useState({ isLiked: false });

  const handleClick = () => {
    setLiked((prev) => ({ isLiked: !prev.isLiked }));
  };

  return (
    <button
      type="button"
      className={isLiked.isLiked ? `${styles.like} ${styles.liked}` : styles.like}
      onClick={handleClick}
    >
      <Image src={like} alt="like" width={18} height={18} />
    </button>
  );
};
