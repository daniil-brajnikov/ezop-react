import React, { FC, ChangeEvent } from 'react';
import classnames from 'classnames';
import styles from './style.scss';
import CollapseIcon from '../../icons/LeftArrowCircle.svg';
import Header from '../Header/Header';
import Button from '../Button/Button';

interface Props {
  items: string[];
  isOpen: boolean;
  value: string;
  className?: string;
  description: string;
  onCollapseClick?(): void;
  onItemClick(name: string): void;
  onApplyButtonClick(value: string): void;
}

const Dictionary: FC<Props> = ({
  items,
  isOpen,
  value,
  description,
  className,
  onItemClick,
  onCollapseClick,
  onApplyButtonClick
}) => {
  const handleValueChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onItemClick(event.target.value);
  };
  const handleApplyClick = () => {
    const name = description.split('Типы аргументов:')[0].split('Текст:')[1].trim();
    onApplyButtonClick(value === '' ? name : (value + '\n' + name));
  }

  return isOpen && items ? (
    <div className={classnames(styles.main, className)}>
      <Header
        name="Словарь"
        icon={<CollapseIcon width={20} />}
        onIconClick={onCollapseClick}
      />
      <select
        size={items.length}
        className={styles.items}
        onChange={handleValueChange}
      >
        {items.map(item => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
      </select>
      <div>
        <Header name="Описание шаблона" />
        <div className={styles.description}>{description}</div>
        <div>
          <Button
            className={styles.button}
            title="Применить шаблон"
            isDisabled={!description.includes('\n')}
            onClick={handleApplyClick}
          >
            <div >
              Применить шаблон
            </div>
          </Button>
        </div>
      </div>
    </div>
  ) : null;
};

export default Dictionary;
