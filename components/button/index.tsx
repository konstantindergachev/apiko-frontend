interface IProps {
  classNames: string;
  label: string;
  onClick: () => void;
}

export const Button: React.FC<IProps> = ({ classNames, label, onClick }): JSX.Element => {
  return (
    <button className={classNames} onClick={onClick}>
      {label}
    </button>
  );
};
