import React from 'react';
import Image from 'next/image';
import { IPanel } from '@/interfaces/panel';
import magnifier from '@/images/magnifier.svg';
import category from '@/images/category.svg';
import sort from '@/images/sort.svg';
import styles from './styles.module.css';

export const Panel: React.FC<IPanel> = ({
  onSearch,
  searchField,
  chooseProductsByCategory,
}): JSX.Element => {
  return (
    <section className={styles.panel}>
      <fieldset>
        <Image src={magnifier} alt={'magnifier'} width={20} height={20} />
        <input
          type="text"
          placeholder="Search products by name"
          onChange={onSearch}
          value={searchField}
        />
      </fieldset>
      <fieldset>
        <Image src={category} alt={'category'} width={20} height={20} />
        <select className={styles.classic} onClick={chooseProductsByCategory}>
          <option value="Chose Category">Choose Category</option>
          <option value={0}>All</option>
          <option value={1}>eiusmod et</option>
          <option value={2}>cillum nostrud</option>
          <option value={3}>esse ipsum</option>
          <option value={4}>esse irure</option>
          <option value={5}>cupidatat nostrud</option>
          <option value={6}>sint excepteur</option>
        </select>
      </fieldset>
      <fieldset>
        <Image src={sort} alt={'sort'} width={20} height={20} />
        <select className={styles.classic}>
          <option value="Sorting">Sorting</option>
          <option value="popular">popular</option>
          <option value="new">new</option>
        </select>
      </fieldset>
    </section>
  );
};
