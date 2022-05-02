import Image from 'next/image';
import magnifier from '@/images/magnifier.svg';
import category from '@/images/category.svg';
import sort from '@/images/sort.svg';

import styles from './styles.module.css';

export const Panel: React.FC = (): JSX.Element => {
  return (
    <section className={styles.panel}>
      <fieldset>
        <Image src={magnifier} alt={'magnifier'} width={20} height={20} />
        <input type="text" placeholder="Search products by name" />
      </fieldset>
      <fieldset>
        <Image src={category} alt={'category'} width={20} height={20} />
        <select className={styles.classic}>
          <option value="Chose Category">Choose Category</option>
          <option value="All">All</option>
          <option value="eiusmod et">eiusmod et</option>
          <option value="cillum nostrud">cillum nostrud</option>
          <option value="esse ipsum">esse ipsum</option>
          <option value="esse irure">esse irure</option>
          <option value="cupidatat nostrud">cupidatat nostrud</option>
          <option value="sint excepteur">sint excepteur</option>
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
