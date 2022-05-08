import styles from './styles.module.css';

type Message = {
  message: string;
};

export const Success: React.FC<Message> = ({ message }): JSX.Element => {
  return <h4 className={styles.text}>{message}</h4>;
};
