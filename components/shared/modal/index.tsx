import { createPortal } from 'react-dom';

import styles from './styles.module.css';

interface IModal {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<IModal> = ({ isOpen, onClose, children }): JSX.Element | null => {
  if (!isOpen) return null;

  const portalDiv = document.getElementById('modal');
  return portalDiv
    ? createPortal(
        <>
          <div
            className={styles.wrapper}
            tabIndex={0}
            onClick={onClose}
            onKeyDown={onClose}
            role={'button'}
          ></div>
          <dialog open={isOpen && true} className={styles.box}>
            <div className={styles.close} onClick={onClose}>
              &#215;
            </div>
            <div className={styles.content}>{children}</div>
          </dialog>
        </>,
        portalDiv
      )
    : null;
};

export default Modal;
