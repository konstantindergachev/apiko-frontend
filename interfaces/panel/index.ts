export interface IPanel {
  onSearch: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  chooseProductsByCategory: (ev: React.FormEvent<HTMLSelectElement>) => void;
  searchField: string;
}
