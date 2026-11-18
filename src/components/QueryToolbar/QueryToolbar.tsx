import React, { FC } from 'react';
import RunIcon from '../../icons/Run.svg';
import DeleteIcon from '../../icons/Delete.svg';
import ZoomInIcon from '../../icons/ZoomIn.svg';
import ZoomOutIcon from '../../icons/ZoomOut.svg';
import PencilIcon from '../../icons/Pencil.svg';
import Toolbar, { ToolbarProps } from '../Toolbar/Toolbar';
import Button from '../Button/Button';

interface Props extends Pick<ToolbarProps, 'status'> {
  onDeleteClick(): void;
  onZoomInClick(): void;
  onZoomOutClick(): void;
  onRunClick(): void;
  onEditClick(): void;
}

const QueryToolbar: FC<Props> = ({
  status,
  onDeleteClick,
  onZoomInClick,
  onZoomOutClick,
  onRunClick,
  onEditClick
}) => {
  const buttons = [
    ...(status === 'success'
      ? [
          <Button title="Изменить запрос" onClick={onEditClick} key="edit">
            <PencilIcon width={25} height={25} />
          </Button>
        ]
      : []),
    <Button
      title="Увеличить шрифт в окне запроса"
      onClick={onZoomInClick}
      key="zoom-in"
    >
      <ZoomInIcon width={24} />
    </Button>,
    <Button
      title="Уменьшить шрифт в окне запроса"
      onClick={onZoomOutClick}
      key="zoom-out"
    >
      <ZoomOutIcon width={24} />
    </Button>,
    <Button title="Очистить окно запроса" onClick={onDeleteClick} key="delete">
      <DeleteIcon width={28} />
    </Button>
  ];

  const mainButton = (
    <Button title="Выполнить запрос" onClick={onRunClick}>
      <RunIcon width={43} />
    </Button>
  );

  return <Toolbar status={status} buttons={buttons} mainButton={mainButton} />;
};

export default QueryToolbar;
