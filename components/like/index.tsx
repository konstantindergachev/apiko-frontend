import styles from './styles.module.css';

interface ILikeButton {
  onClick: (id: number) => () => void;
  productId: number;
  isLiked: boolean;
}

export const LikeButton: React.FC<ILikeButton> = ({ onClick, productId, isLiked }): JSX.Element => {
  return (
    <button type="button" className={styles.like} onClick={onClick(productId)}>
      <div className={isLiked ? `${styles.heart} ${styles.active}` : styles.heart}></div>
    </button>
  );
};
