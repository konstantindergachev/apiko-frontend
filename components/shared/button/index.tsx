interface IProps {
  type: 'button' | 'submit';
  classNames?: string;
  label?: string;
  onClick?: () => void;
}

export const Button: React.FC<IProps> = ({
  type = 'button',
  classNames,
  label,
  onClick,
  children,
}): JSX.Element => {
  return (
    <button type={type} className={classNames} onClick={onClick}>
      {label ? label : children}
    </button>
  );
};
