interface ICard {
  classNames: string;
}

export const Card: React.FC<ICard> = ({ classNames, children }): JSX.Element => {
  return <article className={classNames}>{children}</article>;
};
