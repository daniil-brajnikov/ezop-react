import React, { FC, ChangeEvent } from 'react';
import classnames from 'classnames';
import EditIcon from '../../icons/Pencil.svg';

import styles from './style.scss';
import AutocompleteEditor, { EditorProps }  from '../AutocompleteEditor/AutocompleteEditor';
import { ExecutionStatus } from '../../types';

interface Props extends EditorProps {
  name: string;
  status: ExecutionStatus;
  canEditName: boolean;
  statusText?: string;
  onNameEdit(name: string): void;
}

const InputAutocompleteBox: FC<Props> = ({
  name,
  status,
  statusText,
  onChange,
  fontSize,
  value,
  error,
  isReadOnly,
  canEditName,
  onNameEdit
}) => {
  const handleNameEdit = (e: ChangeEvent<HTMLInputElement>) => {
    onNameEdit(e.target.value);
  };
  return (
    <div className={styles.main}>
      <div className={classnames(styles.header, styles[status])}>
        {canEditName ? (
          <>
            <EditIcon width={18} height={18} className={styles.editIcon} />
            <input
              onChange={handleNameEdit}
              type="text"
              value={name}
              className={styles.nameEdit}
            />
          </>
        ) : (
          <span className={styles.name}>{name}</span>
        )}
        <div className={styles.rightBlock}>
          {statusText !== undefined && <span>{statusText}</span>}
        </div>
      </div>
      <AutocompleteEditor
        onChange={onChange}
        fontSize={fontSize}
        value={value}
        error={error}
        isReadOnly={isReadOnly}
      />
    </div>
  );
};

export default InputAutocompleteBox;
