export interface IPanel {
  onSearch: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  searchField: string;
}
